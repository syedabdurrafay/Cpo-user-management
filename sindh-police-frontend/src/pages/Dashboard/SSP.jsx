import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { 
  FiUsers, FiShield, FiAlertCircle, 
  FiBarChart2, FiSearch, FiBell, 
  FiMenu, FiChevronDown, FiPlus, 
  FiSettings, FiLogOut, FiMoon, FiSun, FiUser
} from 'react-icons/fi';
import { FaUserShield, FaUserCheck } from 'react-icons/fa';
import DistrictDistributionChart from '../../components/DistrictDistributionChart';
import RecentActivities from '../../components/RecentActivities';
import './dashboard.css';

const SSPDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setDashboardData({
          // SSP-specific data with different scope
          totalPersonnel: 5218,
          activePersonnel: 4856,
          pendingRequests: 12,
          districts: [
            { name: 'Karachi Central', personnel: 2500, crimeRate: 38 },
            { name: 'Karachi East', personnel: 1500, crimeRate: 42 },
            { name: 'Karachi West', personnel: 1218, crimeRate: 35 },
          ],
          recentActivities: [
            { id: 1, action: 'Beat adjustment', time: '30 mins ago', officer: 'Inspector Ali' },
            { id: 2, action: 'Patrol review', time: '1 hour ago', officer: 'SI Farhan' },
          ],
          crimeTrends: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [90, 120, 110, 130, 115, 140]
          }
        });
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  const toggleProfileMenu = () => setProfileOpen(!profileOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLogout = () => console.log('SSP logging out...');

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
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mobile-menu-button">
                <FiMenu size={24} />
              </button>
              <div className="header-titles">
                <h1 className="header-title">SSP Command Dashboard</h1>
                <p className="header-subtitle">District Operations Center</p>
              </div>
            </div>
            <div className="header-right">
              <div className="search-container">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
              <button className="notification-button">
                <FiBell size={20} />
                <span className="notification-badge"></span>
              </button>
              <div className="profile-dropdown">
                <button className="profile-button" onClick={toggleProfileMenu}>
                  <div className="profile-avatar">SSP</div>
                  <FiChevronDown className={`dropdown-arrow ${profileOpen ? 'open' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="profile-avatar large">SSP</div>
                      <div className="profile-info">
                        <h4>Senior Superintendent</h4>
                        <p>ssp@police.sindh.gov.pk</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item">
                      <FiUser className="dropdown-icon" />
                      <span>My Profile</span>
                    </button>
                    <button className="dropdown-item">
                      <FiSettings className="dropdown-icon" />
                      <span>District Settings</span>
                    </button>
                    <button className="dropdown-item" onClick={toggleDarkMode}>
                      {darkMode ? <FiSun /> : <FiMoon />}
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

        <main className="dashboard-main">
          <section className="welcome-section">
            <div className="welcome-content">
              <h2 className="welcome-title">Welcome, Senior Superintendent</h2>
              <p className="welcome-subtitle">District command overview and operations</p>
            </div>
          </section>

          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">District Personnel</h3>
                  <p className="stat-value">{dashboardData.totalPersonnel.toLocaleString()}</p>
                  <p className="stat-change positive">↑ 1.2% from last month</p>
                </div>
                <div className="stat-icon">
                  <FaUserShield />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">Active Personnel</h3>
                  <p className="stat-value">{dashboardData.activePersonnel.toLocaleString()}</p>
                  <p className="stat-change positive">↑ 2.1% from last month</p>
                </div>
                <div className="stat-icon">
                  <FaUserCheck />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <h3 className="stat-title">Pending Approvals</h3>
                  <p className="stat-value">{dashboardData.pendingRequests}</p>
                  <p className="stat-change negative">↓ 3% from last week</p>
                </div>
                <div className="stat-icon">
                  <FiAlertCircle />
                </div>
              </div>
            </div>
          </section>

          <section className="charts-section">
            <div className="charts-grid">
              <div className="main-chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">District Personnel Distribution</h3>
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
                      <span className="action-label">Manage Beats</span>
                    </button>
                    <button className="quick-action">
                      <div className="action-icon">
                        <FiAlertCircle />
                      </div>
                      <span className="action-label">District Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="management-section">
            <div className="management-grid">
              <div className="recent-activities">
                <RecentActivities activities={dashboardData.recentActivities} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default SSPDashboard;