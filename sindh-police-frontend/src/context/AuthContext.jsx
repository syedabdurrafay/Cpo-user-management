import { createContext, useState, useContext, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (token, userData) => {
    localStorage.setItem('police_token', token);
    localStorage.setItem('police_user', JSON.stringify(userData));
    setUser(userData);
    
    try {
      await API.post('/api/activities', {
        action: 'User logged in',
        entityType: 'User',
        entityId: userData.id,
        details: {
          loginTime: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error logging login activity:', error);
    }
    
    setLoading(false);
  };

  const logout = async () => {
    try {
      await API.post('/api/activities', {
        action: 'User logged out',
        entityType: 'User',
        entityId: user?.id,
        details: {
          logoutTime: new Date().toISOString(),
          sessionDuration: Date.now() - (new Date(user.lastLogin)).getTime()
        }
      });
    } catch (error) {
      console.error('Error logging logout activity:', error);
    }

    localStorage.removeItem('police_token');
    localStorage.removeItem('police_user');
    setUser(null);
    setLoading(false);
  };

  const initializeAuth = async () => {
    const storedUser = localStorage.getItem('police_user');
    const token = localStorage.getItem('police_token');
    
    if (storedUser && token) {
      try {
        // Verify token is still valid
        const response = await API.get('/api/users/me');
        setUser(response.data.user);
        
        // Update last activity
        await API.post('/api/activities', {
          action: 'Session resumed',
          entityType: 'User',
          entityId: response.data.user.id,
          details: {
            resumedAt: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Session validation failed:', error);
        localStorage.removeItem('police_token');
        localStorage.removeItem('police_user');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};