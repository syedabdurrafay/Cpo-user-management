import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaShieldAlt, 
  FaUsers, 
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

export default function PoliceSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminLinks = [
    { name: 'Dashboard', icon: <FaChartLine />, path: '/dashboard' },
    { name: 'Personnel', icon: <FaUsers />, path: '/personnel' },
    { name: 'Reports', icon: <FaFileAlt />, path: '/reports' },
    { name: 'Settings', icon: <FaCog />, path: '/settings' }
  ];

  const basicLinks = [
    { name: 'My Profile', icon: <FaShieldAlt />, path: '/profile' },
    { name: 'Duty Roster', icon: <FaFileAlt />, path: '/roster' }
  ];

  const links = user?.accessLevel === 'admin' ? adminLinks : basicLinks;

  return (
    <div className="police-sidebar">
      <div className="sidebar-header">
        <FaShieldAlt className="sidebar-icon" />
        <span className="sidebar-title">Police HQ</span>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-text">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}