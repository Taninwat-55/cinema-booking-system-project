import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/component_styles/Slider.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function HeroSection() {
  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${BASE_URL}/api/movies`)
      .then((res) => res.json())
      .then((data) => setMovies(data.slice(0, 5)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!movies.length) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1 >= movies.length ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[activeIndex];
  const hours = movie.length_minutes ? Math.floor(movie.length_minutes / 60) : 0;
  const mins = movie.length_minutes ? movie.length_minutes % 60 : 0;
  const runtime = movie.length_minutes ? `${hours}h ${mins}m` : '';
  const firstGenre = movie.genre?.split(',')[0].trim() || '';

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${movie.poster_url})` }}
    >
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-meta">
          <span className="hero-badge">NOW SHOWING</span>
          <span className="hero-info">
            {runtime && `${runtime}`}
            {firstGenre && ` • ${firstGenre}`}
            {movie.imdb_rating && ` • ★ ${Number(movie.imdb_rating).toFixed(1)}`}
          </span>
        </div>
        <h1 className="hero-title">{movie.title}</h1>
        {movie.description && (
          <p className="hero-description">{movie.description}</p>
        )}
        <div className="hero-buttons">
          {movie.trailer_url && (
            <a
              href={movie.trailer_url}
              target="_blank"
              rel="noreferrer"
              className="btn-hero btn-trailer"
            >
              ▶ Watch Trailer
            </a>
          )}
          <Link to={`/movies/${movie.movie_id}`} className="btn-hero btn-book">
            &#9635; Book Tickets
          </Link>
        </div>
      </div>

      <div className="hero-dots">
        {movies.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
