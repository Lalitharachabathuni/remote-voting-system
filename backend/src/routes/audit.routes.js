const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');

// Public/Auditor verification of the cryptographic chain
router.get('/verify', auditController.verifyChain);

// Get audit logs
router.get('/logs', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN', 'AUDITOR']), auditController.getAuditLogs);

module.exports = router;
