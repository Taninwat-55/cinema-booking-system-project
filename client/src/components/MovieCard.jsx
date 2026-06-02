import { Link } from 'react-router-dom';
import '../styles/component_styles/MovieCard.css';

const GENRE_GRADIENTS = {
  'Sci-Fi Action': 'radial-gradient(ellipse at 35% 35%, #7A1A1A 0%, #2D0808 55%, #0A0202 100%)',
  'Crime':         'radial-gradient(ellipse at 35% 35%, #4A4030 0%, #1E1A10 55%, #080705 100%)',
  'Romance':       'radial-gradient(ellipse at 35% 35%, #8B1560 0%, #3D0828 55%, #0D0210 100%)',
  'Sci-Fi':        'radial-gradient(ellipse at 35% 35%, #1A1A8B 0%, #080838 55%, #020210 100%)',
  'Horror':        'radial-gradient(ellipse at 35% 35%, #3D0808 0%, #150202 55%, #050000 100%)',
  'Drama':         'radial-gradient(ellipse at 35% 35%, #1A5045 0%, #082820 55%, #020D0A 100%)',
  'Thriller':      'radial-gradient(ellipse at 35% 35%, #2D1A45 0%, #130A20 55%, #050008 100%)',
  'Adventure':     'radial-gradient(ellipse at 35% 35%, #4A3010 0%, #1E1408 55%, #080500 100%)',
  'Mystery':       'radial-gradient(ellipse at 35% 35%, #1A304D 0%, #0A1825 55%, #020508 100%)',
  'Action':        'radial-gradient(ellipse at 35% 35%, #5C1A1A 0%, #280A0A 55%, #080000 100%)',
  'Comedy':        'radial-gradient(ellipse at 35% 35%, #4D4A10 0%, #222008 55%, #080800 100%)',
};

const DEFAULT_GRADIENT = 'radial-gradient(ellipse at 35% 35%, #2D2D2D 0%, #111 55%, #050505 100%)';

const getGradient = (genre) => {
  if (!genre) return DEFAULT_GRADIENT;
  const first = genre.split(',')[0].trim();
  return GENRE_GRADIENTS[first] || DEFAULT_GRADIENT;
};

const MovieCard = ({ movie, comingSoon = false }) => {
  const firstGenre = movie.genre?.split(',')[0].trim() || '';
  const runtime = movie.length_minutes ? `${movie.length_minutes}m` : '';

  return (
    <Link to={`/movies/${movie.movie_id}`} className="movie-card-link">
      <div className="movie-card-new">
        <div
          className="movie-card-poster"
          style={
            movie.poster_url
              ? {
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%), url(${movie.poster_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : { background: getGradient(movie.genre) }
          }
        >
          {comingSoon ? (
            <span className="card-badge-coming">COMING SOON</span>
          ) : (
            <span className="card-genre-label">{firstGenre.toUpperCase()}</span>
          )}

          {!comingSoon && movie.imdb_rating && (
            <span className="card-rating">
              ★ {Number(movie.imdb_rating).toFixed(1)}
            </span>
          )}

          <div className="card-title-block">
            <h3 className="card-title">{movie.title}</h3>
            <div className="card-title-line" />
          </div>
        </div>

        <div className="card-meta">
          <span className="card-meta-title">{movie.title}</span>
          <span className="card-meta-info">
            {firstGenre}
            {runtime && ` • ${runtime}`}
            {movie.release_year && ` • ${movie.release_year}`}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
