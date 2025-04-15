import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddMoviePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/admin/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, trailer_url: trailerUrl }),
    });

    if (res.ok) {
      alert('Movie added successfully!');
      navigate('/admin/dashboard');
    } else {
      alert('Failed to add movie');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Movie</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          name="trailer_url"
          placeholder="Trailer URL (optional)"
          value={trailerUrl}
          onChange={(e) => setTrailerUrl(e.target.value)}
        />
        <br />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AdminAddMoviePage;
