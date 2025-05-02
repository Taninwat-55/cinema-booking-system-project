import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MovieInformation.css';

const MovieInformation = ({
  movie,
  // showings,
  user,
  isInWatchlist,
  handleAddWatchlist,
  handleRemoveWatchlist,
}) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const MovieClick = () => {
    setShowTrailer(true);
  };

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

  return (
    <div className="movie-information-container">
      <div className="movie-information-wrapper-image">
        {showTrailer ? (
          <iframe
            width="100%"
            height="100%"
            src={getEmbedUrl(movie.trailer_url)}
            title={`${movie.title} Trailer`}
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            src={movie.poster_url}
            alt={movie.title}
            style={{ cursor: 'pointer' }}
            onClick={MovieClick}
          />
        )}
      </div>

      <div className="movie-information-container-text">
        <div
          className={`movie-information-wrapper-text ${
            showTrailer ? 'hidden-text' : ''
          }`}
        >
          <div className="movie-name-container">
            <div className="movie-name-wrapper">
              <div className="movie-name-text">
                <h1>{movie.title}</h1>
              </div>

              <div className="movie-rating-container">
                <div className="imdb-box-container">
                  <div className="imdb-box">
                    <h3>imdb</h3>
                  </div>
                </div>
                <div className="rating-number-container">
                  <p>
                    {movie.imdb_rating ? movie.imdb_rating.toFixed(1) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="movie-genre">
            <div className="movie-genre-wrapper">
              <p>
                {movie.release_year} |{' '}
                {movie.length_minutes ? `${movie.length_minutes} min` : 'N/A'} |{' '}
                {movie.genre ? movie.genre : 'N/A'}
              </p>
            </div>
          </div>

          <div className="story-line-header-container">
            <div className="story-line-header-wrapper">
              <h2>Storyline</h2>
            </div>
          </div>

          <div className="story-line-text-container">
            <div className="story-line-text-wrapper">
              <p>{movie.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="buy-ticket-button-container">
        <div className="buy-ticket-button-wrapper">
          <button>Buy Tickets</button>
        </div>
      </div>

      {user &&
        (isInWatchlist ? (
          <button onClick={handleRemoveWatchlist}>Remove from Watchlist</button>
        ) : (
          <button onClick={handleAddWatchlist}>Add to Watchlist</button>
        ))}
    </div>
  );
};

export default MovieInformation;