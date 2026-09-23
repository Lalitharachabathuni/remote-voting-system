const express = require('express');
const router = express.Router();
const votingController = require('../controllers/voting.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Step 1: Issue one-time voting credential (Requires authenticated eligible voter)
router.post('/credential', requireAuth, votingController.requestCredential);

// Step 2: Access Anonymous Ballot (ANONYMIZATION BOUNDARY: uses one-time credential token, NOT user JWT)
router.get('/ballot', votingController.getBallot);

// Step 3: Cast Anonymous Encrypted Vote (ANONYMIZATION BOUNDARY: uses one-time credential token, NOT user JWT)
router.post('/cast', votingController.castVote);

// Check if user has voted in election
router.get('/status/:electionId', requireAuth, votingController.checkVotingStatus);

module.exports = router;
