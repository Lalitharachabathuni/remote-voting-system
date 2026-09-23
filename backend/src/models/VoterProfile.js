const mongoose = require('mongoose');

const voterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Synthetic prototype voter identifier (VID-XXXX-XXXX)
  syntheticVoterId: {
    type: String,
    required: true,
    unique: true
  },
  registeredConstituency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Constituency',
    required: true
  },
  registeredState: {
    type: String,
    required: true
  },
  registeredDistrict: {
    type: String,
    required: true
  },
  currentCity: {
    type: String,
    required: true
  },
  currentState: {
    type: String,
    required: true
  },
  currentPincode: {
    type: String
  },
  occupation: {
    type: String,
    default: 'General Citizen / Student / Professional'
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'VERIFIED' // For prototype ease of testing, default verified
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VoterProfile', voterProfileSchema);
