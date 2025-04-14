const movieModel = require('../models/movieModel');
const showingModel = require('../models/showingModel');

function getAllMovies(req, res) {
  const movies = movieModel.getAllMovies();
  res.json(movies);
}

function createMovie(req, res) {
  const { title, description, poster_url, trailer_url } = req.body;

  if (!title || !description || !poster_url || !trailer_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  movieModel.createMovie(title, description, poster_url, trailer_url);
  res.status(201).json({ message: 'Movie created successfully' });
}

function deleteMovie(req, res) {
  const movieId = req.params.id;

  movieModel.deleteMovie(movieId);
  res.json({ message: 'Movie deleted successfully' });
}

function createShowing(req, res) {
  const {
    movie_id,
    theater_id,
    showing_time,
    price_adult,
    price_child,
    price_senior,
  } = req.body;

  if (
    !movie_id ||
    !theater_id ||
    !showing_time ||
    !price_adult ||
    !price_child ||
    !price_senior
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  showingModel.createShowing(
    movie_id,
    theater_id,
    showing_time,
    price_adult,
    price_child,
    price_senior
  );

  res.status(201).json({ message: 'Showing created successfully' });
}

module.exports = { getAllMovies, createMovie, deleteMovie, createShowing };
