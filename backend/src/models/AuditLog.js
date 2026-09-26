const mongoose = require('mongoose');

/**
 * Tamper-evident Audit Log with Cryptographic Hash-Chain
 */
const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  actorRole: {
    type: String,
    default: 'SYSTEM'
  },
  actorId: {
    type: String, // String representation or pseudo-id (never vote details)
    default: 'ANONYMOUS_OR_SYSTEM'
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  previousHash: {
    type: String,
    required: true
  },
  currentHash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
