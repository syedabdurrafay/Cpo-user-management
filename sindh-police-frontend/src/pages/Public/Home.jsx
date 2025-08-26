import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import PoliceHeader from '../../components/Header';
import PoliceFooter from '../../components/Footer';
import './Home.css';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const particlesInit = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const particlesLoaded = async (container) => {
    particlesInit.current = container;
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-logo">
            <div className="logo-3d-container">
              <img 
                src="/sindh-police-logo-new.png" 
                alt="Sindh Police Loading" 
                className="pulse-logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/sindh-police-logo-new.png';
                }}
              />
              <div className="logo-3d-effect"></div>
            </div>
            <div className="loading-text">
              <span>Sindh Police</span>
              <small>Command & Control</small>
            </div>
          </div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Particles
        id="tsparticles"
        init={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#0A1A2F",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#00F5FF",
            },
            links: {
              color: "#00F5FF",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
      
      <PoliceHeader />
      
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <div className="logo-3d-container">
                  <img 
                    src="/sindh-police-logo-new.png" 
                    alt="Sindh Police Logo" 
                    className="police-logo floating"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/sindh-police-logo-new.png';
                    }}
                  />
                  <div className="logo-3d-effect"></div>
                </div>
              </div>
              <h1 className="hero-title">
                <span className="hero-main-title">Sindh Police</span>
                <span className="hero-sub-title">Command & Control Center</span>
              </h1>
              <p className="hero-description">
                Advanced digital platform for modern policing operations, 
                intelligence analysis, and real-time command management.
              </p>
              
              <div className="hero-actions">
                {!user ? (
                  <>
                    <a href="/login" className="action-btn primary-btn neon-btn">
                      <span>Officer Login</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="#features" className="action-btn secondary-btn">
                      Explore System
                    </a>
                  </>
                ) : (
                  <a href="/dashboard" className="action-btn primary-btn neon-btn">
                    <span>Access Dashboard</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M10.75 8.75L14.25 12L10.75 15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="hero-grid"></div>
          <div className="hero-glows">
            <div className="glow-1"></div>
            <div className="glow-2"></div>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="section-container">
            <h2 className="section-title">
              <span>System Capabilities</span>
            </h2>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15C19.2669 15.3016 19.227 15.6363 19.2846 15.9606C19.3422 16.2849 19.495 16.5835 19.7226 16.8176C19.9502 17.0517 20.2414 17.2105 20.5566 17.2729C20.8718 17.3352 21.1955 17.298 21.486 17.166L21.6 17.116L19.116 19.6L17.166 21.486C17.298 21.1955 17.3352 20.8718 17.2729 20.5566C17.2105 20.2414 17.0517 19.9502 16.8176 19.7226C16.5835 19.495 16.2849 19.3422 15.9606 19.2846C15.6363 19.227 15.3016 19.2669 15 19.4L12 12L19.4 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.6 9C8.73312 8.69843 8.77304 8.36368 8.71542 8.03941C8.6578 7.71514 8.50503 7.41649 8.27741 7.18239C8.04979 6.94829 7.75857 6.78954 7.44336 6.72715C7.12815 6.66477 6.80452 6.70198 6.514 6.834L6.4 6.884L8.884 4.4L10.834 2.514C10.702 2.80452 10.6648 3.12815 10.7271 3.44336C10.7895 3.75857 10.9483 4.04979 11.1824 4.27741C11.4165 4.50503 11.7151 4.6578 12.0394 4.71542C12.3637 4.77304 12.6984 4.73312 13 4.6L12 12L8.6 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.6 15C4.46688 15.3016 4.42696 15.6363 4.48458 15.9606C4.5422 16.2849 4.69497 16.5835 4.92259 16.8176C5.15021 17.0517 5.44143 17.2105 5.75664 17.2729C6.07185 17.3352 6.39548 17.298 6.686 17.166L6.8 17.116L4.316 19.6L2.366 21.486C2.234 21.1955 2.19677 20.8718 2.25915 20.5566C2.32154 20.2414 2.48029 19.9502 2.71439 19.7226C2.94849 19.495 3.24714 19.3422 3.57141 19.2846C3.89568 19.227 4.23043 19.2669 4.532 19.4L12 12L4.6 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 4.6C15.3016 4.73312 15.6363 4.77304 15.9606 4.71542C16.2849 4.6578 16.5835 4.50503 16.8176 4.27741C17.0517 4.04979 17.2105 3.75857 17.2729 3.44336C17.3352 3.12815 17.298 2.80452 17.166 2.514L19.6 4.884L21.486 6.834C21.1955 6.702 20.8718 6.66477 20.5566 6.72715C20.2414 6.78954 19.9502 6.94829 19.7226 7.18239C19.495 7.41649 19.3422 7.71514 19.2846 8.03941C19.227 8.36368 19.2669 8.69843 19.4 9L12 12L15 4.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Real-Time Operations</h3>
                <p>Monitor and coordinate field operations in real-time with live data feeds and interactive maps.</p>
                <div className="feature-hover-effect"></div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Advanced Analytics</h3>
                <p>AI-powered crime pattern recognition and predictive policing algorithms.</p>
                <div className="feature-hover-effect"></div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Secure Database</h3>
                <p>Military-grade encrypted database with multi-factor authentication and access controls.</p>
                <div className="feature-hover-effect"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PoliceFooter />
    </div>
  );
}