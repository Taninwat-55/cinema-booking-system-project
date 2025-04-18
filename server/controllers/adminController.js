const db = require('../db/database');
const movieModel = require('../models/movieModel');
const showingModel = require('../models/showingModel');
const adminModel = require('../models/adminModel');
const fetch = require('node-fetch');
require('dotenv').config();

function getAllMovies(req, res) {
  const movies = movieModel.getAllMovies();
  res.json(movies);
}

async function createMovie(req, res) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const existingMovie = movieModel.getMovieByTitle(title);

    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists.' });
    }

    const apiKey = process.env.OMDB_API_KEY;
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`
    );

    const data = await response.json();

    if (data.Response === 'False') {
      return res.status(404).json({ error: 'Movie not found in OMDb API' });
    }

    const description = data.Plot;
    const poster_url = data.Poster;
    const trailer_url = ''; // Optional or static for now
    const release_year = data.Year;
    const length_minutes = data.Runtime;
    const genre = data.Genre;
    const imdb_rating = data.imdbRating;

    movieModel.createMovie(
      title,
      description,
      poster_url,
      trailer_url,
      imdb_rating,
      release_year,
      length_minutes,
      genre
    );

    res
      .status(201)
      .json({ message: 'Movie created successfully with OMDb data' });
  } catch (error) {
    console.error('Create Movie Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

  const selectedDate = new Date(showing_time);
  const now = new Date();

  if (selectedDate < now) {
    return res.status(400).json({ error: 'Cannot add a showing in the past' });
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

function updateMovie(req, res) {
  const id = req.params.id;
  const { title, description, poster_url, trailer_url } = req.body;

  db.prepare(
    `
      UPDATE movies
      SET title = ?, description = ?, poster_url = ?, trailer_url = ?
      WHERE movie_id = ?
    `
  ).run(title, description, poster_url, trailer_url, id);

  res.json({ message: 'Movie updated successfully' });
}

function getDashboardStats(req, res) {
  try {
    const totalMovies = db
      .prepare('SELECT COUNT(*) AS count FROM movies')
      .get();
    const totalShowings = db
      .prepare('SELECT COUNT(*) AS count FROM showings')
      .get();
    const totalBookings = db
      .prepare('SELECT COUNT(*) AS count FROM bookings')
      .get();

    const popularMovie = db
      .prepare(
        `
        SELECT movies.title, COUNT(bookings.booking_id) AS bookings_count
        FROM bookings
        JOIN showings ON bookings.showing_id = showings.showing_id
        JOIN movies ON showings.movie_id = movies.movie_id
        GROUP BY movies.title
        ORDER BY bookings_count DESC
        LIMIT 1
      `
      )
      .get();

    res.json({
      total_movies: totalMovies.count,
      total_showings: totalShowings.count,
      total_bookings: totalBookings.count,
      popular_movie: popularMovie?.title || 'No bookings yet',
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function getAllBookings(req, res) {
  try {
    const allBookings = adminModel.getAllBookingsWithSeats();
    res.json(allBookings);
  } catch (err) {
    console.error('Error fetching all bookings:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
  createShowing,
  updateMovie,
  getDashboardStats,
  getAllBookings,
};
