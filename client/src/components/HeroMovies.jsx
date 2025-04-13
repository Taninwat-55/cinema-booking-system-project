import React from "react";
import "../styles/HeroMovies.css";
import { CiHeart } from "react-icons/ci";

const HeroMovies = ({ movies }) => {
  return (
    <main className="hero-movies-section-container">
      <div className="movies-container">
        <div className="movies-wrapper">
          {movies.map((movie) => (
            <div className="movie-card-container" key={movie.imdb_id}>
              <div className="movie-card">
                <div className="movie-card-image-container">
                  <img src={movie.poster_url} alt={movie.title} />
                </div>
                <div className="movie-name-container-landing-page">
                  <div className="movie-name-wrapper-landing-page">
                    <h2>{movie.title}</h2>
                  </div>
                </div>
                <div className="movie-rating-container-landing-page">
                  <div className="movie-rating-wrapper-landing-page">
                    <div className="imdb-box-container-landing-page">
                      <div className="imdb-box-landing-page">
                        <h3>imdb</h3>
                      </div>
                    </div>
                    <div className="rating-number-container-landing-page">
                      <p>{movie.imdbRating || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="movie-information-container-landing-page">
                  <div className="movie-information-wrapper-landing-page">
                    <p>
                      {movie.release_year} | {movie.length_minutes} min |{" "}
                      {movie.genre}
                    </p>
                  </div>
                </div>
                <div className="add-to-list-container">
                  <div className="add-to-list-wrapper">
                    <div className="add-to-list">
                      <div className="heart-icon-container">
                        <CiHeart className="heart-icon" />
                      </div>
                      <div className="watch-list-container">
                        <h3>Watchlist</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {movies.length === 0 && (
            <p className="no-movies-message">No movies found</p>
          )}
        </div>
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
