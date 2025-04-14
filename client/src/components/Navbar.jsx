import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

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
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
