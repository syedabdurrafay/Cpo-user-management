import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import './Footer.css';

export default function PoliceFooter() {
  return (
    <footer className="police-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-3d-container">
              <img 
                src="/sindh-police-logo-new.png" 
                alt="Sindh Police Logo" 
                className="footer-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/sindh-police-logo-new.png';
                }}
              />
              <div className="logo-3d-effect"></div>
            </div>
            <div className="footer-logo-text">
              <span>Sindh Police</span>
              <small>Command & Control</small>
            </div>
          </div>
          <p className="footer-mission">
            Advanced digital platform for modern policing operations and management.
          </p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h3>System</h3>
            <a href="/dashboard">Dashboard</a>
            <a href="/operations">Operations</a>
            <a href="/analytics">Analytics</a>
          </div>

          <div className="link-group">
            <h3>Resources</h3>
            <a href="#">Help Center</a>
            <a href="#">API Docs</a>
            <a href="#">System Status</a>
          </div>

          <div className="link-group contact-info">
            <h3>Command Center</h3>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>Police Headquarters, Karachi</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>+92 21 9921 2601</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>command@sindhpolice.gov.pk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="security-badge">
          <FaShieldAlt />
          <span>Secure & Encrypted Network</span>
        </div>
        <p>© {new Date().getFullYear()} Sindh Police Digital Platform. All rights reserved.</p>
      </div>
      
      <div className="footer-glows">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>
    </footer>
  );
}