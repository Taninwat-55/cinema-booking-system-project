import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../../styles/AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    fetch('http://localhost:3001/api/admin/dashboard/stats', {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to fetch dashboard stats:', err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <div className="dashboard-stats">
          <h3 className="stats-title">Dashboard Stats</h3>
          <p className="stat-item">Total Movies: {stats.total_movies}</p>
          <p className="stat-item">Total Showings: {stats.total_showings}</p>
          <p className="stat-item">Total Bookings: {stats.total_bookings}</p>
          <p className="stat-item">Most Popular Movie: {stats.popular_movie}</p>
        </div>

        <div className="dashboard-links">
          <ul className="links-list">
          <h3 className="links-title">Quick Links</h3>
            <li className="link-item">
              <Link to="/admin/bookings" className="dashboard-link">View All Bookings</Link>
            </li>
            <li className="link-item">
              <Link to="/admin/add-movie" className="dashboard-link">Add New Movie</Link>
            </li>
            <li className="link-item">
              <Link to="/admin/add-showing" className="dashboard-link"> Add New Showing</Link>
            </li>
            <li className="link-item">
              <Link to="/admin/manage-movies" className="dashboard-link">Manage Movies</Link>
            </li>
            <li className="link-item">
              <Link to="/admin/manage-showings" className="dashboard-link">Manage Showings</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
};

export default AdminDashboardPage;
