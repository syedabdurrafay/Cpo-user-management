import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaCheck } from 'react-icons/fa';
import API from '../../api';
import './ResetPassword.css';

// Fallback notification system if react-toastify fails
const showNotification = (message, type = 'error') => {
  const notification = document.createElement('div');
  notification.className = `fixed-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showNotification('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      showNotification('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await API.patch(`/auth/reset-password/${token}`, { password });
      
      if (response.data.status === 'success') {
        setSuccess(true);
        showNotification('Password reset successfully!', 'success');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      'Failed to reset password. The link may have expired.';
      setError(errorMsg);
      showNotification(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="reset-password-success">
        <div className="success-icon">
          <FaCheck />
        </div>
        <h2>Password Reset Successful!</h2>
        <p>You can now login with your new password.</p>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <FaLock className="icon" />
          <h2>RESET YOUR PASSWORD</h2>
          <p>Create a new password for your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="8"
              placeholder="Re-enter your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'loading' : ''}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>

      {/* Add CSS for fallback notifications */}
      <style jsx>{`
        .fixed-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px;
          border-radius: 4px;
          color: white;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }
        .fixed-notification.error {
          background-color: #e74c3c;
        }
        .fixed-notification.success {
          background-color: #2ecc71;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}