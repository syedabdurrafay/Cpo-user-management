const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Email = require('../utils/email');
// Add these at the top with other imports
const Activity = require('../models/activityModel');
const activityController = require('./activityController');
const catchAsync = require('../utils/catchAsync');

// Update login function
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect username or password'
      });
    }

    const token = signToken(user._id);
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Log login activity
    await activityController.logLoginActivity(user._id, req);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          role: user.role,
          dashboard: roleConfig[user.role].dashboard
        }
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login',
      error: err.message
    });
  }
};

// Add logout function
exports.logout = catchAsync(async (req, res) => {
  // Log logout activity
  await activityController.logLogoutActivity(req.user.id, req);

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Role configuration with limits
const roleConfig = {
  'IG': { limit: 1, dashboard: '/ig-dashboard' },
  'DIG': { limit: 10, dashboard: '/dig-dashboard' },
  'AIG': { limit: 15, dashboard: '/aig-dashboard' },
  'SSP': { limit: 50, dashboard: '/ssp-dashboard' },
  'DSP': { limit: 100, dashboard: '/dsp-dashboard' },
  'Inspector': { limit: 0, dashboard: '/inspector-dashboard' },
  'Constable': { limit: 0, dashboard: '/constable-dashboard' }
};

exports.register = async (req, res) => {
  try {
    const { fullName, badgeNumber, email, username, password, role } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!fullName) missingFields.push('fullName');
    if (!badgeNumber) missingFields.push('badgeNumber');
    if (!email) missingFields.push('email');
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');
    if (!role) missingFields.push('role');

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate role
    if (!roleConfig[role]) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid rank selected'
      });
    }

    // Check role limit
    if (roleConfig[role].limit > 0) {
      const count = await User.countDocuments({ role });
      if (count >= roleConfig[role].limit) {
        return res.status(400).json({
          status: 'fail',
          message: `Maximum number of ${role} accounts reached (Limit: ${roleConfig[role].limit})`
        });
      }
    }

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }, { badgeNumber }]
    });

    if (existingUser) {
      let conflictField = '';
      if (existingUser.email === email) conflictField = 'email';
      else if (existingUser.username === username) conflictField = 'username';
      else if (existingUser.badgeNumber === badgeNumber) conflictField = 'badgeNumber';

      return res.status(400).json({
        status: 'fail',
        message: `User with this ${conflictField} already exists`,
        conflictField
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      badgeNumber,
      email,
      username,
      password,
      role
    });

    // Generate token
    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          role: user.role,
          dashboard: roleConfig[user.role].dashboard
        }
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration',
      error: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check if credentials exist
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    // 2. Check if user exists and password is correct
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect username or password'
      });
    }

    // 3. Generate token
    const token = signToken(user._id);

    // 4. Send response with dashboard path
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          role: user.role,
          dashboard: roleConfig[user.role].dashboard
        }
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login',
      error: err.message
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email address'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found (security best practice)
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists with this email, a reset link has been sent'
      });
    }

    // Generate and save reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      // Send email
      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to email!'
      });
    } catch (err) {
      // Reset token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error('Email sending error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Please try again later.'
      });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during password reset'
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password must be at least 8 characters'
      });
    }

    // Hash the token to compare with DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Update user password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    // Generate new JWT token
    const newToken = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token: newToken,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          role: user.role,
          dashboard: roleConfig[user.role].dashboard
        }
      }
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during password reset'
    });
  }
};