import React, { useState, useEffect } from 'react';
import Simulador from './pages/Simulador';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.hash === '#admin',
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    if (isAdminRoute) {
      if (isLoggedIn) {
        return <AdminDashboard onLogout={handleLogout} />;
      } else {
        return <LoginPage onLoginSuccess={handleLogin} />;
      }
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Simulador />
        </div>
      );
    }
  };

  return <>{renderContent()}</>;
}

export default App;
