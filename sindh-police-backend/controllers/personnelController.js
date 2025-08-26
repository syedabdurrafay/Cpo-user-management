const Personnel = require('../models/Personnel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Additional middleware to set createdBy field
exports.setCreatedBy = (req, res, next) => {
  req.body.createdBy = req.user.id;
  next();
};

// Get all personnel with additional filtering for constables
exports.getAllPersonnel = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.user.role === 'constable') {
    filter = { district: req.user.district };
  }

  const features = new APIFeatures(Personnel.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const personnel = await features.query.populate('createdBy', 'fullName role');

  res.status(200).json({
    status: 'success',
    results: personnel.length,
    data: {
      personnel
    }
  });
});

// Special dashboard for IG rank
exports.igDashboard = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'ig') {
    return next(
      new AppError('This dashboard is only accessible to IG rank officers', 403)
    );
  }

  // Get statistics for IG dashboard
  const [totalPersonnel, personnelByRank, personnelByDistrict] = await Promise.all([
    Personnel.countDocuments(),
    Personnel.aggregate([
      {
        $group: {
          _id: '$rank',
          count: { $sum: 1 }
        }
      }
    ]),
    Personnel.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalPersonnel,
      personnelByRank,
      personnelByDistrict
    }
  });
});

// Use factory functions for basic CRUD operations
exports.getPersonnel = factory.getOne(Personnel);
exports.createPersonnel = factory.createOne(Personnel);
exports.updatePersonnel = factory.updateOne(Personnel);
exports.deletePersonnel = factory.deleteOne(Personnel);

// Add this middleware to the create route
exports.createPersonnel = [
  exports.setCreatedBy,
  factory.createOne(Personnel)
];