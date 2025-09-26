const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get threat statistics
router.get('/threats', analyticsController.getThreatStats);

// Get attack types distribution
router.get('/attack-types', analyticsController.getAttackTypes);

// Get device vulnerability data
router.get('/vulnerabilities', analyticsController.getVulnerabilities);

// Get system health metrics
router.get('/system-health', analyticsController.getSystemHealth);

module.exports = router;