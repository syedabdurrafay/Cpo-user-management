// src/utils/activityLogger.js
import API from '../api';  // Changed from './api' to '../api'

export const logActivity = async (action, entityType, entityId = null, details = {}) => {
  try {
    await API.post('/api/activities', {
      action,
      entityType,
      entityId,
      details
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

export const trackDashboardAccess = async (dashboardType) => {
  return logActivity(
    `Accessed ${dashboardType} Dashboard`,
    'Dashboard',
    null,
    { dashboardType }
  );
};