const AuditLog = require('../models/AuditLog');
const AuditService = require('../services/audit.service');

/**
 * Get recent audit logs with pagination and search
 */
const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      logs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
};

/**
 * Perform a full cryptographic verification of the audit hash chain
 */
const verifyChain = async (req, res) => {
  try {
    const verification = await AuditService.verifyChainIntegrity();
    return res.status(200).json({
      success: true,
      verification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Chain verification failed',
      error: error.message
    });
  }
};

module.exports = {
  getAuditLogs,
  verifyChain
};
