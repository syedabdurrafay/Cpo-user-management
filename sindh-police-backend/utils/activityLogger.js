// utils/activityLogger.js
const Activity = require('../models/activityModel');

const activityLogger = (req, action, entityType, entityId, details) => {
  if (!req.user) return; // Skip if no user (system actions)
  
  const activityData = {
    userId: req.user.id,
    action,
    entityType,
    entityId,
    details,
    ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  };

  // Don't await to avoid blocking the request
  Activity.create(activityData).catch(err => {
    console.error('Failed to log activity:', err);
  });
};

module.exports = activityLogger;