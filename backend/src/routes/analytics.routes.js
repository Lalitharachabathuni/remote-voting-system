const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/results/:electionId', analyticsController.getResults);
router.get('/mobility-impact', analyticsController.getMobilityImpact);

module.exports = router;
