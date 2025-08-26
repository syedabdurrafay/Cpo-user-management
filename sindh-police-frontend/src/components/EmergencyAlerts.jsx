import { FiAlertTriangle, FiPlus, FiX, FiRefreshCw } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './EmergencyAlerts.css';

const EmergencyAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    alertType: 'emergency',
    severity: 'medium',
    districts: ''
  });

  // ✅ Fetch alerts from backend
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/alerts', {  // ✅ removed extra /api
        params: { status: 'active', limit: 10 }
      });
      setAlerts(response.data.data.alerts);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  // ✅ Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Submit new alert
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // convert districts string → array
      const districtsArray = newAlert.districts
        .split(',')
        .map(d => d.trim())
        .filter(d => d);

      const alertData = {
        title: newAlert.title,
        description: newAlert.description,
        alertType: newAlert.alertType,
        severity: newAlert.severity,
        districts: districtsArray
      };

      const response = await API.post('/alerts', alertData); // ✅ fixed endpoint
      setAlerts(prev => [response.data.data.alert, ...prev]);
      setNewAlert({
        title: '',
        description: '',
        alertType: 'emergency',
        severity: 'medium',
        districts: ''
      });
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error creating alert:', err);
      setError(err.message || 'Failed to create alert. Please try again.');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  // ✅ Styling helpers
  const getAlertClass = (severity) => {
    switch (severity) {
      case 'high': return 'alert-high';
      case 'critical': return 'alert-critical';
      case 'medium': return 'alert-medium';
      default: return 'alert-low';
    }
  };

  const getAlertIconClass = (severity) => {
    switch (severity) {
      case 'high': return 'alert-icon-high';
      case 'critical': return 'alert-icon-critical';
      case 'medium': return 'alert-icon-medium';
      default: return 'alert-icon-low';
    }
  };

  const getPriorityClass = (severity) => {
    switch (severity) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  if (loading) {
    return (
      <div className="emergency-alerts-container">
        <div className="emergency-alerts-header">
          <h2 className="emergency-alerts-title">Emergency Alerts</h2>
          <span className="alert-count">Loading...</span>
        </div>
        <div className="loading-alerts">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="emergency-alerts-container">
      <div className="emergency-alerts-header">
        <div className="header-left">
          <h2 className="emergency-alerts-title">Emergency Alerts</h2>
          <span className="alert-count">
            {alerts.length} Active
          </span>
        </div>
        <div className="header-right">
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>
      
      {error && <div className="alert-error">{error}</div>}

      <div className="alerts-list">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert._id} className={`alert-item ${getAlertClass(alert.severity)}`}>
              <div className="flex items-start">
                <div className={`alert-icon ${getAlertIconClass(alert.severity)}`}>
                  <FiAlertTriangle size={18} />
                </div>
                <div className="alert-content">
                  <div className="flex justify-between items-center">
                    <h3 className="alert-title">{alert.title}</h3>
                    <div className="alert-meta">
                      <span className={`alert-priority ${getPriorityClass(alert.severity)}`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                      <span className="alert-type">{alert.alertType}</span>
                    </div>
                  </div>
                  <p className="alert-description">{alert.description}</p>
                  {alert.districts && alert.districts.length > 0 && (
                    <div className="alert-districts">
                      <span>Districts: </span>
                      {alert.districts.join(', ')}
                    </div>
                  )}
                  <div className="alert-footer">
                    <span className="alert-issued-by">
                      Issued by: {alert.issuedBy?.fullName || 'System'} ({alert.issuedBy?.role})
                    </span>
                    <span className="alert-time">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-alerts">No active alerts</div>
        )}
      </div>

      {isFormOpen && (
        <div className="alert-form-container">
          <div className="alert-form-header">
            <h3>Report New Emergency</h3>
            <button 
              className="close-form-btn"
              onClick={() => setIsFormOpen(false)}
            >
              <FiX size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newAlert.title}
                onChange={handleInputChange}
                placeholder="Brief alert title"
                required
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={newAlert.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the emergency"
                required
                rows="3"
                maxLength={500}
              />
            </div>
            <div className="form-group">
              <label htmlFor="alertType">Alert Type*</label>
              <select
                id="alertType"
                name="alertType"
                value={newAlert.alertType}
                onChange={handleInputChange}
                required
              >
                <option value="emergency">Emergency</option>
                <option value="crime">Crime</option>
                <option value="missing">Missing Person</option>
                <option value="wanted">Wanted</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="form-group">
              <label>Severity Level*</label>
              <div className="severity-options">
                <label className="severity-option">
                  <input
                    type="radio"
                    name="severity"
                    value="critical"
                    checked={newAlert.severity === 'critical'}
                    onChange={handleInputChange}
                  />
                  <span className="severity-critical">Critical</span>
                </label>
                <label className="severity-option">
                  <input
                    type="radio"
                    name="severity"
                    value="high"
                    checked={newAlert.severity === 'high'}
                    onChange={handleInputChange}
                  />
                  <span className="severity-high">High</span>
                </label>
                <label className="severity-option">
                  <input
                    type="radio"
                    name="severity"
                    value="medium"
                    checked={newAlert.severity === 'medium'}
                    onChange={handleInputChange}
                  />
                  <span className="severity-medium">Medium</span>
                </label>
                <label className="severity-option">
                  <input
                    type="radio"
                    name="severity"
                    value="low"
                    checked={newAlert.severity === 'low'}
                    onChange={handleInputChange}
                  />
                  <span className="severity-low">Low</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="districts">Affected Districts (comma separated)*</label>
              <input
                type="text"
                id="districts"
                name="districts"
                value={newAlert.districts}
                onChange={handleInputChange}
                placeholder="District1, District2, District3"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-alert-btn">
                Submit Alert
              </button>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="action-buttons">
        {user && (
          <button 
            className="add-alert-btn"
            onClick={() => setIsFormOpen(true)}
          >
            <FiPlus size={16} />
            Report Emergency
          </button>
        )}
        <button 
          className="view-all-btn"
          onClick={() => window.location.href = '/alerts'}
        >
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default EmergencyAlerts;
