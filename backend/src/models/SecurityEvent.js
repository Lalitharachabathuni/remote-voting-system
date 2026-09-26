const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['FAILED_LOGIN', 'SUSPICIOUS_LOCATION', 'RATE_LIMIT_HIT', 'UNAUTHORIZED_ACCESS', 'TAMPER_DETECTED', 'AI_ANOMALY_FLAG'],
    required: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  description: {
    type: String,
    required: true
  },
  sourceIp: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
