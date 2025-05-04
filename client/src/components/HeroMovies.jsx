import React, { useContext, useEffect, useState } from 'react';
import '../styles/HeroMovies.css';
import { UserContext } from '../context/UserContext';
import MovieCard from '../components/MovieCard';

const HeroMovies = ({ movies }) => {
  const { user } = useContext(UserContext);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/users/${user.user_id}/watchlist`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setWatchlist(data.map((movie) => movie.movie_id)))
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <main className="hero-movies-section-container">
      <div className="movies-container">
        {movies.length === 0 ? (
          <p className="no-movies-message">No movies found</p>
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.movie_id}
              movie={movie}
              watchlist={watchlist}
              setWatchlist={setWatchlist}
              showDetails
              showHeartIcon
            />
          ))
        )}
      </div>

      <div className="circle-one-container">
        <div className="circle-one"></div>
      </div>
      <div className="circle-two-container">
        <div className="circle-two"></div>
      </div>
    </main>
  );
};

export default HeroMovies;