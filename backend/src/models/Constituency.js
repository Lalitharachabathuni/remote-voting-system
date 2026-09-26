const mongoose = require('mongoose');

const constituencySchema = new mongoose.Schema({
  name: {
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
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['PARLIAMENTARY', 'ASSEMBLY'],
    default: 'PARLIAMENTARY'
  },
  totalElectors: {
    type: Number,
    default: 1500000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Constituency', constituencySchema);
