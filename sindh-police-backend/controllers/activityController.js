const Activity = require('../models/activityModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.logActivity = catchAsync(async (req, action, entityType, entityId, details = {}) => {
  const activityData = {
    userId: req.user?.id,
    action,
    entityType,
    entityId,
    details: {
      ...details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  };

  const activity = await Activity.create(activityData);
  return activity;
});

exports.getRecentActivities = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  
  let query = Activity.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: 'userId',
      select: 'fullName role badgeNumber',
      model: 'User'
    });
    
  // For non-admin users, only show their own activities
  if (req.user.role !== 'admin' && req.user.role !== 'IG') {
    query = query.where('userId').equals(req.user.id);
  }

  const activities = await query;
  
  // Format activities for frontend
  const formattedActivities = activities.map(activity => ({
    _id: activity._id,
    action: activity.action,
    timestamp: activity.createdAt || activity.timestamp,
    entityType: activity.entityType,
    userId: activity.userId ? {
      fullName: activity.userId.fullName,
      role: activity.userId.role,
      badgeNumber: activity.userId.badgeNumber
    } : null
  }));
  
  res.status(200).json({
    status: 'success',
    results: formattedActivities.length,
    activities: formattedActivities
  });
});

exports.logSystemActivity = catchAsync(async (action, entityType, entityId, details = {}) => {
  return await Activity.create({
    action,
    entityType,
    entityId,
    details,
    isSystem: true
  });
});

exports.logLoginActivity = catchAsync(async (userId, req) => {
  return await Activity.create({
    userId,
    action: 'User logged in',
    entityType: 'User',
    entityId: userId,
    details: {
      loginTime: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  });
});

exports.logLogoutActivity = catchAsync(async (userId, req) => {
  return await Activity.create({
    userId,
    action: 'User logged out',
    entityType: 'User',
    entityId: userId,
    details: {
      logoutTime: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  });
});