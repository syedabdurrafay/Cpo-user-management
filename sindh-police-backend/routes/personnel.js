const express = require('express');
const router = express.Router();
const Personnel = require('../models/Personnel');
const authMiddleware = require('../middleware/auth');
const { validatePersonnel } = require('../middleware/validation');
const activityController = require('../controllers/activityController');
const catchAsync = require('../utils/catchAsync');

// Get all personnel
router.get('/', authMiddleware, catchAsync(async (req, res) => {
  try {
    const personnel = await Personnel.find().sort('-createdAt');
    
    // Log activity
    await activityController.logActivity(
      req,
      'Viewed personnel list',
      'Personnel',
      null,
      { count: personnel.length }
    );

    res.status(200).json({
      status: 'success',
      results: personnel.length,
      data: {
        personnel
      }
    });
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch personnel data'
    });
  }
}));

// Get single personnel
router.get('/:id', authMiddleware, catchAsync(async (req, res) => {
  try {
    const personnel = await Personnel.findById(req.params.id);
    
    if (!personnel) {
      return res.status(404).json({
        status: 'error',
        message: 'Personnel not found'
      });
    }

    // Log activity
    await activityController.logActivity(
      req,
      'Viewed personnel details',
      'Personnel',
      personnel._id,
      { name: personnel.fullName }
    );

    res.status(200).json({
      status: 'success',
      data: {
        personnel
      }
    });
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch personnel data'
    });
  }
}));

// Create new personnel
router.post('/', authMiddleware, validatePersonnel, catchAsync(async (req, res) => {
  try {
    // Check if badge number already exists
    const existingPersonnel = await Personnel.findOne({ 
      badgeNumber: req.body.badgeNumber 
    });
    
    if (existingPersonnel) {
      return res.status(400).json({
        status: 'error',
        message: 'Personnel with this badge number already exists'
      });
    }

    const newPersonnel = await Personnel.create(req.body);

    // Log activity
    await activityController.logActivity(
      req,
      'Created new personnel',
      'Personnel',
      newPersonnel._id,
      {
        name: newPersonnel.fullName,
        rank: newPersonnel.rank,
        badgeNumber: newPersonnel.badgeNumber
      }
    );

    res.status(201).json({
      status: 'success',
      data: {
        personnel: newPersonnel
      }
    });
  } catch (error) {
    console.error('Error creating personnel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create personnel'
    });
  }
}));

// Update personnel
router.patch('/:id', authMiddleware, validatePersonnel, catchAsync(async (req, res) => {
  try {
    const personnel = await Personnel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!personnel) {
      return res.status(404).json({
        status: 'error',
        message: 'Personnel not found'
      });
    }

    // Log activity
    await activityController.logActivity(
      req,
      'Updated personnel',
      'Personnel',
      personnel._id,
      {
        name: personnel.fullName,
        changes: req.body
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        personnel
      }
    });
  } catch (error) {
    console.error('Error updating personnel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update personnel'
    });
  }
}));

// Delete personnel
router.delete('/:id', authMiddleware, catchAsync(async (req, res) => {
  try {
    const personnel = await Personnel.findByIdAndDelete(req.params.id);
    
    if (!personnel) {
      return res.status(404).json({
        status: 'error',
        message: 'Personnel not found'
      });
    }

    // Log activity
    await activityController.logActivity(
      req,
      'Deleted personnel',
      'Personnel',
      personnel._id,
      {
        name: personnel.fullName,
        badgeNumber: personnel.badgeNumber
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Personnel deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Error deleting personnel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete personnel'
    });
  }
}));

module.exports = router;