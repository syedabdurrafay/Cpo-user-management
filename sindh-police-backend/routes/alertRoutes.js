const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get single alert
router.get('/:id', alertController.getAlertById);

// Create new alert
router.post('/', alertController.createAlert);

// Update alert status
router.patch('/:id/status', alertController.updateAlertStatus);

// Delete alert
router.delete('/:id', alertController.deleteAlert);

module.exports = router;