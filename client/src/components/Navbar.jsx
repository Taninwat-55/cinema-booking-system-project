import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Automatically open menu on route change if user is logged in
  useEffect(() => {
    if (user) {
      setIsMenuOpen(true);
    }
  }, [location.pathname, user]);

  return (
    <header className="header-container">
      <div className={`navbar-container ${isMenuOpen ? 'flipped' : ''}`}>
        {/* FRONT SIDE */}
        <div className="navbar-front">
          <div
            className="menu-icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
          </div>

          <ul className="menu-options">
            {!user ? (
              <>
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
                <li>
                  <Link to="/register">Sign Up</Link>
                </li>
              </>
            ) : (
              <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </li>
            )}
          </ul>
        </div>

        {/* BACK SIDE */}
        <div className="navbar-back">
          <div
            className="menu-icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
          </div>

          <ul className="menu-options">
            {user && (
              <>
                <li>
                  <Link to="/watchlist">Watchlist</Link>
                </li>
                <li>
                  <Link to="/my-bookings">My Bookings</Link>
                </li>
                <li>
                  <Link to="/booking-history">Booking History</Link>
                </li>
                {user.is_admin === 1 && (
                  <li>
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

