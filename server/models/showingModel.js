const pool = require('../db/database');

async function createShowing(movie_id, theater_id, showing_time, price_adult, price_child, price_senior) {
  return pool.query(
    `INSERT INTO showings (movie_id, theater_id, showing_time, price_adult, price_child, price_senior)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [movie_id, theater_id, showing_time, price_adult, price_child, price_senior]
  );
}

async function getShowingsByMovieId(movieId) {
  const result = await pool.query(
    `SELECT showing_id, showing_time, theater_id FROM showings WHERE movie_id = $1 ORDER BY showing_time`,
    [movieId]
  );
  return result.rows;
}

async function getShowingsByMovieIdAndDate(movieId, date) {
  const result = await pool.query(
    `SELECT s.showing_id, s.showing_time, s.theater_id, m.poster_url, m.title
     FROM showings s
     JOIN movies m ON s.movie_id = m.movie_id
     WHERE s.movie_id = $1 AND DATE(s.showing_time) = $2
     ORDER BY s.showing_time`,
    [movieId, date]
  );
  return result.rows;
}

async function getShowingById(showingId) {
  const result = await pool.query(
    `SELECT showings.*, movies.title
     FROM showings
     JOIN movies ON movies.movie_id = showings.movie_id
     WHERE showing_id = $1`,
    [showingId]
  );
  return result.rows[0];
}

async function getAllShowings() {
  const result = await pool.query(
    `SELECT s.*, m.title, m.poster_url
     FROM showings s
     JOIN movies m ON s.movie_id = m.movie_id
     ORDER BY s.showing_time ASC`
  );
  return result.rows;
}

async function updateShowing(showingId, movieId, theaterId, showingTime, priceAdult, priceChild, priceSenior) {
  return pool.query(
    `UPDATE showings
     SET movie_id = $1, theater_id = $2, showing_time = $3,
         price_adult = $4, price_child = $5, price_senior = $6
     WHERE showing_id = $7`,
    [movieId, theaterId, showingTime, priceAdult, priceChild, priceSenior, showingId]
  );
}

async function deleteShowing(showingId) {
  return pool.query('DELETE FROM showings WHERE showing_id = $1', [showingId]);
}

async function getAllShowingsByDate(date) {
  const result = await pool.query(
    `SELECT s.*, m.title, m.poster_url
     FROM showings s
     JOIN movies m ON s.movie_id = m.movie_id
     WHERE DATE(s.showing_time) = $1
     ORDER BY s.showing_time ASC`,
    [date]
  );
  return result.rows;
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
