import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, getUserInfo } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userInfo = getUserInfo();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          EventFinder
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className="nav-link"
            style={{ 
              background: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent' 
            }}
          >
            All Events
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/my-bookings" 
                className="nav-link"
                style={{ 
                  background: location.pathname === '/my-bookings' ? 'rgba(255,255,255,0.2)' : 'transparent' 
                }}
              >
                📖 My Bookings
              </Link>
              
              <span className="user-welcome">
                Hello, {userInfo.fullName}!
              </span>
              
              <button 
                onClick={handleLogout}
                className="nav-button"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="nav-link"
                style={{ 
                  background: location.pathname === '/login' ? 'rgba(255,255,255,0.2)' : 'transparent' 
                }}
              >
                🔑 Login
              </Link>
              
              <Link 
                to="/register" 
                className="nav-button"
              >
                📝 Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
