const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: [true, 'Activity must have an action'],
    trim: true
  },
  entityType: {
    type: String,
    required: [true, 'Activity must have an entity type'],
    enum: [
      'User', 'Personnel', 'Alert', 'CrimeReport', 
      'System', 'Dashboard', 'Settings', 'Other'
    ],
    default: 'Other'
  },
  entityId: mongoose.Schema.Types.ObjectId,
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  isSystem: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
activitySchema.index({ userId: 1 });
activitySchema.index({ entityType: 1, entityId: 1 });
activitySchema.index({ timestamp: -1 });

module.exports = mongoose.model('Activity', activitySchema);