const pool = require('../db/database');

async function getWatchlistByUserId(user_id) {
  const result = await pool.query(
    `SELECT movies.* FROM watchlist
     JOIN movies ON watchlist.movie_id = movies.movie_id
     WHERE watchlist.user_id = $1`,
    [user_id]
  );
  return result.rows;
}

async function addToWatchlist(user_id, movie_id) {
  return pool.query(
    `INSERT INTO watchlist (user_id, movie_id) VALUES ($1, $2)`,
    [user_id, movie_id]
  );
}

async function removeFromWatchlist(user_id, movie_id) {
  return pool.query(
    `DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2`,
    [user_id, movie_id]
  );
}

module.exports = { getWatchlistByUserId, addToWatchlist, removeFromWatchlist };
