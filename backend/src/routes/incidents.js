const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

// Get all incidents
router.get('/', incidentController.getAllIncidents);

// Get a specific incident
router.get('/:id', incidentController.getIncidentById);

// Create a new incident
router.post('/', incidentController.createIncident);

// Update incident status
router.put('/:id/status', incidentController.updateIncidentStatus);

module.exports = router;