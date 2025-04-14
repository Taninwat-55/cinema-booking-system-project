import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminMovieListPage = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie?'
    );

    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:3001/api/admin/movies/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Movie deleted!');
      setMovies(movies.filter((movie) => movie.movie_id !== id));
    } else {
      alert('Failed to delete movie');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.movie_id} style={{ marginBottom: '1rem' }}>
            {movie.title}{' '}
            <button
              onClick={() => navigate(`/admin/edit-movie/${movie.movie_id}`)}
            >
              Edit
            </button>{' '}
            <button onClick={() => handleDelete(movie.movie_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMovieListPage;
