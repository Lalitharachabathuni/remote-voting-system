const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SCHEDULED', 'ACTIVE', 'CLOSED', 'RESULTS_PUBLISHED', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  constituencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Constituency'
  }],
  remoteVotingEnabled: {
    type: Boolean,
    default: true
  },
  remoteRegistrationDeadline: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Election', electionSchema);
