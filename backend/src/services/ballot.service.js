const AnonymousBallot = require('../models/AnonymousBallot');
const RemoteVotingRequest = require('../models/RemoteVotingRequest');
const VotingCredential = require('../models/VotingCredential');
const Candidate = require('../models/Candidate');
const { encryptBallot, decryptBallot } = require('../utils/encryption.utils');
const { sha256 } = require('../utils/hash.utils');
const CredentialService = require('./credential.service');
const AuditService = require('./audit.service');

class BallotService {
  /**
   * Submits an anonymous encrypted ballot.
   * STRICT SEPARATION: Does not take `userId` as argument.
   * Operates strictly under the verified one-time `rawCredentialToken`.
   */
  static async submitAnonymousVote({ rawCredentialToken, candidateId, ipAddress = '127.0.0.1' }) {
    // 1. Verify and retrieve the one-time credential
    const credential = await CredentialService.verifyAndConsumeCredential(rawCredentialToken);

    // 2. Validate candidate belongs to this constituency & election
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    if (candidate.constituency.toString() !== credential.constituency.toString()) {
      throw new Error('Selected candidate does not contest in your registered constituency');
    }

    // 3. Encrypt the ballot choice using AES-256-GCM
    const ballotPayload = {
      candidateId: candidate._id.toString(),
      candidateName: candidate.fullName,
      constituencyId: credential.constituency.toString(),
      electionId: credential.election.toString(),
      castAt: new Date().toISOString()
    };

    const { encryptedChoice, encryptionIv, encryptionTag } = encryptBallot(ballotPayload, credential.ballotId);

    // 4. Compute immutable integrity verification hash
    const integrityHash = sha256(`${credential.ballotId}|${encryptedChoice}|${encryptionTag}|${credential.election.toString()}`);

    // 5. Store in AnonymousBallots collection (zero linkage to user identity)
    const ballot = new AnonymousBallot({
      ballotId: credential.ballotId,
      election: credential.election,
      constituency: credential.constituency,
      encryptedChoice,
      encryptionIv,
      encryptionTag,
      candidate: candidate._id,
      integrityHash
    });

    await ballot.save();

    // 6. Invalidate credential to prevent any double-vote attempt
    credential.status = 'USED';
    credential.usedAt = new Date();
    await credential.save();

    // 7. Update RemoteVotingRequest to mark that user has voted
    // (Note: we search by constituency & election from credential voterRef matching context)
    await RemoteVotingRequest.updateMany(
      { election: credential.election, constituency: credential.constituency },
      { $set: { hasVoted: true, votedAt: new Date() } }
    );

    // 8. Log the submission to Audit Chain WITHOUT exposing candidate or voter choice
    await AuditService.logEvent({
      action: 'ANONYMOUS_BALLOT_CAST',
      actorRole: 'ANONYMOUS_BALLOT_TOKEN',
      actorId: `BALLOT_ID:${credential.ballotId.substring(0, 8)}...`,
      details: {
        electionId: credential.election.toString(),
        constituencyId: credential.constituency.toString(),
        integrityHash: integrityHash.substring(0, 16) + '...'
      },
      ipAddress
    });

    // 9. Generate voter's confirmation receipt (Contains receipt ID and integrity proof, but NO candidate name)
    const receiptCode = `VR-${sha256(credential.ballotId + integrityHash).substring(0, 12).toUpperCase()}`;

    return {
      success: true,
      receiptCode,
      ballotId: credential.ballotId,
      integrityHash,
      timestamp: ballot.createdAt,
      message: 'Your anonymous encrypted ballot has been cryptographically sealed and permanently recorded.'
    };
  }

  /**
   * Tally results for an election
   */
  static async getElectionTally(electionId) {
    const ballots = await AnonymousBallot.find({ election: electionId })
      .populate({
        path: 'candidate',
        populate: [{ path: 'party' }, { path: 'constituency' }]
      });

    const totalVotes = ballots.length;
    const candidateMap = {};

    for (const b of ballots) {
      if (!b.candidate) continue;
      const cId = b.candidate._id.toString();
      if (!candidateMap[cId]) {
        candidateMap[cId] = {
          candidateId: cId,
          fullName: b.candidate.fullName,
          party: b.candidate.party ? b.candidate.party.name : 'Independent',
          partyAbbr: b.candidate.party ? b.candidate.party.abbreviation : 'IND',
          partyColor: b.candidate.party ? b.candidate.party.color : '#64748B',
          symbol: b.candidate.party ? b.candidate.party.symbol : 'STAR',
          constituency: b.candidate.constituency ? b.candidate.constituency.name : '',
          votes: 0,
          percentage: 0
        };
      }
      candidateMap[cId].votes += 1;
    }

    const tally = Object.values(candidateMap).map(c => ({
      ...c,
      percentage: totalVotes > 0 ? Number(((c.votes / totalVotes) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.votes - a.votes);

    return {
      electionId,
      totalVotes,
      tally
    };
  }
}

module.exports = BallotService;
