import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminEditMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: '',
    description: '',
    poster_url: '',
    trailer_url: '',
  });

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3001/api/admin/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });

    if (res.ok) {
      alert('Movie updated successfully!');
      navigate('/admin/manage-movies');
    } else {
      alert('Failed to update movie');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Edit Movie</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={movie.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
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
          placeholder="Trailer URL"
          value={movie.trailer_url}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Update Movie</button>
      </form>
    </div>
  );
};

export default AdminEditMoviePage;
