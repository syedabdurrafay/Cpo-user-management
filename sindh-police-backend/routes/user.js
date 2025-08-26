const express = require('express');
const router = express.Router();
const {
  register,
  login,
  protect,
  restrictTo
} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);

// Protected routes example
// router.get('/profile', protect, getUserProfile);
// router.patch('/update', protect, updateUser);
// router.get('/admin', protect, restrictTo('admin'), adminDashboard);

module.exports = router;