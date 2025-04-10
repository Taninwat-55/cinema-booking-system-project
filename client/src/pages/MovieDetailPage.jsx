import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showings, setShowings] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      });

    fetch(`http://localhost:3001/api/showings/movie/${id}`)
      .then((res) => res.json())
      .then((data) => setShowings(data));
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  console.log('Showings:', showings);

  return (
    <div>
      <h1>{movie.title}</h1>
      <img
        src={movie.poster_url}
        alt={movie.title}
        style={{ width: '200px' }}
      />
      <p>{movie.description}</p>
      <p>Release Year: {movie.release_year}</p>
      <p>Director: {movie.director}</p>
      <h2>Showings</h2>
      {showings.length === 0 ? (
        <p>No showings available.</p>
      ) : (
        <ul>
          {showings.map((showing) => (
            <li key={showing.showing_id}>
              Time: {new Date(showing.datetime).toLocaleString()} — Theater:{' '}
              {showing.theater}
              <br />
              <Link to={`/book/${showing.showing_id}`}>Book This Showing</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MovieDetailPage;
