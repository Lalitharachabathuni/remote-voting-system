const CredentialService = require('../services/credential.service');
const BallotService = require('../services/ballot.service');
const Candidate = require('../models/Candidate');
const RemoteVotingRequest = require('../models/RemoteVotingRequest');
const VotingCredential = require('../models/VotingCredential');
const { sha256 } = require('../utils/hash.utils');

/**
 * Step 1: Issue One-Time Voting Credential
 * Requires JWT Authentication to verify voter identity & approved status
 */
const requestCredential = async (req, res) => {
  try {
    const { electionId } = req.body;
    const userId = req.user._id;

    if (!electionId) {
      return res.status(400).json({
        success: false,
        message: 'Election ID is required'
      });
    }

    const credentialData = await CredentialService.issueVotingCredential(userId, electionId, req.ip);

    return res.status(200).json({
      success: true,
      message: 'One-time anonymous voting credential generated successfully.',
      ...credentialData
    });
  } catch (error) {
    console.error('Credential Issuance Error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Step 2: Retrieve Anonymous Ballot
 * ANONYMIZATION BOUNDARY: Does NOT use user JWT.
 * Validates ONLY the raw one-time credential token passed in `x-voting-credential` or query.
 */
const getBallot = async (req, res) => {
  try {
    const credentialToken = req.headers['x-voting-credential'] || req.query.token;

    if (!credentialToken) {
      return res.status(401).json({
        success: false,
        message: 'Valid one-time voting credential token is required to access ballot'
      });
    }

    const credentialTokenHash = sha256(credentialToken);
    const credential = await VotingCredential.findOne({ credentialTokenHash })
      .populate('election')
      .populate('constituency');

    if (!credential) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or unknown voting credential'
      });
    }

    if (credential.status === 'USED') {
      return res.status(409).json({
        success: false,
        message: 'This voting session has already concluded. Credential is used.'
      });
    }

    if (credential.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Voting credential session expired. Please re-authenticate.'
      });
    }

    // Fetch candidates strictly for this constituency
    const candidates = await Candidate.find({ constituency: credential.constituency._id })
      .populate('party')
      .populate('constituency');

    // Shuffle candidate order randomly to ensure absolute presentation neutrality
    const neutralCandidates = candidates.sort(() => Math.random() - 0.5);

    return res.status(200).json({
      success: true,
      ballotId: credential.ballotId,
      election: credential.election,
      constituency: credential.constituency,
      candidates: neutralCandidates,
      expiresAt: credential.expiresAt
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to access anonymous ballot',
      error: error.message
    });
  }
};

/**
 * Step 3: Cast Encrypted Anonymous Vote
 * ANONYMIZATION BOUNDARY: Does NOT use user JWT.
 * Consumes the one-time credential token, encrypts the candidate choice with AES-256-GCM,
 * stores in AnonymousBallot collection, and invalidates credential.
 */
const castVote = async (req, res) => {
  try {
    const credentialToken = req.headers['x-voting-credential'] || req.body.credentialToken;
    const { candidateId } = req.body;

    if (!credentialToken || !candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Both voting credential token and candidate selection are required'
      });
    }

    const result = await BallotService.submitAnonymousVote({
      rawCredentialToken: credentialToken,
      candidateId,
      ipAddress: req.ip
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Vote Casting Error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Check if the authenticated voter has already voted in an election
 */
const checkVotingStatus = async (req, res) => {
  try {
    const { electionId } = req.params;
    const userId = req.user._id;

    const request = await RemoteVotingRequest.findOne({
      voter: userId,
      election: electionId
    });

    return res.status(200).json({
      success: true,
      hasApprovedRequest: !!(request && request.status === 'APPROVED'),
      hasVoted: !!(request && request.hasVoted),
      votedAt: request ? request.votedAt : null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check voting status',
      error: error.message
    });
  }
};

module.exports = {
  requestCredential,
  getBallot,
  castVote,
  checkVotingStatus
};
