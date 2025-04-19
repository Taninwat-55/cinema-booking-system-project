import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';
import { SearchContext } from '../context/SearchContext';
import { WatchlistContext } from '../context/WatchlistContext';
import profileIcon from '/account_circle.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { watchlist } = useContext(WatchlistContext);
  const { searchTerm, setSearchTerm, setSearchResults, setHasSearched } =
    useContext(SearchContext);

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/movies?search=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();
      setSearchResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setIsMenuOpen(true);
    }
  }, [location.pathname, user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchTerm]);

  return (
    <header className="header-container">
      <div className={`navbar-container ${isMenuOpen ? 'flipped' : ''}`}>
        {/* FRONT SIDE */}
        <div className="navbar-front">
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

            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input with-icon"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (value.trim()) {
                    handleSearch(value);
                  } else {
                    setSearchResults([]);
                    setHasSearched(false);
                  }
                }}
              />
            </div>
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
                <li>
                  <Link to="/">Home</Link>
                </li>
              </>
            ) : (
              <li className="profile-dropdown">
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="avatar"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile/update"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Update Info
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Log Out</button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* BACK SIDE */}
        <div className="navbar-back">
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

            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input with-icon"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (value.trim()) {
                    handleSearch(value);
                  } else {
                    setSearchResults([]);
                    setHasSearched(false);
                  }
                }}
              />
            </div>
          </div>

          <ul className="menu-options">
            {user && (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/watchlist">Watchlist ({watchlist.length})</Link>
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
