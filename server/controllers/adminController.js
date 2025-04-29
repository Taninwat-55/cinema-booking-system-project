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
  const {
    title,
    description,
    poster_url,
    trailer_url,
    imdb_rating,
    release_year,
    length_minutes,
    genre,
    useOmdb = true, // optional flag
  } = req.body;

  const apiKey = process.env.OMDB_API_KEY;

  try {
    if (useOmdb) {
      const result = await movieModel.createMovieFromOMDb(title, apiKey);
      if (result.error === 'exists') {
        return res.status(400).json({ message: 'Movie already exists.' });
      }
      if (result.error === 'not_found') {
        return res.status(404).json({ error: 'Movie not found in OMDb API' });
      }
      return res
        .status(201)
        .json({ message: 'Movie created successfully with OMDb data' });
    } else {
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
      return res
        .status(201)
        .json({ message: 'Movie created manually and saved successfully' });
    }
  } catch (err) {
    console.error('Create Movie Error:', err.message);
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

  movieModel.updateMovie(id, title, description, poster_url, trailer_url);
  res.json({ message: 'Movie updated successfully' });
}

function getDashboardStats(req, res) {
  try {
    const stats = adminModel.getDashboardStats();
    res.json(stats);
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

function updateShowing(req, res) {
  const showingId = req.params.id;
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

  showingModel.updateShowing(
    showingId,
    movie_id,
    theater_id,
    showing_time,
    price_adult,
    price_child,
    price_senior
  );

  res.json({ message: 'Showing updated successfully' });
}

function deleteShowing(req, res) {
  const showingId = req.params.id;
  showingModel.deleteShowing(showingId);
  res.json({ message: 'Showing deleted successfully' });
}

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
  createShowing,
  updateMovie,
  getDashboardStats,
  getAllBookings,
  updateShowing,
  deleteShowing,
};
