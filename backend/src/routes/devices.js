const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// Get all devices
router.get('/', deviceController.getAllDevices);

// Get a specific device
router.get('/:id', deviceController.getDeviceById);

// Update device status
router.put('/:id/status', deviceController.updateDeviceStatus);

// Get device logs
router.get('/:id/logs', deviceController.getDeviceLogs);

module.exports = router;