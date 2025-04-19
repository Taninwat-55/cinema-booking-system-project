import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroMovies.css';
import { CiHeart } from 'react-icons/ci';
import { UserContext } from '../context/UserContext';
import { WatchlistContext } from '../context/WatchlistContext';

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
                  <div className="about-movie-information-landing-page-wrapper">
                    <p>
                      {movie.release_year} | {movie.length_minutes} min |{' '}
                      {movie.genre}
                    </p>
                  </div>
                </div>

                <div
                  className="add-to-list-container"
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
                          window.dispatchEvent(new Event('watchlistUpdated'));
                        }
                      })
                      .catch((err) => console.error(err));
                  }}
                >
                  <div className="add-to-list-wrapper">
                    <div className="add-to-list">
                      <div className="heart-icon-container">
                        <CiHeart
                          className="heart-icon"
                          style={{
                            color: watchlist.includes(movie.movie_id)
                              ? 'orange'
                              : 'gray',
                          }}
                        />
                      </div>
                      <div className="watch-list-container">
                        <h3>Watchlist</h3>
                      </div>
                    </div>
                  </div>
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

/*

import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HeroMovies.css";
import { CiHeart } from "react-icons/ci";
import { UserContext } from "../context/UserContext";

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
              style={{ textDecoration: "none", color: "inherit" }}
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
                      <span>{movie.imdb_rating || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="about-movie-information-landing-page">
                  <div className="about-movie-information-landing-page-wrapper">
                    <p>
                      {movie.release_year} | {movie.length_minutes} min |{" "}
                      {movie.genre}
                    </p>
                  </div>
                </div>

                <div
                  className="add-to-list-container"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!user) {
                      alert("You need to sign in to add to Watchlist");
                      return;
                    }

                    const isInWatchlist = watchlist.includes(movie.movie_id);
                    const method = isInWatchlist ? "DELETE" : "POST";

                    fetch("http://localhost:3001/api/watchlist", {
                      method,
                      headers: {
                        "Content-Type": "application/json",
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
                  <div className="add-to-list-wrapper">
                    <div className="add-to-list">
                      <div className="heart-icon-container">
                        <CiHeart
                          className="heart-icon"
                          style={{
                            color: watchlist.includes(movie.movie_id)
                              ? "orange"
                              : "gray",
                          }}
                        />
                      </div>
                      <div className="watch-list-container">
                        <h3>Watchlist</h3>
                      </div>
                    </div>
                  </div>
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

 
 */
