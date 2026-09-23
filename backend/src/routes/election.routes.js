const express = require('express');
const router = express.Router();
const electionController = require('../controllers/election.controller');

router.get('/', electionController.getElections);
router.get('/constituencies', electionController.getConstituencies);
router.get('/parties', electionController.getParties);
router.get('/:id', electionController.getElectionById);
router.get('/:electionId/candidates', electionController.getElectionCandidates);

module.exports = router;
