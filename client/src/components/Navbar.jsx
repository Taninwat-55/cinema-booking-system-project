import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/component_styles/Navbar.css';
import { WatchlistContext } from '../context/WatchlistContext';
import profileIcon from '/account_circle.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { watchlist } = useContext(WatchlistContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

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
          <div className="navbar-row">
            {/* Left */}
            <div className="left-section">
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
            </div>

            {/* Center Logo */}
            <div className="center-logo">
              <Link to="/" className="logo-container-one">
                <img
                  src="/Logo-final.png"
                  alt="Logo"
                  className="PawnStorm-logo"
                />
              </Link>
            </div>

            {/* Right Menu */}
            <div className="right-section">
              <ul className="menu-options">
                {!user ? (
                  <>
                    <li>
                      <Link to="/showtimes">Showtimes</Link>
                    </li>
                    <li>
                      <Link to="/track-booking">Track Booking</Link>
                    </li>
                    <li>
                      <Link to="/login">Sign In</Link>
                    </li>
                    <li>
                      <Link to="/register">Sign Up</Link>
                    </li>
                  </>
                ) : (
                  <li
                    className={`profile-dropdown fixed-action-btn spin-close ${
                      isDropdownOpen ? 'active' : ''
                    }`}
                  >
                    <button
                      className="btn-large"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <i>
                        <img
                          src={profileIcon}
                          alt="Profile"
                          className="avatar"
                        />
                      </i>
                    </button>
                    {isDropdownOpen && (
                      <ul
                        className={`dropdown-menu ${
                          isDropdownOpen ? 'show' : ''
                        }`}
                      >
                        <li className="dropdown-item item-profile">
                          <Link
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            View Profile
                          </Link>
                        </li>
                        <li className="dropdown-item item-update">
                          <Link
                            to="/profile/update"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Update Info
                          </Link>
                        </li>
                        <li className="dropdown-item item-logout">
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsDropdownOpen(false);
                            }}
                          >
                            Log Out
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="navbar-back">
          <div className="navbar-row">
            <div className="left-section">
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
            </div>

            <div className="center-logo">
              <Link to="/" className="logo-container-one">
                <img
                  src="/Logo-final.png"
                  alt="Logo"
                  className="PawnStorm-logo"
                />
              </Link>
            </div>

            <div className="right-section">
              <ul className="menu-options">
                {user && (
                  <>
                    <li>
                      <Link to="/showtimes">Showtimes</Link>
                    </li>
                    <li>
                      <Link to="/watchlist">
                        Watchlist ({watchlist.length})
                      </Link>
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
