import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { WatchlistContext } from '../context/WatchlistContext';
import '../styles/component_styles/Navbar.css';
import profileIcon from '/account_circle.svg';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const { watchlist } = useContext(WatchlistContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
  };

  return (
    <header className="nav-header">
      <nav className="nav-bar">
        <Link to="/" className="nav-logo">
          <img src="/Logo-final.png" alt="Logo" className="nav-logo-img" />
        </Link>

        <ul className="nav-links">
          <li><Link to="/showtimes">Movies</Link></li>
          <li><Link to="/track-booking">Track Booking</Link></li>
          {user && <li><Link to="/my-bookings">My Bookings</Link></li>}
        </ul>

        <div className="nav-actions">
          {!user ? (
            <Link to="/login" className="nav-signin-btn">
              <img src={profileIcon} alt="" className="nav-icon" />
              Sign In
            </Link>
          ) : (
            <div className="nav-profile" ref={dropdownRef}>
              <button
                className="nav-avatar-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img src={profileIcon} alt="Profile" className="nav-avatar" />
              </button>

              {isDropdownOpen && (
                <ul className="nav-dropdown">
                  <li>
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile/update" onClick={() => setIsDropdownOpen(false)}>
                      Update Info
                    </Link>
                  </li>
                  <li>
                    <Link to="/watchlist" onClick={() => setIsDropdownOpen(false)}>
                      Watchlist ({watchlist.length})
                    </Link>
                  </li>
                  <li>
                    <Link to="/booking-history" onClick={() => setIsDropdownOpen(false)}>
                      Booking History
                    </Link>
                  </li>
                  {user.is_admin === 1 && (
                    <li>
                      <Link to="/admin/dashboard" onClick={() => setIsDropdownOpen(false)}>
                        Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="nav-logout-btn">
                      Log Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
