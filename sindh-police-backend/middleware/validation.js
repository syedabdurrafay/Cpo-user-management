const { check, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.validatePersonnel = [
  check('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters'),
  
  check('rank')
    .isIn([
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
    ])
    .withMessage('Invalid rank'),
  
  check('badgeNumber')
    .notEmpty()
    .withMessage('Badge number is required')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('Badge number can only contain letters and numbers'),
  
  check('district')
    .notEmpty()
    .withMessage('District is required'),
  
  check('station')
    .notEmpty()
    .withMessage('Station is required'),
  
  check('dateOfJoining')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Date of joining cannot be in the future');
      }
      return true;
    }),
  
  check('contactNumber')
    .optional()
    .matches(/^\d{11}$/)
    .withMessage('Contact number must be 11 digits'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return next(new AppError(errorMessages.join('. '), 400));
    }
    next();
  }
];