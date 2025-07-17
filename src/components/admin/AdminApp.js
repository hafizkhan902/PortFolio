import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import authService from '../../utils/authService';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      // Verify token by trying to get profile
      verifyAuthentication();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAuthentication = async () => {
    try {
      await authService.getProfile();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication verification failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-light dark:bg-primary-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminApp; 