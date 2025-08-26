const CrimeReport = require('../models/CrimeReport');
const Personnel = require('../models/Personnel');
const catchAsync = require('../utils/catchAsync');

exports.getCrimeTrends = catchAsync(async (req, res, next) => {
  const { period = 'monthly', district } = req.query;
  
  const matchStage = {};
  if (district) matchStage['location.district'] = district;
  
  let dateFormat;
  if (period === 'monthly') {
    dateFormat = '%Y-%m';
  } else if (period === 'yearly') {
    dateFormat = '%Y';
  } else if (period === 'daily') {
    dateFormat = '%Y-%m-%d';
  } else if (period === 'weekly') {
    dateFormat = '%Y-%U';
  }
  
  const trends = await CrimeReport.aggregate([
    { $match: matchStage },
    { 
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        count: { $sum: 1 },
        highSeverity: {
          $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
        },
        mediumSeverity: {
          $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] }
        },
        lowSeverity: {
          $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      trends
    }
  });
});

exports.getDistrictStats = catchAsync(async (req, res, next) => {
  const stats = await Personnel.aggregate([
    {
      $match: { status: 'active' }
    },
    {
      $group: {
        _id: '$district',
        personnelCount: { $sum: 1 },
        crimeCount: { $sum: 1 } // This would need adjustment based on actual crime data
      }
    },
    {
      $lookup: {
        from: 'crimereports',
        localField: '_id',
        foreignField: 'location.district',
        as: 'crimes'
      }
    },
    {
      $addFields: {
        crimeCount: { $size: '$crimes' }
      }
    },
    {
      $project: {
        crimes: 0
      }
    },
    {
      $sort: { personnelCount: -1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const totalPersonnel = await Personnel.countDocuments({ status: 'active' });
  const totalCrimes = await CrimeReport.countDocuments();
  const pendingRequests = await Personnel.countDocuments({ status: 'pending' });
  
  const recentActivities = await CrimeReport.find()
    .sort('-createdAt')
    .limit(5)
    .populate('reportedBy', 'fullName badgeNumber');
  
  const emergencyAlerts = await CrimeReport.find({
    severity: 'high',
    status: { $ne: 'closed' }
  })
  .limit(5);
  
  res.status(200).json({
    status: 'success',
    data: {
      totalPersonnel,
      activePersonnel: totalPersonnel - pendingRequests,
      newRecruits: 0, // Would need actual logic for this
      pendingRequests,
      totalCrimes,
      recentActivities,
      emergencyAlerts
    }
  });
});