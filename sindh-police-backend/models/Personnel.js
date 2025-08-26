const mongoose = require('mongoose');

const personnelSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Full name must be at least 3 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  rank: {
    type: String,
    required: [true, 'Rank is required'],
    enum: [
      'constable',
      'head_constable',
      'asi',
      'si',
      'inspector',
      'dsp',
      'ssp',
      'dig',
      'ig',
      'addl_ig'
    ],
    default: 'constable'
  },
  badgeNumber: {
    type: String,
    required: [true, 'Badge number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Za-z0-9]+$/.test(v);
      },
      message: 'Badge number can only contain letters and numbers'
    }
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  station: {
    type: String,
    required: [true, 'Station is required'],
    trim: true
  },
  dateOfJoining: {
    type: Date,
    required: [true, 'Date of joining is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Date of joining cannot be in the future'
    }
  },
  currentAssignment: {
    type: String,
    trim: true
  },
  contactNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
personnelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Personnel = mongoose.model('Personnel', personnelSchema);

module.exports = Personnel;