const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'An alert must have a title']
  },
  description: {
    type: String,
    required: [true, 'Please provide alert description']
  },
  alertType: {
    type: String,
    required: true,
    enum: ['crime', 'missing', 'wanted', 'general', 'emergency']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  issuedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An alert must have an issuer']
  },
  relatedPersonnel: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  relatedCrime: {
    type: mongoose.Schema.ObjectId,
    ref: 'CrimeReport'
  },
  districts: [String],
  status: {
    type: String,
    enum: ['active', 'resolved', 'expired'],
    default: 'active'
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;