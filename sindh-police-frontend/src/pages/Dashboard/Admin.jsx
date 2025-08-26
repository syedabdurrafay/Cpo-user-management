import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { 
  FiUsers, FiShield, FiAlertCircle, FiUserPlus,
  FiBarChart2, FiClock, FiSearch, FiBell, 
  FiMenu, FiChevronDown, FiPlus, FiMap, FiFileText,
  FiSettings, FiLogOut, FiMoon, FiSun, FiUser
} from 'react-icons/fi';
import { FaUserShield, FaUserCheck, FaUserClock } from 'react-icons/fa';
import DistrictDistributionChart from '../../components/DistrictDistributionChart';
import CrimeTrendChart from '../../components/CrimeTrendChart';
import RecentActivities from '../../components/RecentActivities';
import PersonnelTable from '../../components/PersonnelTable';
import EmergencyAlerts from '../../components/EmergencyAlerts';
import QuickActionsPanel from '../../components/QuickActionsPanel';
import SindhMap from '../../components/SindhMap';
import './dashboard.css';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Log dashboard access
  useEffect(() => {
    const logDashboardAccess = async () => {
      try {
        await API.post('/api/activities', {
          action: 'Accessed IG Dashboard',
          entityType: 'Dashboard',
          details: { dashboardType: 'IG' }
        });
      } catch (error) {
        console.error('Error logging dashboard access:', error);
      }
    };

    logDashboardAccess();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call with timeout
        setTimeout(() => {
          setDashboardData({
            totalPersonnel: 45218,
            activePersonnel: 42356,
            newRecruits: 1284,
            pendingRequests: 56,
            districts: [
              { name: 'Karachi', personnel: 12500, crimeRate: 42 },
              { name: 'Hyderabad', personnel: 6800, crimeRate: 28 },
              { name: 'Sukkur', personnel: 5200, crimeRate: 35 },
              { name: 'Mirpur Khas', personnel: 4800, crimeRate: 31 },
              { name: 'Larkana', personnel: 4500, crimeRate: 27 },
            ],
            recentActivities: [
              { id: 1, action: 'New personnel added', time: '10 mins ago', officer: 'DSP Ali Khan' },
              { id: 2, action: 'Case #45678 resolved', time: '25 mins ago', officer: 'Inspector Sara Ahmed' },
              { id: 3, action: 'Security alert in District Central', time: '1 hour ago', officer: 'SSP Farhan Malik' },
            ],
            emergencyAlerts: [
              { id: 1, type: 'high', location: 'Karachi East', message: 'Protest gathering near City Station' },
              { id: 2, type: 'medium', location: 'Hyderabad', message: 'VIP movement scheduled' },
            ],
            crimeTrends: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              data: {
                'All Districts': [120, 190, 150, 210, 180, 200, 190, 230, 210, 250, 240, 280],
                'Karachi': [80, 120, 90, 140, 110, 130, 120, 150, 140, 170, 160, 190],
                'Hyderabad': [20, 30, 25, 35, 30, 35, 30, 40, 35, 45, 40, 50],
                'Sukkur': [15, 25, 20, 30, 25, 30, 25, 35, 30, 40, 35, 45],
                'Mirpur Khas': [10, 15, 12, 18, 15, 20, 18, 25, 22, 30, 28, 35],
                'Larkana': [5, 10, 8, 12, 10, 15, 12, 18, 15, 20, 18, 25]
              }
            }
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
    logActivity('Toggled dark mode', 'Settings', null, { darkMode: !darkMode });
  };

  const handleLogout = async () => {
    try {
      await logActivity('User logged out', 'User', user.id);
      localStorage.removeItem('police_token');
      localStorage.removeItem('police_user');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      logActivity('Scrolled to section', 'Navigation', null, { section: sectionId });
    }
  };

  const logActivity = async (action, entityType, entityId = null, details = {}) => {
    try {
      await API.post('/api/activities', {
        action,
        entityType,
        entityId,
        details
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleAddPersonnel = async () => {
    try {
      // Your add personnel logic here
      const newPersonnel = { id: '123', name: 'New Officer', rank: 'Constable' };
      await logActivity('Added new personnel', 'Personnel', newPersonnel.id, {
        name: newPersonnel.name,
        rank: newPersonnel.rank
      });
      // Show success message or update UI
    } catch (error) {
      console.error('Error adding personnel:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="mobile-menu-button"
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                  logActivity('Toggled sidebar', 'UI', null, { state: !sidebarOpen });
                }}
              >
                <FiMenu size={24} />
              </button>
              <div className="header-titles">
                <h1 className="header-title">IG Sindh Police Dashboard</h1>
                <p className="header-subtitle">Command and Control Center</p>
              </div>
            </div>
            <div className="header-right">
              <div className="search-container">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      logActivity('Performed search', 'Search', null, { query: e.target.value });
                    }
                  }}
                />
              </div>
              <button 
                className="notification-button"
                onClick={() => logActivity('Viewed notifications', 'Notifications')}
              >
                <FiBell size={20} />
                <span className="notification-badge"></span>
              </button>
              <div className="profile-dropdown">
                <button className="profile-button" onClick={toggleProfileMenu}>
                  <div className="profile-avatar">IG</div>
                  <FiChevronDown className={`dropdown-arrow ${profileOpen ? 'open' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="profile-avatar large">IG</div>
                      <div className="profile-info">
                        <h4>Inspector General</h4>
                        <p>admin@police.sindh.gov.pk</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setProfileOpen(false);
                        logActivity('Viewed profile', 'Profile', user.id);
                        navigate('/profile');
                      }}
                    >
                      <FiUser className="dropdown-icon" />
                      <span>My Profile</span>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => logActivity('Accessed settings', 'Settings')}
                    >
                      <FiSettings className="dropdown-icon" />
                      <span>Settings</span>
                    </button>
                    <button className="dropdown-item" onClick={toggleDarkMode}>
                      {darkMode ? (
                        <FiSun className="dropdown-icon" />
                      ) : (
                        <FiMoon className="dropdown-icon" />
                      )}
                      <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FiLogOut className="dropdown-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h2 className="welcome-title">Welcome, Inspector General</h2>
              <p className="welcome-subtitle">Here's what's happening with your command today</p>
            </div>
          </section>

          {/* Stats Cards Section */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">Total Personnel</h3>
                  <p className="stat-value">{dashboardData.totalPersonnel.toLocaleString()}</p>
                  <p className="stat-change positive">
                    <span>↑</span> 2.5% from last month
                  </p>
                </div>
                <div className="stat-icon">
                  <FaUserShield />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">Active Personnel</h3>
                  <p className="stat-value">{dashboardData.activePersonnel.toLocaleString()}</p>
                  <p className="stat-change positive">
                    <span>↑</span> 3% from last month
                  </p>
                </div>
                <div className="stat-icon">
                  <FaUserCheck />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">New Recruits</h3>
                  <p className="stat-value">{dashboardData.newRecruits.toLocaleString()}</p>
                  <p className="stat-change positive">
                    <span>↑</span> 15% from last quarter
                  </p>
                </div>
                <div className="stat-icon">
                  <FiUserPlus />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">Pending Requests</h3>
                  <p className="stat-value">{dashboardData.pendingRequests}</p>
                  <p className="stat-change negative">
                    <span>↓</span> 8% from last week
                  </p>
                </div>
                <div className="stat-icon">
                  <FaUserClock />
                </div>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="map-section" id="map-section">
            <div className="map-container">
              <div className="section-header">
                <h3 className="section-title">Sindh Police Coverage Map</h3>
                <div className="map-controls">
                  <select 
                    className="map-select"
                    onChange={(e) => {
                      logActivity('Changed map view', 'Map', null, { view: e.target.value });
                    }}
                  >
                    <option>Personnel Distribution</option>
                    <option>Crime Rate</option>
                    <option>Police Stations</option>
                  </select>
                </div>
              </div>
              <div className="map-wrapper">
                <SindhMap darkMode={darkMode} />
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="charts-section">
            <div className="charts-grid">
              <div className="main-chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">District-wise Personnel Distribution</h3>
                  <select 
                    className="chart-select"
                    onChange={(e) => {
                      logActivity('Changed personnel chart period', 'Chart', null, { period: e.target.value });
                    }}
                  >
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                    <option>All Time</option>
                  </select>
                </div>
                <div className="chart-wrapper">
                  <DistrictDistributionChart data={dashboardData.districts} />
                </div>
              </div>

              <div className="secondary-charts">
                <QuickActionsPanel 
                  scrollToSection={scrollToSection}
                  logActivity={logActivity}
                />

                <div className="crime-trend-chart" id="crime-trend-chart">
                  <div className="section-header">
                    <h3 className="section-title">Crime Trend Analysis</h3>
                    <select 
                      className="chart-select"
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        logActivity('Changed crime trend district', 'Chart', null, { district: e.target.value });
                      }}
                    >
                      <option value="All Districts">All Districts</option>
                      {dashboardData.districts.map(district => (
                        <option key={district.name} value={district.name}>{district.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="chart-wrapper">
                    <CrimeTrendChart 
                      data={{
                        labels: dashboardData.crimeTrends.labels,
                        data: dashboardData.crimeTrends.data[selectedDistrict]
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Management Section */}
          <section className="management-section">
            <div className="management-grid">
              <div className="personnel-management" id="personnel-management">
                <div className="section-header">
                  <h3 className="section-title">Personnel Management</h3>
                  <button 
                    className="add-personnel-button"
                    onClick={() => {
                      scrollToSection('personnel-management');
                      handleAddPersonnel();
                    }}
                  >
                    <FiPlus className="button-icon" />
                    Add New Personnel
                  </button>
                </div>
                <div className="table-container">
                  <PersonnelTable logActivity={logActivity} />
                </div>
              </div>

              <div className="alerts-activities">
                <EmergencyAlerts 
                  id="emergency-alerts"
                  alerts={dashboardData.emergencyAlerts}
                  logActivity={logActivity}
                />
                <RecentActivities activities={dashboardData.recentActivities} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default AdminDashboard;