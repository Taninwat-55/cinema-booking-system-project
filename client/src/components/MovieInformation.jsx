import React from "react";
import { Link } from "react-router-dom";
import "../styles/MovieInformation.css";

const MovieInformation = ({
  movie,
  showings,
  user,
  isInWatchlist,
  handleAddWatchlist,
  handleRemoveWatchlist,
}) => {
  return (
    <div className="movie-information-container">
      <div className="movie-information-wrapper-image">
        <img src={movie.poster_url} alt={movie.title} />
      </div>

      <div className="movie-information-container-text">
        <div className="movie-information-wrapper-text">
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
                  <p>{movie.rating ? movie.rating : "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="movie-genre">
            <div className="movie-genre-wrapper">
              <p>
                {movie.release_year} | {movie.duration ? movie.duration : "N/A"}{" "}
                | {movie.genre ? movie.genre : "N/A"}
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

      <div>
        <h2>Showings</h2>
        {showings.length === 0 ? (
          <p>No showings available.</p>
        ) : (
          <ul>
            {showings.map((showing) => (
              <li key={showing.showing_id}>
                Time: {new Date(showing.showing_time).toLocaleString()} —
                Theater: {showing.theater_id}
                <br />
                <Link to={`/book/${showing.showing_id}`}>
                  Book This Showing
                </Link>
              </li>
            ))}
          </ul>
        )}
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
