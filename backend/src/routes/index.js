const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const electionRoutes = require('./election.routes');
const remoteVotingRoutes = require('./remoteVoting.routes');
const votingRoutes = require('./voting.routes');
const adminRoutes = require('./admin.routes');
const auditRoutes = require('./audit.routes');
const analyticsRoutes = require('./analytics.routes');

router.use('/auth', authRoutes);
router.use('/elections', electionRoutes);
router.use('/remote-voting', remoteVotingRoutes);
router.use('/voting', votingRoutes);
router.use('/admin', adminRoutes);
router.use('/audit', auditRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
