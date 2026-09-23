const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');

router.use(requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN', 'ELECTION_OFFICER']));

router.get('/stats', adminController.getAdminStats);
router.post('/elections', adminController.createElection);
router.post('/candidates', adminController.createCandidate);
router.get('/remote-requests', adminController.getAllRemoteRequests);

module.exports = router;
