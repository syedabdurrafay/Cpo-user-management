import { motion } from 'framer-motion';
import { FaShieldAlt, FaUser, FaIdBadge, FaEnvelope, FaKey, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from '../../api';
import './Registration.css';
import './sindh-police-logo-new.png';


// Try importing the logo with error handling
let policeLogo;
try {
  policeLogo = require('./sindh-police-logo-new.png').default;
} catch (e) {
  console.warn("Logo image not found, using shield icon as fallback");
  policeLogo = null;
}

const policeRanks = [
  'IG',
  'DIG',
  'AIG',
  'SSP',
  'DSP',
  'Inspector',
  'Constable'
];

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    badgeNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [showRankDropdown, setShowRankDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const selectRank = (rank) => {
    setFormData(prev => ({ ...prev, role: rank }));
    setShowRankDropdown(false);
    if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.badgeNumber.trim()) newErrors.badgeNumber = 'Badge number is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your rank';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setRegistrationError('');
    setErrors({});

    try {
      const { data } = await API.post('/users/register', {
        fullName: formData.fullName,
        badgeNumber: formData.badgeNumber,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role
      });

      if (data.status === 'success') {
        navigate('/login', {
          state: {
            registrationSuccess: true,
            message: 'Registration successful! Please login.'
          }
        });
      }
    } catch (error) {
      const errorData = error.response?.data;
      
      if (errorData?.conflictField) {
        setErrors(prev => ({
          ...prev,
          [errorData.conflictField]: errorData.message
        }));
      } else {
        setRegistrationError(
          errorData?.message || 
          error.message || 
          'Registration failed. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-container"
      >
        <div className="login-header">
          <div className="logo-container">
            {policeLogo ? (
              <img src={policeLogo} alt="Sindh Police Logo" className="login-logo" />
            ) : (
              <FaShieldAlt className="login-icon-fallback" />
            )}
          </div>
          <h2>POLICE REGISTRATION</h2>
          <p>Create new police management account</p>
        </div>

        {registrationError && (
          <div className="alert alert-error">{registrationError}</div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
            <label><FaUser className="input-icon" /> Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="form-input"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className={`form-group ${errors.badgeNumber ? 'has-error' : ''}`}>
            <label><FaIdBadge className="input-icon" /> Badge Number</label>
            <input
              type="text"
              name="badgeNumber"
              value={formData.badgeNumber}
              onChange={handleChange}
              required
              className="form-input"
            />
            {errors.badgeNumber && <span className="error-text">{errors.badgeNumber}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label><FaEnvelope className="input-icon" /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label><FaUser className="input-icon" /> Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className={`form-group ${errors.role ? 'has-error' : ''}`}>
            <label><FaShieldAlt className="input-icon" /> Rank</label>
            <div className="rank-selector">
              <div 
                className={`rank-selected ${errors.role ? 'error' : ''}`}
                onClick={() => setShowRankDropdown(!showRankDropdown)}
              >
                {formData.role || 'Select your rank'}
                <FaChevronDown className={`dropdown-icon ${showRankDropdown ? 'open' : ''}`} />
              </div>
              {showRankDropdown && (
                <div className="rank-dropdown">
                  {policeRanks.map(rank => (
                    <div 
                      key={rank}
                      className="rank-option"
                      onClick={() => selectRank(rank)}
                    >
                      {rank}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label><FaKey className="input-icon" /> Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label><FaKey className="input-icon" /> Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Account'}
          </button>

          <div className="auth-redirect">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}