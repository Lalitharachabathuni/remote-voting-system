const crypto = require('crypto');
const VotingCredential = require('../models/VotingCredential');
const RemoteVotingRequest = require('../models/RemoteVotingRequest');
const Election = require('../models/Election');
const { generateVoterRef, sha256, generateRandomToken } = require('../utils/hash.utils');
const AuditService = require('./audit.service');

class CredentialService {
  /**
   * Issues a one-time voting credential token for an eligible approved remote voter
   */
  static async issueVotingCredential(userId, electionId, ipAddress = '127.0.0.1') {
    // 1. Verify election exists and is ACTIVE
    const election = await Election.findById(electionId);
    if (!election || election.status !== 'ACTIVE') {
      throw new Error('Election is not currently open or active for voting');
    }

    // 2. Verify approved remote voting request
    const request = await RemoteVotingRequest.findOne({
      voter: userId,
      election: electionId,
      status: 'APPROVED'
    });

    if (!request) {
      throw new Error('No approved remote voting registration found for this election');
    }

    if (request.hasVoted) {
      throw new Error('Ballot has already been recorded for this election. Double-voting is strictly prohibited.');
    }

    // 3. Generate pseudonymous voterRef (irreversible one-way hash)
    const voterRef = generateVoterRef(userId, electionId);

    // 4. Check if credential was already issued
    let credential = await VotingCredential.findOne({ voterRef, election: electionId });
    if (credential) {
      if (credential.status === 'USED') {
        throw new Error('Voting credential has already been consumed.');
      }
      // If issued but not expired, we can re-issue token or allow session resumption
    }

    // 5. Generate high-entropy one-time raw token and a random ballotId
    const rawCredentialToken = generateRandomToken(32);
    const credentialTokenHash = sha256(rawCredentialToken);
    const ballotId = crypto.randomUUID();

    // 30 minute TTL for ballot casting session
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    if (credential) {
      credential.credentialTokenHash = credentialTokenHash;
      credential.ballotId = ballotId;
      credential.status = 'ISSUED';
      credential.expiresAt = expiresAt;
      await credential.save();
    } else {
      credential = new VotingCredential({
        credentialTokenHash,
        ballotId,
        voterRef,
        election: electionId,
        constituency: request.constituency,
        status: 'ISSUED',
        expiresAt
      });
      await credential.save();
    }

    // Log the event with only pseudonymous voterRef (NO userId link in audit trail)
    await AuditService.logEvent({
      action: 'VOTING_CREDENTIAL_ISSUED',
      actorRole: 'VOTER',
      actorId: `VOTER_REF:${voterRef.substring(0, 12)}...`,
      details: {
        electionId: electionId.toString(),
        constituencyId: request.constituency.toString(),
        expiresAt
      },
      ipAddress
    });

    return {
      credentialToken: rawCredentialToken,
      ballotId,
      expiresAt,
      constituencyId: request.constituency
    };
  }

  /**
   * Verifies and consumes the one-time voting credential
   */
  static async verifyAndConsumeCredential(rawCredentialToken) {
    const credentialTokenHash = sha256(rawCredentialToken);
    const credential = await VotingCredential.findOne({ credentialTokenHash });

    if (!credential) {
      throw new Error('Invalid voting credential token');
    }

    if (credential.status === 'USED') {
      throw new Error('This voting credential has already been consumed. Replay attack blocked.');
    }

    if (credential.expiresAt < new Date()) {
      credential.status = 'EXPIRED';
      await credential.save();
      throw new Error('Voting credential session has expired. Please re-authenticate.');
    }

    return credential;
  }
}

module.exports = CredentialService;
