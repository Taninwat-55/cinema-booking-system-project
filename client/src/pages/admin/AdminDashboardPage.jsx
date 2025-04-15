import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      <h3>Dashboard Stats</h3>
      <p>Total Movies: {stats.total_movies}</p>
      <p>Total Showings: {stats.total_showings}</p>
      <p>Total Bookings: {stats.total_bookings}</p>
      <p>Most Popular Movie: {stats.popular_movie}</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1rem' }}>
          <Link to="/admin/add-movie">➕ Add New Movie</Link>
        </li>
        <li>
          <Link to="/admin/add-showing">🎬 Add New Showing</Link>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <Link to="/admin/manage-movies">🛠 Manage Movies</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboardPage;
