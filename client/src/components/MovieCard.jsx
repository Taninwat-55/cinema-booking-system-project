import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import { UserContext } from '../context/UserContext';
import '../styles/MovieCard.css';
import '../styles/WatchlistButton.css';

const MovieCard = ({ movie, watchlist, setWatchlist }) => {
  const { user } = useContext(UserContext);

  const isInWatchlist =
    Array.isArray(watchlist) && watchlist.includes(movie.movie_id);

  const handleWatchlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('You need to sign in to add to Watchlist');
      return;
    }

    const method = isInWatchlist ? 'DELETE' : 'POST';

    try {
      const res = await fetch('http://localhost:3001/api/watchlist', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          user_id: user.user_id,
          movie_id: movie.movie_id,
        }),
      });

      if (res.ok) {
        setWatchlist((prev) =>
          isInWatchlist
            ? prev.filter((id) => id !== movie.movie_id)
            : [...prev, movie.movie_id]
        );
        window.dispatchEvent(new Event('watchlistUpdated'));
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  return (
    <div className='movie-card-container'>
      <Link
        to={`/movies/${movie.movie_id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className='movie-card'>
          <img src={movie.poster_url} alt={movie.title} />
          <h2>{movie.title}</h2>

          <div className='movie-rating-container-landing-page'>
            <div className='movie-rating-wrapper-landing-page'>
              <div className='imdb-box-landing-page'>
                <h3>IMDb</h3>
              </div>
              <div className='movie-rating-span-container'>
                {movie.imdb_rating
                  ? Number(movie.imdb_rating).toFixed(1)
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="about-movie-information-landing-page">
            <p>
              {movie.release_year} | {parseInt(movie.length_minutes, 10)} min |{' '}
              {movie.genre || 'Genre Unknown'}
            </p>
          </div>

          <div
            className='add-to-list-container'
            onClick={handleWatchlistToggle}
          >
            <button
              className={`watchlist-button ${isInWatchlist ? 'active' : ''}`}
            >
              <CiHeart className='heart-icon' />
              <span>Watchlist</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
