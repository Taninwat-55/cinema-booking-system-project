import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/component_styles/MovieCard.css';
import '../styles/WatchlistButton.css';
import WatchlistButton from './WatchlistButton';

const MovieCard = ({ movie, watchlist, setWatchlist }) => {
  const isInWatchlist =
    Array.isArray(watchlist) && watchlist.includes(movie.movie_id);

  return (
    <div className="movie-card-container">
      <Link
        to={`/movies/${movie.movie_id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="movie-card">
          <img src={movie.poster_url} alt={movie.title} />
          <h2>{movie.title}</h2>

          <div className="movie-rating-container-landing-page">
            <div className="movie-rating-wrapper-landing-page">
              <div className="imdb-box-landing-page">
                <h3>IMDb</h3>
              </div>
              <div className="movie-rating-span-container">
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

          <WatchlistButton
            movieId={movie.movie_id}
            isInWatchlist={isInWatchlist}
            setWatchlist={setWatchlist}
          />
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
