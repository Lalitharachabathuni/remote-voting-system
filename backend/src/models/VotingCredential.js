const mongoose = require('mongoose');

/**
 * One-time single-use voting credential token.
 * `voterRef` is a one-way HMAC pseudonym of the user & election,
 * preventing any database correlation with the voter identity.
 */
const votingCredentialSchema = new mongoose.Schema({
  credentialTokenHash: {
    type: String,
    required: true,
    unique: true
  },
  ballotId: {
    type: String,
    required: true,
    unique: true
  },
  voterRef: {
    type: String,
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
  status: {
    type: String,
    enum: ['ISSUED', 'USED', 'EXPIRED', 'REVOKED'],
    default: 'ISSUED'
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  usedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure a single credential token per voterRef & election
votingCredentialSchema.index({ voterRef: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('VotingCredential', votingCredentialSchema);
