const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Alert must have a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Alert must have a description'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  alertType: {
    type: String,
    required: true,
    enum: ['crime', 'missing', 'wanted', 'general', 'emergency'],
    default: 'emergency'
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  districts: {
    type: [String],
    required: [true, 'Alert must have at least one district'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Alert must have at least one district'
    }
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Alert must have an issuer']
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'archived'],
    default: 'active'
  },
  relatedCrimeReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CrimeReport'
  },
  relatedPersonnel: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
alertSchema.index({ status: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ districts: 1 });
alertSchema.index({ issuedBy: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);