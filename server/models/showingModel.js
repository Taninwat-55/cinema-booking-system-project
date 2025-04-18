const db = require('../db/database');

function createShowing(
  movie_id,
  theater_id,
  showing_time,
  price_adult,
  price_child,
  price_senior
) {
  return db
    .prepare(
      `
      INSERT INTO showings (movie_id, theater_id, showing_time, price_adult, price_child, price_senior)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    )
    .run(
      movie_id,
      theater_id,
      showing_time,
      price_adult,
      price_child,
      price_senior
    );
}

function getShowingsByMovieId(movieId) {
  return db
    .prepare(
      `
      SELECT showing_id, showing_time, theater_id
      FROM showings
      WHERE movie_id = ?
      ORDER BY showing_time
    `
    )
    .all(movieId);
}

function getShowingsByMovieIdAndDate(movieId, date) {
  return db
    .prepare(
      `
      SELECT showing_id, showing_time, theater_id
      FROM showings
      WHERE movie_id = ?
      AND DATE(showing_time) = ?
      ORDER BY showing_time
    `
    )
    .all(movieId, date);
}

function getShowingById(showingId) {
  return db
    .prepare(
      `
      SELECT showings.*, movies.title
      FROM showings
      JOIN movies ON movies.movie_id = showings.movie_id
      WHERE showing_id = ?
    `
    )
    .get(showingId);
}

module.exports = {
  createShowing,
  getShowingsByMovieId,
  getShowingsByMovieIdAndDate,
  getShowingById,
};
