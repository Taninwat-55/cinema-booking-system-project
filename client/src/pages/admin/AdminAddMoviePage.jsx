import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddMoviePage = () => {
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: '',
    description: '',
    poster_url: '',
    trailer_url: '',
  });

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(movie);
    const res = await fetch('http://localhost:3001/api/admin/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
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
          value={movie.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Movie Description"
          value={movie.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="poster_url"
          placeholder="Poster URL"
          value={movie.poster_url}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="trailer_url"
          placeholder="Trailer URL (optional)"
          value={movie.trailer_url}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AdminAddMoviePage;
