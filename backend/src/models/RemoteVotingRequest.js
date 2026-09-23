const mongoose = require('mongoose');

const remoteVotingRequestSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  constituency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Constituency',
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
  reason: {
    type: String,
    default: 'Temporary relocation for employment / studies'
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: {
    type: String
  },
  reviewedAt: {
    type: Date
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// A voter can only submit one remote request per election
remoteVotingRequestSchema.index({ voter: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('RemoteVotingRequest', remoteVotingRequestSchema);
