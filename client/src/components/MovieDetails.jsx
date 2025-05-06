import { Link } from 'react-router-dom';

const MovieDetail = ({
  movie,
  embedUrl,
  isInWatchlist,
  user,
  handleAddWatchlist,
  handleRemoveWatchlist,
  selectedDate,
  setSelectedDate,
  showings,
}) => {
  return (
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
          <ul className="showings-list-2">
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
  );
};

export default MovieDetail;
