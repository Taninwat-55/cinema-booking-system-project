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
      SELECT s.showing_id, s.showing_time, s.theater_id, m.poster_url, m.title
      FROM showings s
      JOIN movies m ON s.movie_id = m.movie_id
      WHERE s.movie_id = ? AND DATE(s.showing_time) = ?
      ORDER BY s.showing_time
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

function getAllShowings() {
  return db
    .prepare(
      `
      SELECT s.*, m.title, m.poster_url
      FROM showings s
      JOIN movies m ON s.movie_id = m.movie_id
      ORDER BY s.showing_time ASC
    `
    )
    .all();
}

function updateShowing(
  showingId,
  movieId,
  theaterId,
  showingTime,
  priceAdult,
  priceChild,
  priceSenior
) {
  return db
    .prepare(
      `
      UPDATE showings
      SET movie_id = ?, theater_id = ?, showing_time = ?, 
          price_adult = ?, price_child = ?, price_senior = ?
      WHERE showing_id = ?
    `
    )
    .run(
      movieId,
      theaterId,
      showingTime,
      priceAdult,
      priceChild,
      priceSenior,
      showingId
    );
}

function deleteShowing(showingId) {
  return db.prepare('DELETE FROM showings WHERE showing_id = ?').run(showingId);
}

function getAllShowingsByDate(date) {
  return db
    .prepare(
      `
      SELECT s.*, m.title, m.poster_url
      FROM showings s
      JOIN movies m ON s.movie_id = m.movie_id
      WHERE DATE(s.showing_time) = ?
      ORDER BY s.showing_time ASC
    `
    )
    .all(date);
}

module.exports = {
  createShowing,
  getShowingsByMovieId,
  getShowingsByMovieIdAndDate,
  getShowingById,
  updateShowing,
  deleteShowing,
  getAllShowings,
  getAllShowingsByDate,
};
