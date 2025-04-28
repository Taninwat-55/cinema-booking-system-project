const movieModel = require('../models/movieModel');

function getAllMovies(req, res) {
  const search = req.query.search || '';
  const genre = req.query.genre || '';
  const year = req.query.year || '';

  const movies = movieModel.getAllMovies(search, genre, year);
  res.json(movies);
}

function getMovieById(req, res) {
  const movieId = req.params.id;

  const movie = movieModel.getMovieById(movieId);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.json(movie);
}

module.exports = { getAllMovies, getMovieById };
