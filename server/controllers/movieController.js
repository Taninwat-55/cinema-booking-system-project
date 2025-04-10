const db = require('../db/database');

function getAllMovies(req, res) {
  const movies = db.prepare('SELECT * FROM movies').all();
  res.json(movies);
}

function getMovieById(req, res) {
  const movieId = req.params.id;

  const movie = db
    .prepare('SELECT * FROM movies WHERE movie_id = ?')
    .get(movieId);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.json(movie);
}

module.exports = { getAllMovies, getMovieById };
