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

module.exports = { createShowing };
