import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { WatchlistContext } from '../context/WatchlistContext';
import '../styles/MovieDetailPage2.css';
import Navbar from '../components/Navbar';

function MovieDetailPage2() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showings, setShowings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { user } = useContext(UserContext);
  const { fetchWatchlist } = useContext(WatchlistContext);

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    if (user) {
      fetch(`http://localhost:3001/api/users/${user.user_id}/watchlist`, {
        headers: { Authorization: `Bearer ${user.token}` },
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

  const getEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      // Case 1: youtu.be short link
      if (hostname === 'youtu.be') {
        const videoId = parsedUrl.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Case 2: youtube.com/watch?v=...
      if (hostname.includes('youtube.com') && parsedUrl.searchParams.has('v')) {
        const videoId = parsedUrl.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Fallback: Return null if not recognized
      return null;
    } catch (err) {
      console.error('Invalid trailer URL:', url);
      return null;
    }
  };
  
  const embedUrl = getEmbedUrl(movie?.trailer_url);

  const handleAddWatchlist = () => {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ user_id: user.user_id, movie_id: Number(id) }),
    }).then((res) => {
      if (res.ok) {
        setIsInWatchlist(true);
        fetchWatchlist();
        window.dispatchEvent(new Event('watchlistUpdated'));
      }
    });
  };

  const handleRemoveWatchlist = () => {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ user_id: user.user_id, movie_id: Number(id) }),
    }).then((res) => {
      if (res.ok) {
        setIsInWatchlist(false);
        fetchWatchlist();
        window.dispatchEvent(new Event('watchlistUpdated'));
      }
    });
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <>
      <Navbar />

      <div className="movie-page">
        <div className="movie-header">
          <div className="movie-poster">
            {embedUrl ? (
              <div className="trailer-overlay">
                <iframe
                  src={embedUrl}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="trailer-placeholder">
                <p>No trailer available.</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    movie.title + ' trailer'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Search on YouTube
                </a>
              </div>
            )}
          </div>
          {/* <div className="movie-poster">
            <div className="trailer-overlay">
              <iframe
                src={getEmbedUrl(movie.trailer_url)}
                title={`${movie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div> */}

          <div className="movie-details">
            <h2 className="movie-detail-title">{movie.title}</h2>
            <p className="movie-meta">
              {movie.release_year} | {movie.length_minutes} min | {movie.genre}
            </p>
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>

        {user && (
          <button
            className="watchlist-btn"
            onClick={isInWatchlist ? handleRemoveWatchlist : handleAddWatchlist}
          >
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        )}

        <div className="filter-container">
          <label htmlFor="showing-date" className="filter-label">
            Filter by Date:
          </label>
          <input
            type="date"
            id="showing-date"
            className="filter-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <button
              className="clear-filter-btn"
              onClick={() => setSelectedDate('')}
            >
              Clear
            </button>
          )}
        </div>

        <div className="showings-section">
          <h2 className="showings-title">Upcoming Showings</h2>
          {showings.length === 0 ? (
            <p className="no-showings">No showings available.</p>
          ) : (
            <ul className="showings-list">
              {showings.map((showing) => (
                <li key={showing.showing_id} className="showing-item">
                  <span className="showing-info">
                    {new Date(showing.showing_time).toLocaleDateString()} —{' '}
                    {new Date(showing.showing_time).toLocaleTimeString()} |
                    Theater {showing.theater_id}
                  </span>
                  <Link
                    to={`/book/${showing.showing_id}`}
                    className="book-ticket-btn"
                  >
                    Book Ticket
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
}

export default MovieDetailPage2;
