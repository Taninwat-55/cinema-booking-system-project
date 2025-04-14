import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroMovies.css';
import { CiHeart } from 'react-icons/ci';
import { UserContext } from '../context/UserContext';

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
        {movies.map((movie) => (
          <div className="movie-card-container" key={movie.imdb_id}>
            <Link
              to={`/movies/${movie.movie_id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="movie-card">
                <img src={movie.poster_url} alt={movie.title} />
                <h2>{movie.title}</h2>
                <div className="movie-rating-container-landing-page">
                  <div className="imdb-box-landing-page">
                    <h3>imdb</h3>
                  </div>
                  <p>{movie.imdb_rating || 'N/A'}</p>
                </div>
                <p>
                  {movie.release_year} | {movie.length_minutes} min |{' '}
                  {movie.genre}
                </p>
                <div
                  className="add-to-list"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!user) {
                      alert('You need to sign in to add to Watchlist');
                      return;
                    }

                    const isInWatchlist = watchlist.includes(movie.movie_id);
                    const method = isInWatchlist ? 'DELETE' : 'POST';

                    fetch('http://localhost:3001/api/watchlist', {
                      method,
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                      },
                      body: JSON.stringify({
                        user_id: user.user_id,
                        movie_id: movie.movie_id,
                      }),
                    })
                      .then((res) => {
                        if (res.ok) {
                          if (isInWatchlist) {
                            setWatchlist((prev) =>
                              prev.filter((id) => id !== movie.movie_id)
                            );
                          } else {
                            setWatchlist((prev) => [...prev, movie.movie_id]);
                          }
                        }
                      })
                      .catch((err) => console.error(err));
                  }}
                >
                  <CiHeart
                    className="heart-icon"
                    style={{
                      color: watchlist.includes(movie.movie_id)
                        ? 'orange'
                        : 'gray',
                    }}
                  />
                  <h3>Watchlist</h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {movies.length === 0 && (
          <p className="no-movies-message">No movies found</p>
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
