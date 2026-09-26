const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Constituency = require('../models/Constituency');
const Party = require('../models/Party');
const RemoteVotingRequest = require('../models/RemoteVotingRequest');
const User = require('../models/User');
const AnonymousBallot = require('../models/AnonymousBallot');
const AuditService = require('../services/audit.service');

/**
 * Get overarching Admin system statistics
 */
const getAdminStats = async (req, res) => {
  try {
    const [totalVoters, totalElections, pendingRequests, totalBallots] = await Promise.all([
      User.countDocuments({ role: 'VOTER' }),
      Election.countDocuments(),
      RemoteVotingRequest.countDocuments({ status: 'PENDING' }),
      AnonymousBallot.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalVoters,
        totalElections,
        pendingRequests,
        totalBallots
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats',
      error: error.message
    });
  }
};

/**
 * Create a new election
 */
const createElection = async (req, res) => {
  try {
    const { title, code, description, startDate, endDate, constituencies, remoteVotingEnabled } = req.body;

    const election = new Election({
      title,
      code,
      description,
      startDate,
      endDate,
      constituencies,
      remoteVotingEnabled
    });

    await election.save();

    await AuditService.logEvent({
      action: 'ADMIN_CREATE_ELECTION',
      actorRole: req.user.role,
      actorId: req.user._id.toString(),
      details: { electionId: election._id.toString(), code: election.code },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: 'Election created successfully',
      election
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create election',
      error: error.message
    });
  }
};

/**
 * Create a new Candidate
 */
const createCandidate = async (req, res) => {
  try {
    const { fullName, party, constituency, age, education, manifestoSummary } = req.body;

    const candidate = new Candidate({
      fullName,
      party,
      constituency,
      age,
      education,
      manifestoSummary
    });

    await candidate.save();

    await AuditService.logEvent({
      action: 'ADMIN_CREATE_CANDIDATE',
      actorRole: req.user.role,
      actorId: req.user._id.toString(),
      details: { candidateId: candidate._id.toString(), fullName },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      candidate
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create candidate',
      error: error.message
    });
  }
};

/**
 * Get all remote voting requests for admin review
 */
const getAllRemoteRequests = async (req, res) => {
  try {
    const requests = await RemoteVotingRequest.find()
      .populate('voter', 'fullName email')
      .populate('election')
      .populate('constituency')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch remote voting requests',
      error: error.message
    });
  }
};

module.exports = {
  getAdminStats,
  createElection,
  createCandidate,
  getAllRemoteRequests
};
