const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true
  },
  symbol: {
    type: String, // e.g. symbol name or icon identifier
    required: true
  },
  color: {
    type: String,
    default: '#2563EB'
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Party', partySchema);
