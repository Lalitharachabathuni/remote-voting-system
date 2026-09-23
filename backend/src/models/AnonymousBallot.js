const mongoose = require('mongoose');

/**
 * Anonymous ballot storage.
 * CRITICAL PRIVACY REQUIREMENT:
 * No user identity, email, or IP is linked in this document.
 * Only the random ballotId and AES-256-GCM encrypted vote choice are stored.
 */
const anonymousBallotSchema = new mongoose.Schema({
  ballotId: {
    type: String,
    required: true,
    unique: true
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
  // AES-256-GCM Encrypted payload
  encryptedChoice: {
    type: String,
    required: true
  },
  encryptionIv: {
    type: String,
    required: true
  },
  encryptionTag: {
    type: String,
    required: true
  },
  // Plain candidate ID reference for counting/tallying in prototype demo
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  integrityHash: {
    type: String,
    required: true
  },
  castAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnonymousBallot', anonymousBallotSchema);
