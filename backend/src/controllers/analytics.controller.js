const BallotService = require('../services/ballot.service');
const RemoteVotingRequest = require('../models/RemoteVotingRequest');
const AnonymousBallot = require('../models/AnonymousBallot');
const Election = require('../models/Election');

/**
 * Get election tally and results
 */
const getResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const tally = await BallotService.getElectionTally(electionId);
    return res.status(200).json({
      success: true,
      ...tally
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute election tally',
      error: error.message
    });
  }
};

/**
 * Mobility & Environmental Impact Estimation Module
 * Calculates travel distance avoided, estimated fuel/carbon saved for remote voters
 */
const getMobilityImpact = async (req, res) => {
  try {
    const remoteRequests = await RemoteVotingRequest.find({ status: 'APPROVED' })
      .populate('constituency');

    const totalRemoteVoters = remoteRequests.length;

    // Academic prototype estimation model:
    // Average inter-state / inter-city round-trip travel distance ~ 650 km
    // Average CO2 emissions ~ 0.12 kg CO2 per passenger km
    // Average bus/train journey time ~ 12 hours round-trip
    const avgDistanceKm = 650;
    const co2PerKm = 0.12; // kg

    const totalDistanceAvoidedKm = totalRemoteVoters * avgDistanceKm;
    const totalCo2SavedKg = Math.round(totalDistanceAvoidedKm * co2PerKm);
    const totalHoursSaved = totalRemoteVoters * 14;

    return res.status(200).json({
      success: true,
      modelDisclaimer: 'Academic / Research estimation model based on declared remote voter locations.',
      metrics: {
        totalRemoteVoters,
        totalDistanceAvoidedKm,
        totalCo2SavedKg,
        totalHoursSaved,
        avgTravelAvoidedPerVoterKm: avgDistanceKm
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute mobility impact',
      error: error.message
    });
  }
};

module.exports = {
  getResults,
  getMobilityImpact
};
