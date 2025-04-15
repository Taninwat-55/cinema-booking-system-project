import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminMovieListPage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  const genres = [
    ...new Set(
      movies
        .filter((movie) => movie.genre)
        .flatMap((movie) => movie.genre.split(', '))
    ),
  ];

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGenre ? movie.genre.includes(selectedGenre) : true)
  );

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
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre, idx) => (
          <option key={idx} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <ul>
        {filteredMovies.map((movie) => (
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
