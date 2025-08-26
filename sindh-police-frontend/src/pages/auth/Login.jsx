import { motion } from 'framer-motion';
import { FaShieldAlt, FaUser, FaKey } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import './Login.css';
import policeLogo from './sindh-police-logo-new.png'; // Make sure to add your logo file

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await API.post('/users/login', formData);
      
      if (response.data.status === 'success') {
        login(response.data.token, response.data.data.user);
        
        // Redirect based on role with correct paths
        const userRole = response.data.data.user.role?.toUpperCase();
        switch(userRole) {
          case 'IG':
          case 'ADMIN':
            navigate('/dashboard/admin');
            break;
          case 'DIG':
          case 'AIG':
            navigate('/dashboard/dig');
            break;
          case 'SSP':
            navigate('/dashboard/ssp');
            break;
          case 'DSP':
            navigate('/dashboard/dsp');
            break;
          case 'INSPECTOR':
            navigate('/dashboard/inspector');
            break;
          default:
            navigate('/dashboard/constable');
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
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
            <img src={policeLogo} alt="Police Logo" className="login-logo" />
          </div>
          <h2>POLICE AUTHENTICATION</h2>
          <p>Secure access to police management system</p>
        </div>

        {location.state?.registrationSuccess && (
          <div className="alert alert-success">
            {location.state.message}
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><FaUser className="input-icon" /> Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label><FaKey className="input-icon" /> Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-redirect">
            Don't have an account? <Link to="/register">Register</Link> | 
            <Link to="/forgot-password"> Forgot Password?</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}