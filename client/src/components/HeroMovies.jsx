import MovieCard from './MovieCard';
import '../styles/component_styles/HeroMovies.css';

const HeroMovies = ({ movies, comingSoon = false }) => {
  if (!movies || movies.length === 0) {
    return <p className="no-movies-message">No movies found</p>;
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.movie_id}
          movie={movie}
          comingSoon={comingSoon}
        />
      ))}
    </div>
  );
};

export default HeroMovies;
