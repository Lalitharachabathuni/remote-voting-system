const RemoteVotingRequest = require('../models/RemoteVotingRequest');
const Election = require('../models/Election');
const VoterProfile = require('../models/VoterProfile');
const AuditService = require('../services/audit.service');

/**
 * Submit a remote voting request
 */
const submitRequest = async (req, res) => {
  try {
    const { electionId, currentCity, currentState, reason } = req.body;
    const userId = req.user._id;

    // Check if voter has profile
    const profile = await VoterProfile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Voter profile missing. Please update your voter profile.'
      });
    }

    // Check election exists & allows remote voting
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    if (!election.remoteVotingEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Remote digital voting is not enabled for this election'
      });
    }

    // Check for duplicate request
    const existing = await RemoteVotingRequest.findOne({ voter: userId, election: electionId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a remote voting request for this election.',
        request: existing
      });
    }

    // Create Request
    const request = new RemoteVotingRequest({
      voter: userId,
      election: electionId,
      constituency: profile.registeredConstituency,
      currentCity: currentCity || profile.currentCity,
      currentState: currentState || profile.currentState,
      reason: reason || 'Temporarily living away from registered constituency',
      status: 'APPROVED' // For academic prototype demo, auto-approve or allow officer review
    });

    await request.save();

    await AuditService.logEvent({
      action: 'REMOTE_VOTING_REQUEST_SUBMITTED',
      actorRole: 'VOTER',
      actorId: userId.toString(),
      details: {
        electionId,
        constituencyId: profile.registeredConstituency.toString(),
        currentCity: request.currentCity
      },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: 'Remote voting request submitted and approved.',
      request
    });
  } catch (error) {
    console.error('Remote Request Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit remote voting request',
      error: error.message
    });
  }
};

/**
 * Get voter's own remote voting requests
 */
const getMyRequests = async (req, res) => {
  try {
    const requests = await RemoteVotingRequest.find({ voter: req.user._id })
      .populate('election')
      .populate('constituency')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch your requests',
      error: error.message
    });
  }
};

/**
 * Election Officer / Admin reviews remote voting request
 */
const reviewRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be APPROVED or REJECTED'
      });
    }

    const request = await RemoteVotingRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = status;
    request.reviewNotes = reviewNotes;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    await AuditService.logEvent({
      action: `REMOTE_VOTING_REQUEST_${status}`,
      actorRole: req.user.role,
      actorId: req.user._id.toString(),
      details: {
        requestId: request._id.toString(),
        electionId: request.election.toString()
      },
      ipAddress: req.ip
    });

    return res.status(200).json({
      success: true,
      message: `Request has been marked ${status}`,
      request
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to review request',
      error: error.message
    });
  }
};

module.exports = {
  submitRequest,
  getMyRequests,
  reviewRequest
};
