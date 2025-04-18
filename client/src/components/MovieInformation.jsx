import React, { useState } from "react";
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
  const [showTrailer, setShowTrailer] = useState(false);
  const MovieClick = () => {
    setShowTrailer(true);
  };

  const WrapperStyle = (length) => {
    if (length >= 17) {
      return { justifyContent: "center", marginRight: "0" };
    }
    if (length >= 13) {
      return { justifyContent: "flex-end", marginRight: "5%" };
    }
    if (length >= 9) {
      return { justifyContent: "flex-end", marginRight: "3%" };
    }
    return { justifyContent: "flex-end", marginRight: "0" };
  };

  const TitleStyle = (length) => ({
    marginLeft: length <= 6 ? "3%" : "0",
  });

  const titleLength = movie.title.length;

  const getEmbedUrl = (url) => {
    if (url.includes("youtu.be")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
    }
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/").split("?")[0];
    }
    return url;
  };

  return (
    <div className="movie-information-container">
      <div className="movie-information-image-text-container">
        <div className="movie-information-wrapper-image">
          {showTrailer ? (
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(movie.trailer_url)}
              title={`${movie.title} Trailer`}
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={movie.poster_url}
              alt={movie.title}
              style={{ cursor: "pointer" }}
              onClick={MovieClick}
            />
          )}
        </div>

        <div className="movie-information-container-text">
          <div
            className={`movie-information-wrapper-text ${
              showTrailer ? "hidden-text" : ""
            }`}
          >
            <div className="movie-name-container">
              <div
                className="movie-name-wrapper"
                style={WrapperStyle(titleLength)}
              >
                <div className="movie-name-text">
                  <h1 style={TitleStyle(titleLength)}>{movie.title}</h1>
                </div>
              </div>
            </div>

            <div className="movie-rating-container">
              <div className="movie-rating-container-wrapper">
                <div className="imdb-box-container">
                  <div className="imdb-box">
                    <h3>imdb</h3>
                  </div>
                </div>
                <div className="rating-number-container">
                  <p>
                    {movie.imdb_rating ? movie.imdb_rating.toFixed(1) : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="movie-genre">
              <div className="movie-genre-wrapper">
                <p>
                  {movie.release_year} |{" "}
                  {movie.length_minutes ? `${movie.length_minutes} min` : "N/A"}{" "}
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
      </div>

      <div className="watch-list-container">
        {user &&
          (isInWatchlist ? (
            <button onClick={handleRemoveWatchlist}>
              Remove from Watchlist
            </button>
          ) : (
            <button onClick={handleAddWatchlist}>Add to Watchlist</button>
          ))}
      </div>

      <div className="showings-container">
        <h2>Showings</h2>
        {showings.length === 0 ? (
          <p>No showings available.</p>
        ) : (
          <ul className="showing-list-container">
            {showings.map((showing) => (
              <li className="showing-list" key={showing.showing_id}>
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
    </div>
  );
};

export default MovieInformation;

/*




import React, { useState } from "react";
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
  const [showTrailer, setShowTrailer] = useState(false);
  const MovieClick = () => {
    setShowTrailer(true);
  };

  const titleLength = movie.title.length;
  const isLongTitle = titleLength > 17;
  const isMediumSmallTitle = titleLength >= 10 && titleLength <= 12;
  const isMediumBigTitle = titleLength >= 13 && titleLength <= 16;
  const isShortTitle = titleLength < 10;
  const isVeryShortTitle = titleLength <= 6;

  const getEmbedUrl = (url) => {
    if (url.includes("youtu.be")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
    }
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/").split("?")[0];
    }
    return url;
  };

  return (
    <div className="movie-information-container">
      <div className="movie-information-image-text-container">
        <div className="movie-information-wrapper-image">
          {showTrailer ? (
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(movie.trailer_url)}
              title={`${movie.title} Trailer`}
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={movie.poster_url}
              alt={movie.title}
              style={{ cursor: "pointer" }}
              onClick={MovieClick}
            />
          )}
        </div>

        <div className="movie-information-container-text">
          <div
            className={`movie-information-wrapper-text ${
              showTrailer ? "hidden-text" : ""
            }`}
          >
            <div className="movie-name-container">
              <div
                className="movie-name-wrapper"
                style={{
                  justifyContent: isLongTitle ? "center" : "flex-end",
                  marginRight: isMediumSmallTitle
                    ? "3%"
                    : isMediumBigTitle
                    ? "5%"
                    : isShortTitle
                    ? "0"
                    : "0",
                }}
              >
                <div className="movie-name-text">
                  <h1
                    style={{
                      marginLeft: isVeryShortTitle ? "3%" : "0",
                    }}
                  >
                    {movie.title}
                  </h1>
                </div>
              </div>
            </div>

            <div className="movie-rating-container">
              <div className="movie-rating-container-wrapper">
                <div className="imdb-box-container">
                  <div className="imdb-box">
                    <h3>imdb</h3>
                  </div>
                </div>
                <div className="rating-number-container">
                  <p>
                    {movie.imdb_rating ? movie.imdb_rating.toFixed(1) : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="movie-genre">
              <div className="movie-genre-wrapper">
                <p>
                  {movie.release_year} |{" "}
                  {movie.length_minutes ? `${movie.length_minutes} min` : "N/A"}{" "}
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
      </div>

      <div className="watch-list-container">
        {user &&
          (isInWatchlist ? (
            <button onClick={handleRemoveWatchlist}>
              Remove from Watchlist
            </button>
          ) : (
            <button onClick={handleAddWatchlist}>Add to Watchlist</button>
          ))}
      </div>

      <div className="showings-container">
        <h2>Showings</h2>
        {showings.length === 0 ? (
          <p>No showings available.</p>
        ) : (
          <ul className="showing-list-container">
            {showings.map((showing) => (
              <li className="showing-list" key={showing.showing_id}>
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
    </div>
  );
};

export default MovieInformation;


 
 */
