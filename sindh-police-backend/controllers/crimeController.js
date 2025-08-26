const CrimeReport = require('../models/CrimeReport');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
//const APIFeatures = require('../utils/apiFeatures');

exports.getAllCrimeReports = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(CrimeReport.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const crimeReports = await features.query.populate('reportedBy', 'fullName badgeNumber');

  res.status(200).json({
    status: 'success',
    results: crimeReports.length,
    data: {
      crimeReports
    }
  });
});

exports.getCrimeReport = catchAsync(async (req, res, next) => {
  const crimeReport = await CrimeReport.findById(req.params.id)
    .populate('reportedBy', 'fullName badgeNumber')
    .populate('assignedTo', 'name rank badgeNumber');

  if (!crimeReport) {
    return next(new AppError('No crime report found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      crimeReport
    }
  });
});

exports.updateCrimeReport = catchAsync(async (req, res, next) => {
  const crimeReport = await CrimeReport.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!crimeReport) {
    return next(new AppError('No crime report found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      crimeReport
    }
  });
});