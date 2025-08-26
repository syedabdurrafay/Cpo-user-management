import React, { useState, useEffect } from 'react';
import "./personneltable.css";
import { 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiUserPlus,
  FiUser,
  FiShield,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiRefreshCw
} from 'react-icons/fi';
import API from "../api";
import { toast } from 'react-toastify';

const PersonnelTable = ({ logActivity }) => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [badgeNumberError, setBadgeNumberError] = useState('');
  
  const rankOptions = [
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
  ];

  const [newPersonnel, setNewPersonnel] = useState({
    fullName: '',
    rank: 'constable',
    badgeNumber: '',
    district: '',
    station: '',
    dateOfJoining: '',
    currentAssignment: '',
    contactNumber: '',
    isActive: true
  });

  // Fetch all personnel
  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/personnel');
      
      if (response.data.status === 'success') {
        setPersonnel(response.data.data.personnel);
        toast.success('Personnel data loaded successfully');
        
        // Log the activity if logActivity function is provided
        if (logActivity) {
          logActivity('Fetched personnel data', 'Personnel', null, {
            count: response.data.data.personnel.length
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch personnel');
      }
    } catch (err) {
      console.error('Error fetching personnel:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch personnel data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const validateBadgeNumber = async (badgeNumber, currentId = null) => {
    if (!badgeNumber) return { isValid: false, message: 'Badge number is required' };
    
    // Check format (alphanumeric)
    const badgeRegex = /^[A-Za-z0-9]+$/;
    if (!badgeRegex.test(badgeNumber)) {
      return { isValid: false, message: 'Badge number must contain only letters and numbers' };
    }
    
    // Check for duplicates in the current list (client-side validation)
    const existingPersonnel = personnel.find(p => 
      p.badgeNumber.toLowerCase() === badgeNumber.toLowerCase() && p._id !== currentId
    );
    
    if (existingPersonnel) {
      return { 
        isValid: false, 
        message: `Badge number already assigned to ${existingPersonnel.fullName}` 
      };
    }
    
    return { isValid: true, message: '' };
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setBadgeNumberError('');
    
    // Validate badge number
    const badgeValidation = await validateBadgeNumber(newPersonnel.badgeNumber);
    if (!badgeValidation.isValid) {
      setBadgeNumberError(badgeValidation.message);
      toast.error(badgeValidation.message);
      return;
    }
    
    try {
      const response = await API.post('/personnel', newPersonnel);
      
      if (response.data.status === 'success') {
        setPersonnel(prev => [response.data.data.personnel, ...prev]);
        setNewPersonnel({
          fullName: '',
          rank: 'constable',
          badgeNumber: '',
          district: '',
          station: '',
          dateOfJoining: '',
          currentAssignment: '',
          contactNumber: '',
          isActive: true
        });
        setShowAddForm(false);
        toast.success('Personnel added successfully');
        
        // Log the activity if logActivity function is provided
        if (logActivity) {
          logActivity('Added new personnel', 'Personnel', response.data.data.personnel._id, {
            name: response.data.data.personnel.fullName,
            badgeNumber: response.data.data.personnel.badgeNumber
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to add personnel');
      }
    } catch (err) {
      console.error('Error adding personnel:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add personnel';
      
      // Handle duplicate badge number error specifically
      if (err.response?.data?.message?.includes('badge number') || 
          errorMessage.includes('badge number')) {
        setBadgeNumberError('This badge number is already in use');
      }
      
      toast.error(errorMessage);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowAddForm(false);
    const person = personnel.find(p => p._id === id);
    setEditData({ 
      ...person,
      dateOfJoining: person.dateOfJoining ? new Date(person.dateOfJoining).toISOString().split('T')[0] : ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this personnel record?')) {
      try {
        const response = await API.delete(`/personnel/${id}`);
        
        if (response.data.status === 'success') {
          const deletedPersonnel = personnel.find(p => p._id === id);
          setPersonnel(personnel.filter(p => p._id !== id));
          toast.success('Personnel deleted successfully');
          
          // Log the activity if logActivity function is provided
          if (logActivity) {
            logActivity('Deleted personnel', 'Personnel', id, {
              name: deletedPersonnel.fullName,
              badgeNumber: deletedPersonnel.badgeNumber
            });
          }
        } else {
          throw new Error(response.data.message || 'Failed to delete personnel');
        }
      } catch (err) {
        console.error('Error deleting personnel:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete personnel';
        toast.error(errorMessage);
      }
    }
  };

  const handleSave = async (id) => {
    setBadgeNumberError('');
    
    // Validate badge number for edits
    const badgeValidation = await validateBadgeNumber(editData.badgeNumber, id);
    if (!badgeValidation.isValid) {
      setBadgeNumberError(badgeValidation.message);
      toast.error(badgeValidation.message);
      return;
    }
    
    try {
      const response = await API.patch(`/personnel/${id}`, editData);
      
      if (response.data.status === 'success') {
        setPersonnel(personnel.map(p => 
          p._id === id ? response.data.data.personnel : p
        ));
        setEditingId(null);
        toast.success('Personnel updated successfully');
        
        // Log the activity if logActivity function is provided
        if (logActivity) {
          logActivity('Updated personnel', 'Personnel', id, {
            name: response.data.data.personnel.fullName,
            badgeNumber: response.data.data.personnel.badgeNumber
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to update personnel');
      }
    } catch (err) {
      console.error('Error updating personnel:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update personnel';
      
      // Handle duplicate badge number error specifically
      if (err.response?.data?.message?.includes('badge number') || 
          errorMessage.includes('badge number')) {
        setBadgeNumberError('This badge number is already in use');
      }
      
      toast.error(errorMessage);
    }
  };

  const handleNewInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPersonnel(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear badge number error when user starts typing
    if (name === 'badgeNumber' && badgeNumberError) {
      setBadgeNumberError('');
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear badge number error when user starts typing
    if (name === 'badgeNumber' && badgeNumberError) {
      setBadgeNumberError('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setBadgeNumberError('');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setBadgeNumberError('');
    fetchPersonnel();
  };

  if (loading) {
    return (
      <div className="personnel-table-container">
        <div className="loading-spinner">
          <FiRefreshCw className="spinning" />
          <p>Loading personnel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personnel-table-container">
      <div className="table-header">
        <div className="header-left">
          <h3>Personnel Management</h3>
          <span className="personnel-count">({personnel.length} records)</span>
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
          <button 
            className="add-personnel-btn"
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
              setBadgeNumberError('');
            }}
            disabled={showAddForm}
          >
            <FiUserPlus /> Add New Personnel
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {badgeNumberError && (
        <div className="error-message">
          <p>{badgeNumberError}</p>
        </div>
      )}

      {showAddForm && (
        <div className="personnel-form">
          <div className="form-header">
            <h4>Add New Personnel</h4>
            <button className="close-form" onClick={handleCancel}>
              <FiX />
            </button>
          </div>
          <form onSubmit={handleAddSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label><FiUser /> Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={newPersonnel.fullName}
                  onChange={handleNewInputChange}
                  required
                  minLength="3"
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label><FiShield /> Rank *</label>
                <select
                  name="rank"
                  value={newPersonnel.rank}
                  onChange={handleNewInputChange}
                  required
                >
                  {rankOptions.map(rank => (
                    <option key={rank} value={rank}>
                      {rank.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Badge Number *</label>
                <input
                  type="text"
                  name="badgeNumber"
                  value={newPersonnel.badgeNumber}
                  onChange={handleNewInputChange}
                  required
                  pattern="[A-Za-z0-9]+"
                  title="Only alphanumeric characters allowed"
                  placeholder="e.g., SP12345"
                  className={badgeNumberError ? 'error' : ''}
                />
                {badgeNumberError && <span className="field-error">{badgeNumberError}</span>}
              </div>

              <div className="form-group">
                <label><FiMapPin /> District *</label>
                <input
                  type="text"
                  name="district"
                  value={newPersonnel.district}
                  onChange={handleNewInputChange}
                  required
                  placeholder="Enter district"
                />
              </div>

              <div className="form-group">
                <label>Station *</label>
                <input
                  type="text"
                  name="station"
                  value={newPersonnel.station}
                  onChange={handleNewInputChange}
                  required
                  placeholder="Enter police station"
                />
              </div>

              <div className="form-group">
                <label><FiClock /> Date of Joining *</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={newPersonnel.dateOfJoining}
                  onChange={handleNewInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label><FiBriefcase /> Current Assignment</label>
                <input
                  type="text"
                  name="currentAssignment"
                  value={newPersonnel.currentAssignment}
                  onChange={handleNewInputChange}
                  placeholder="Current assignment/duty"
                />
              </div>

              <div className="form-group">
                <label><FiPhone /> Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={newPersonnel.contactNumber}
                  onChange={handleNewInputChange}
                  pattern="[0-9]{11}"
                  title="Please enter a valid 11-digit phone number"
                  placeholder="03XXXXXXXXX"
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newPersonnel.isActive}
                  onChange={handleNewInputChange}
                />
                Active Status
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Personnel
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="personnel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rank</th>
              <th>Badge No.</th>
              <th>District</th>
              <th>Station</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No personnel records found. Click "Add New Personnel" to get started.
                </td>
              </tr>
            ) : (
              personnel.map((person) => (
                <tr key={person._id} className={editingId === person._id ? 'editing' : ''}>
                  <td>
                    {editingId === person._id ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleEditChange}
                        required
                        minLength="3"
                      />
                    ) : (
                      <div className="person-name">
                        <FiUser className="icon" />
                        {person.fullName}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === person._id ? (
                      <select
                        name="rank"
                        value={editData.rank}
                        onChange={handleEditChange}
                        required
                      >
                        {rankOptions.map(rank => (
                          <option key={rank} value={rank}>
                            {rank.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="rank-badge">
                        {person.rank.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === person._id ? (
                      <div>
                        <input
                          type="text"
                          name="badgeNumber"
                          value={editData.badgeNumber}
                          onChange={handleEditChange}
                          required
                          pattern="[A-Za-z0-9]+"
                          className={badgeNumberError ? 'error' : ''}
                        />
                        {badgeNumberError && <span className="field-error">{badgeNumberError}</span>}
                      </div>
                    ) : (
                      <code className="badge-number">{person.badgeNumber}</code>
                    )}
                  </td>
                  <td>
                    {editingId === person._id ? (
                      <input
                        type="text"
                        name="district"
                        value={editData.district}
                        onChange={handleEditChange}
                        required
                      />
                    ) : (
                      person.district
                    )}
                  </td>
                  <td>
                    {editingId === person._id ? (
                      <input
                        type="text"
                        name="station"
                        value={editData.station}
                        onChange={handleEditChange}
                        required
                      />
                    ) : (
                      person.station
                    )}
                  </td>
                  <td>
                    {editingId === person._id ? (
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={editData.isActive}
                          onChange={handleEditChange}
                        />
                        Active
                      </label>
                    ) : (
                      <span className={`status-badge ${person.isActive ? 'active' : 'inactive'}`}>
                        {person.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingId === person._id ? (
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleSave(person._id)} 
                          className="action-btn save"
                        >
                          <FiCheck /> Save
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="action-btn cancel"
                        >
                          <FiX /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="view-actions">
                        <button 
                          onClick={() => handleEdit(person._id)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(person._id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonnelTable;