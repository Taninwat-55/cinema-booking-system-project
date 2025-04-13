const db = require('../db/database');

function getWatchlistByUserId(user_id) {
  return db
    .prepare(
      `
    SELECT movies.* FROM watchlist
    JOIN movies ON watchlist.movie_id = movies.movie_id
    WHERE watchlist.user_id = ?
  `
    )
    .all(user_id);
}

function addToWatchlist(user_id, movie_id) {
  return db
    .prepare(
      `
    INSERT INTO watchlist (user_id, movie_id)
    VALUES (?, ?)
  `
    )
    .run(user_id, movie_id);
}

function removeFromWatchlist(user_id, movie_id) {
  return db
    .prepare(
      `
    DELETE FROM watchlist
    WHERE user_id = ? AND movie_id = ?
  `
    )
    .run(user_id, movie_id);
}

module.exports = {
  getWatchlistByUserId,
  addToWatchlist,
  removeFromWatchlist,
};
