const AuditLog = require('../models/AuditLog');
const { sha256 } = require('../utils/hash.utils');

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

class AuditService {
  /**
   * Appends an event to the tamper-evident cryptographic hash chain
   */
  static async logEvent({ action, actorRole = 'SYSTEM', actorId = 'SYSTEM', details = {}, ipAddress = '127.0.0.1' }) {
    try {
      // Find the most recent audit log entry to get the previous hash
      const lastEntry = await AuditLog.findOne().sort({ createdAt: -1 });
      const previousHash = lastEntry ? lastEntry.currentHash : GENESIS_HASH;

      const timestamp = new Date();
      
      // Calculate current hash = SHA256(previousHash + action + actorRole + timestamp + details)
      const dataToHash = `${previousHash}|${action}|${actorRole}|${actorId}|${timestamp.toISOString()}|${JSON.stringify(details)}`;
      const currentHash = sha256(dataToHash);

      const logEntry = new AuditLog({
        action,
        actorRole,
        actorId,
        details,
        ipAddress,
        previousHash,
        currentHash,
        timestamp
      });

      await logEntry.save();
      return logEntry;
    } catch (err) {
      console.error('[AuditService Error] Failed to write audit event:', err);
      // Non-blocking in prototype but logged
    }
  }

  /**
   * Verifies the full integrity of the audit hash chain from genesis to tip
   */
  static async verifyChainIntegrity() {
    const logs = await AuditLog.find().sort({ createdAt: 1 });
    if (!logs.length) return { isValid: true, count: 0, message: 'Chain is empty' };

    let expectedPrevHash = GENESIS_HASH;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      // Check if link to previous entry is broken
      if (log.previousHash !== expectedPrevHash) {
        return {
          isValid: false,
          brokenIndex: i,
          failedLogId: log._id,
          message: `Hash link broken at record index #${i}. Expected: ${expectedPrevHash}, Found: ${log.previousHash}`
        };
      }

      // Recompute and verify current hash
      const dataToHash = `${log.previousHash}|${log.action}|${log.actorRole}|${log.actorId}|${new Date(log.timestamp).toISOString()}|${JSON.stringify(log.details)}`;
      const recalculatedHash = sha256(dataToHash);

      if (recalculatedHash !== log.currentHash) {
        return {
          isValid: false,
          brokenIndex: i,
          failedLogId: log._id,
          message: `Data tampering detected at record index #${i}. Stored hash does not match computed content hash.`
        };
      }

      expectedPrevHash = log.currentHash;
    }

    return {
      isValid: true,
      count: logs.length,
      tipHash: expectedPrevHash,
      message: `Cryptographic audit chain fully verified across all ${logs.length} blocks with zero tampering.`
    };
  }
}

module.exports = AuditService;
