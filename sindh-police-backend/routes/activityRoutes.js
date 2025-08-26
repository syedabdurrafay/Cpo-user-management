const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/auth');

// Get recent activities
router.get('/', authMiddleware, activityController.getRecentActivities);

// Log new activity (if needed for direct logging)
router.post('/', authMiddleware, (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'Direct activity logging not implemented. Use activityLogger utility.'
  });
});

module.exports = router;