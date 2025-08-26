import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

export default function PoliceHeader() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header className={`police-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <div className="logo-3d-container">
            <img 
              src="/sindh-police-logo-new.png" 
              alt="Sindh Police Logo" 
              className="header-logo-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/sindh-police-logo-new.png';
              }}
            />
            <div className="logo-3d-effect"></div>
          </div>
          <div className="header-titles">
            <span className="header-title">Sindh Police</span>
            <span className="header-subtitle">Command & Control</span>
          </div>
        </div>
        
        {user && (
          <div className="user-controls">
            <div className="user-profile">
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-rank">{user.rank}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}