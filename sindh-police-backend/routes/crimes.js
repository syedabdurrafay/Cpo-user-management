const express = require('express');
const crimeController = require('../controllers/crimeController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(crimeController.getAllCrimeReports)
  .post(
    authController.restrictTo('admin', 'ig', 'dsp', 'constable'),
    crimeController.createCrimeReport
  );

router
  .route('/:id')
  .get(crimeController.getCrimeReport)
  .patch(
    authController.restrictTo('admin', 'ig', 'dsp'),
    crimeController.updateCrimeReport
  );

router.get('/trends', crimeController.getCrimeTrends);

module.exports = router;