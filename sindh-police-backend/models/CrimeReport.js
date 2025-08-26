const mongoose = require('mongoose');

const crimeReportSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: [true, 'Please provide a case number'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the case']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  location: {
    district: {
      type: String,
      required: [true, 'Please specify the district']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    address: String
  },
  crimeType: {
    type: String,
    required: [true, 'Please specify the crime type'],
    enum: [
      'theft',
      'burglary',
      'assault',
      'murder',
      'fraud',
      'cyber_crime',
      'drug_offense',
      'traffic_violation',
      'public_disorder',
      'other'
    ]
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A crime report must have a reporting officer']
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['reported', 'under_investigation', 'resolved', 'closed'],
    default: 'reported'
  },
  evidence: [
    {
      type: { type: String, enum: ['image', 'video', 'document', 'other'] },
      url: String,
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  suspects: [
    {
      name: String,
      description: String,
      status: {
        type: String,
        enum: ['wanted', 'arrested', 'released', 'convicted']
      }
    }
  ],
  witnesses: [
    {
      name: String,
      contact: String,
      statement: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  closedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
crimeReportSchema.index({ status: 1 });
crimeReportSchema.index({ 'location.district': 1 });
crimeReportSchema.index({ crimeType: 1 });
crimeReportSchema.index({ severity: 1 });

crimeReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CrimeReport = mongoose.model('CrimeReport', crimeReportSchema);
module.exports = CrimeReport;