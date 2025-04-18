import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import MovieInformation from '../components/MovieInformation';
import '../styles/MovieDetailPage.css';
import { WatchlistContext } from '../context/WatchlistContext';

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showings, setShowings] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const { user } = useContext(UserContext);
  const { fetchWatchlist } = useContext(WatchlistContext);

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    if (user) {
      fetch(`http://localhost:3001/api/users/${user.user_id}/watchlist`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const found = data.some((m) => m.movie_id === Number(id));
          setIsInWatchlist(found);
        });
    }
  }, [id, user]);

  useEffect(() => {
    const url = selectedDate
      ? `http://localhost:3001/api/showings/movie/${id}?date=${selectedDate}`
      : `http://localhost:3001/api/showings/movie/${id}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setShowings(data));
  }, [id, selectedDate]);

  // useEffect(() => {
  //   fetch(`http://localhost:3001/api/movies/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setMovie(data);
  //     });

  //   if (user) {
  //     fetch(`http://localhost:3001/api/users/${user.user_id}/watchlist`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const found = data.some((m) => m.movie_id === Number(id));
  //         setIsInWatchlist(found);
  //       });
  //   }

  //   fetch(`http://localhost:3001/api/showings/movie/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => setShowings(data));
  // }, [id, user]);

  if (!movie) return <p>Loading movie details...</p>;

  function handleAddWatchlist() {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user_id: user.user_id,
        movie_id: Number(id),
      }),
    }).then((res) => {
      if (res.ok) {
        setIsInWatchlist(true); // or false if removed
        fetchWatchlist(); // 🔄 auto-refresh
      }
    });
  }

  function handleRemoveWatchlist() {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user_id: user.user_id,
        movie_id: Number(id),
      }),
    }).then((res) => {
      if (res.ok) {
        setIsInWatchlist(true); // or false if removed
        fetchWatchlist(); // 🔄 auto-refresh
      }
    });
  }

  return (
    <div className="movie-details-container">
      <div
        className="date-filter"
        style={{ textAlign: 'center', marginBottom: '1rem' }}
      >
        <label htmlFor="showing-date">Filter by Date:</label>{' '}
        <input
          type="date"
          id="showing-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate('')}
            style={{ marginLeft: '1rem' }}
          >
            Clear
          </button>
        )}
      </div>

      <MovieInformation
        movie={movie}
        showings={showings}
        user={user}
        isInWatchlist={isInWatchlist}
        handleAddWatchlist={handleAddWatchlist}
        handleRemoveWatchlist={handleRemoveWatchlist}
      />
    </div>
  );
}

export default MovieDetailPage;

/*


import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showings, setShowings] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      });

    if (user) {
      fetch(`http://localhost:3001/api/users/${user.user_id}/watchlist`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const found = data.some((m) => m.movie_id === Number(id));
          setIsInWatchlist(found);
        });
    }

    fetch(`http://localhost:3001/api/showings/movie/${id}`)
      .then((res) => res.json())
      .then((data) => setShowings(data));
  }, [id, user]);

  if (!movie) return <p>Loading movie details...</p>;

  function handleAddWatchlist() {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user_id: user.user_id,
        movie_id: Number(id),
      }),
    }).then((res) => {
      if (res.ok) setIsInWatchlist(true);
    });
  }

  function handleRemoveWatchlist() {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user_id: user.user_id,
        movie_id: Number(id),
      }),
    }).then((res) => {
      if (res.ok) setIsInWatchlist(false);
    });
  }

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
              Time: {new Date(showing.showing_time).toLocaleString()} — Theater:{' '}
              {showing.theater_id}
              <br />
              <Link to={`/book/${showing.showing_id}`}>Book This Showing</Link>
            </li>
          ))}
        </ul>
      )}

      {user &&
        (isInWatchlist ? (
          <button onClick={handleRemoveWatchlist}>Remove from Watchlist</button>
        ) : (
          <button onClick={handleAddWatchlist}>Add to Watchlist</button>
        ))}
    </div>
  );
}

export default MovieDetailPage;

 
 */
