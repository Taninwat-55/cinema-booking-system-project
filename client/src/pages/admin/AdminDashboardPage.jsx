import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
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
