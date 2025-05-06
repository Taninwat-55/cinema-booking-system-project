import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import '../../styles/admin_styles/AdminMovieListPage.css';

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
      toast.success('Movie deleted!');
      setMovies(movies.filter((movie) => movie.movie_id !== id));
    } else {
      toast.error('Failed to delete movie');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h1>Manage Movies</h1>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        id="genre-select-admin-movies"
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

      <ul className="movie-list">
        {filteredMovies.map((movie) => (
          <li key={movie.movie_id} className="movie-card">
            {movie.poster_url && (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="movie-poster"
              />
            )}
            <h3 className="movie-title">{movie.title}</h3>
            <h4>
              {parseInt(movie.length_minutes, 10)} min | {movie.genre}
            </h4>
            <div className="movie-buttons">
              <button
                onClick={() => navigate(`/admin/edit-movie/${movie.movie_id}`)}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(movie.movie_id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </div>
  );
};

export default AdminMovieListPage;
