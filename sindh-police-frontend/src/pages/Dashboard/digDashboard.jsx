import React, { useState, useEffect } from 'react';
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
import './dashboard.css';

const DigDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setDashboardData({
          // DIG-specific data with different permissions/scope
          totalPersonnel: 35218,
          activePersonnel: 32356,
          newRecruits: 984,
          pendingRequests: 42,
          districts: [
            { name: 'Karachi', personnel: 9500, crimeRate: 42 },
            { name: 'Hyderabad', personnel: 5800, crimeRate: 28 },
            { name: 'Sukkur', personnel: 4200, crimeRate: 35 },
          ],
          recentActivities: [
            { id: 1, action: 'Personnel reassignment', time: '15 mins ago', officer: 'DSP Ali Khan' },
            { id: 2, action: 'Case #45678 reviewed', time: '30 mins ago', officer: 'Inspector Sara Ahmed' },
            { id: 3, action: 'District patrol update', time: '2 hours ago', officer: 'SSP Farhan Malik' },
          ],
          emergencyAlerts: [
            { id: 1, type: 'medium', location: 'Karachi East', message: 'Traffic diversion required' },
            { id: 2, type: 'low', location: 'Hyderabad', message: 'Public gathering notice' },
          ],
          crimeTrends: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [110, 170, 130, 190, 160, 180, 170, 210, 190, 230, 220, 260]
          }
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    console.log('DIG logging out...');
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
        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="mobile-menu-button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FiMenu size={24} />
              </button>
              <div className="header-titles">
                <h1 className="header-title">DIG Sindh Police Dashboard</h1>
                <p className="header-subtitle">Regional Command Center</p>
              </div>
            </div>
            <div className="header-right">
              <div className="search-container">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
              </div>
              <button className="notification-button">
                <FiBell size={20} />
                <span className="notification-badge"></span>
              </button>
              <div className="profile-dropdown">
                <button className="profile-button" onClick={toggleProfileMenu}>
                  <div className="profile-avatar">DIG</div>
                  <FiChevronDown className={`dropdown-arrow ${profileOpen ? 'open' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="profile-avatar large">DIG</div>
                      <div className="profile-info">
                        <h4>Deputy Inspector General</h4>
                        <p>dig@police.sindh.gov.pk</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item">
                      <FiUser className="dropdown-icon" />
                      <span>My Profile</span>
                    </button>
                    <button className="dropdown-item">
                      <FiSettings className="dropdown-icon" />
                      <span>Regional Settings</span>
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
          {/* Welcome Banner */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h2 className="welcome-title">Welcome, Deputy Inspector General</h2>
              <p className="welcome-subtitle">Regional command overview and activities</p>
            </div>
          </section>

          {/* Stats Overview - DIG has fewer personnel under command */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">Regional Personnel</h3>
                  <p className="stat-value">{dashboardData.totalPersonnel.toLocaleString()}</p>
                  <p className="stat-change positive">
                    <span>↑</span> 1.8% from last month
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
                    <span>↑</span> 2.5% from last month
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
                    <span>↑</span> 12% from last quarter
                  </p>
                </div>
                <div className="stat-icon">
                  <FiUserPlus />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">Pending Approvals</h3>
                  <p className="stat-value">{dashboardData.pendingRequests}</p>
                  <p className="stat-change negative">
                    <span>↓</span> 5% from last week
                  </p>
                </div>
                <div className="stat-icon">
                  <FaUserClock />
                </div>
              </div>
            </div>
          </section>

          {/* Charts and Quick Actions - DIG has different quick actions */}
          <section className="charts-section">
            <div className="charts-grid">
              <div className="main-chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">Regional Personnel Distribution</h3>
                  <select className="chart-select">
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="chart-wrapper">
                  <DistrictDistributionChart data={dashboardData.districts} />
                </div>
              </div>

              <div className="secondary-charts">
                <div className="quick-actions-container">
                  <h3 className="section-title">Quick Actions</h3>
                  <div className="quick-actions-grid">
                    <button className="quick-action">
                      <div className="action-icon">
                        <FiUsers />
                      </div>
                      <span className="action-label">Assign Personnel</span>
                    </button>
                    <button className="quick-action">
                      <div className="action-icon">
                        <FiAlertCircle />
                      </div>
                      <span className="action-label">Issue Regional Alert</span>
                    </button>
                    <button className="quick-action">
                      <div className="action-icon">
                        <FiMap />
                      </div>
                      <span className="action-label">View Patrol Routes</span>
                    </button>
                    <button className="quick-action">
                      <div className="action-icon">
                        <FiFileText />
                      </div>
                      <span className="action-label">Regional Report</span>
                    </button>
                  </div>
                </div>

                <div className="crime-trend-chart">
                  <h3 className="section-title">Regional Crime Trends</h3>
                  <div className="chart-wrapper">
                    <CrimeTrendChart data={dashboardData.crimeTrends} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Personnel Management and Alerts - DIG has limited permissions */}
          <section className="management-section">
            <div className="management-grid">
              <div className="personnel-management">
                <div className="section-header">
                  <h3 className="section-title">Personnel Assignments</h3>
                  <button className="add-personnel-button">
                    <FiPlus className="button-icon" />
                    Request Personnel
                  </button>
                </div>
                <div className="table-container">
                  <PersonnelTable isDig={true} />
                </div>
              </div>

              <div className="alerts-activities">
                <EmergencyAlerts alerts={dashboardData.emergencyAlerts} isDig={true} />
                <RecentActivities activities={dashboardData.recentActivities} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default DigDashboard;