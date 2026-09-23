const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Constituency = require('../models/Constituency');
const Party = require('../models/Party');

/**
 * Get all active and scheduled elections
 */
const getElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('constituencies')
      .sort({ startDate: -1 });

    return res.status(200).json({
      success: true,
      count: elections.length,
      elections
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch elections',
      error: error.message
    });
  }
};

/**
 * Get single election by ID
 */
const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('constituencies');

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    return res.status(200).json({
      success: true,
      election
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch election details',
      error: error.message
    });
  }
};

/**
 * Get candidates for an election (optionally filtered by constituency)
 * Implements strict political neutrality: Candidates are randomized in display order
 */
const getElectionCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { constituencyId } = req.query;

    const query = {
      // In prototype candidates are linked to constituency
    };

    if (constituencyId) {
      query.constituency = constituencyId;
    }

    const candidates = await Candidate.find(query)
      .populate('party')
      .populate('constituency');

    // Shuffle array randomly for neutral presentation (no political bias)
    const randomized = candidates.sort(() => Math.random() - 0.5);

    return res.status(200).json({
      success: true,
      count: randomized.length,
      candidates: randomized
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates',
      error: error.message
    });
  }
};

/**
 * Get all constituencies
 */
const getConstituencies = async (req, res) => {
  try {
    const constituencies = await Constituency.find().sort({ state: 1, name: 1 });
    return res.status(200).json({
      success: true,
      constituencies
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch constituencies',
      error: error.message
    });
  }
};

/**
 * Get all registered political parties
 */
const getParties = async (req, res) => {
  try {
    const parties = await Party.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      parties
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch political parties',
      error: error.message
    });
  }
};

module.exports = {
  getElections,
  getElectionById,
  getElectionCandidates,
  getConstituencies,
  getParties
};
