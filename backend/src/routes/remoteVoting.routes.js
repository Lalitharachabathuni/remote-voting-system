const express = require('express');
const router = express.Router();
const remoteVotingController = require('../controllers/remoteVoting.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');

router.post('/request', requireAuth, remoteVotingController.submitRequest);
router.get('/my-requests', requireAuth, remoteVotingController.getMyRequests);
router.patch('/requests/:id/review', requireAuth, requireRole(['ADMIN', 'ELECTION_OFFICER', 'SUPER_ADMIN']), remoteVotingController.reviewRequest);

module.exports = router;
