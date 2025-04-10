import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <div>
      <h1>All Movies</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map((movie) => (
          <div
            key={movie.movie_id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '200px',
            }}
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              style={{ width: '100%' }}
            />
            <h3>{movie.title}</h3>
            <p>{movie.release_year}</p>
            <Link to={`/movies/${movie.movie_id}`}>See Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
