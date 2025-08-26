const Alert = require('../models/alertModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const activityController = require('./activityController');

exports.getAllAlerts = catchAsync(async (req, res, next) => {
  const { status = 'active', limit = 10, page = 1 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const alerts = await Alert.find({ status })
    .sort('-createdAt')
    .skip(skip)
    .limit(parseInt(limit))
    .populate('issuedBy', 'fullName badgeNumber role')
    .populate('relatedPersonnel', 'fullName badgeNumber role');

  const totalAlerts = await Alert.countDocuments({ status });

  // Log activity
  await activityController.logActivity(
    req,
    'Viewed alerts',
    'Alert',
    null,
    { status, limit, page }
  );

  res.status(200).json({
    status: 'success',
    results: alerts.length,
    total: totalAlerts,
    data: {
      alerts
    }
  });
});

exports.createAlert = catchAsync(async (req, res, next) => {
  req.body.issuedBy = req.user.id;
  
  if (!req.body.status) {
    req.body.status = 'active';
  }

  // Validate required fields
  if (!req.body.title || !req.body.description || !req.body.severity) {
    return next(new AppError('Title, description and severity are required', 400));
  }

  // Ensure districts is an array
  if (req.body.districts && typeof req.body.districts === 'string') {
    req.body.districts = req.body.districts.split(',').map(d => d.trim()).filter(d => d);
  }

  // Set default alertType if not provided
  if (!req.body.alertType) {
    req.body.alertType = 'emergency';
  }

  const newAlert = await Alert.create(req.body);

  // Populate the created alert
  await newAlert.populate('issuedBy', 'fullName badgeNumber role');

  // Log activity
  await activityController.logActivity(
    req,
    'Created emergency alert',
    'Alert',
    newAlert._id,
    {
      title: newAlert.title,
      severity: newAlert.severity,
      status: newAlert.status,
      alertType: newAlert.alertType
    }
  );

  res.status(201).json({
    status: 'success',
    data: {
      alert: newAlert
    }
  });
});

exports.updateAlertStatus = catchAsync(async (req, res, next) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate('issuedBy', 'fullName badgeNumber role');

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  // Log activity
  await activityController.logActivity(
    req,
    `Updated alert status to ${req.body.status}`,
    'Alert',
    alert._id,
    { previousStatus: alert.status, newStatus: req.body.status }
  );

  res.status(200).json({
    status: 'success',
    data: {
      alert
    }
  });
});

exports.deleteAlert = catchAsync(async (req, res, next) => {
  const alert = await Alert.findByIdAndDelete(req.params.id);

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  // Log activity
  await activityController.logActivity(
    req,
    'Deleted emergency alert',
    'Alert',
    alert._id,
    {
      title: alert.title,
      severity: alert.severity
    }
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAlertById = catchAsync(async (req, res, next) => {
  const alert = await Alert.findById(req.params.id)
    .populate('issuedBy', 'fullName badgeNumber role')
    .populate('relatedPersonnel', 'fullName badgeNumber role');

  if (!alert) {
    return next(new AppError('No alert found with that ID', 404));
  }

  // Log activity
  await activityController.logActivity(
    req,
    'Viewed alert details',
    'Alert',
    alert._id
  );

  res.status(200).json({
    status: 'success',
    data: {
      alert
    }
  });
});