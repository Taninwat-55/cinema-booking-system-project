import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
  
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
  
      console.log('Search results:', data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
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
          <div className="menu-icon" onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
          </div>

          <ul className="menu-options">
            {!user ? (
              <>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
                <li><Link to="/">Home</Link></li>
              </>
            ) : (
              <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
            )}
          </ul>
        </div>

        {/* BACK SIDE */}
        <div className="navbar-back">
          <div className="left-section">
            <div className="menu-icon" onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}>
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
            </div>

            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>🔍</button>
            </div>
          </div>

          <ul className="menu-options">
            {user && (
              <>
                <li><Link to="/watchlist">Watchlist</Link></li>
                <li><Link to="/my-bookings">My Bookings</Link></li>
                <li><Link to="/booking-history">Booking History</Link></li>
                <li><Link to="/">Home</Link></li>
                {user.is_admin === 1 && (
                  <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
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
