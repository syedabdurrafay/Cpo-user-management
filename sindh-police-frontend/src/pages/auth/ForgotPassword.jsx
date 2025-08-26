import { motion } from 'framer-motion';
import { FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from '../../api';
import './ForgotPassword.css';

// Fallback notification system
const showNotification = (message, type = 'error') => {
  const notification = document.createElement('div');
  notification.className = `fixed-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await API.post('/auth/forgot-password', { email });
      
      if (response.data.status === 'success') {
        setMessage('Password reset link sent to your email!');
        showNotification('Password reset link sent to your email!', 'success');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      'Failed to send reset link. Please try again.';
      setMessage(errorMsg);
      showNotification(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="forgot-password-container"
      >
        <div className="forgot-password-header">
          <FaShieldAlt className="forgot-password-icon" />
          <h2>FORGOT PASSWORD</h2>
          <p>Enter your registered email to receive a reset link</p>
        </div>

        {message && (
          <div className={`alert-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope /> Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your official email"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'loading' : ''}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="auth-redirect">
            Remember your password? <Link to="/login">Login here</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}