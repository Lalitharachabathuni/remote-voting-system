const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  constituency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Constituency',
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  education: {
    type: String
  },
  manifestoSummary: {
    type: String
  },
  avatarUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
