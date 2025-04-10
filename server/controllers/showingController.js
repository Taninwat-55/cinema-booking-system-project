const db = require('../db/database');

function getShowingsByMovieId(req, res) {
  const movieId = req.params.id;

  const showings = db
    .prepare(
      `
    SELECT showing_id, showing_time, theater_id
    FROM showings
    WHERE movie_id = ?
    ORDER BY showing_time
  `
    )
    .all(movieId);

  res.json(showings);
}

function getShowingById(req, res) {
  const showingId = req.params.id;

  const showing = db
    .prepare(
      `
    SELECT showings.*, movies.title
    FROM showings
    JOIN movies ON movies.movie_id = showings.movie_id
    WHERE showing_id = ?
  `
    )
    .get(showingId);

  if (!showing) return res.status(404).json({ error: 'Showing not found' });

  res.json(showing);
}

module.exports = { getShowingsByMovieId, getShowingById };
