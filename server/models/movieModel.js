const pool = require('../db/database');
const fetch = require('node-fetch');
require('dotenv').config();

async function getYoutubeTrailer(title) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn('YOUTUBE_API_KEY is not set — skipping trailer fetch.');
    return '';
  }

  const query = `${title} trailer`;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&key=${apiKey}&type=video&maxResults=1`;

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    } else {
      console.warn(`No trailer found for "${title}"`);
      return '';
    }
  } catch (err) {
    console.error('YouTube API Error:', err.message);
    return '';
  }
}

async function getAllMovies(searchTerm = '', genre = '', year = '') {
  let query = 'SELECT * FROM movies WHERE 1=1';
  const params = [];
  let i = 1;

  if (searchTerm) {
    query += ` AND LOWER(title) LIKE $${i++}`;
    params.push(`%${searchTerm.toLowerCase()}%`);
  }

  if (genre) {
    query += ` AND genre ILIKE $${i++}`;
    params.push(`%${genre}%`);
  }

  if (year) {
    query += ` AND release_year = $${i++}`;
    params.push(year);
  }

  const result = await pool.query(query, params);
  return result.rows;
}

async function getMovieById(movieId) {
  const result = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [movieId]);
  return result.rows[0];
}

async function createMovie(
  title,
  description,
  poster_url,
  trailer_url,
  imdb_rating,
  release_year,
  length_minutes,
  genre
) {
  const imdb_id = Math.random().toString(36).substring(2, 9);
  const result = await pool.query(
    `INSERT INTO movies (imdb_id, title, description, poster_url, trailer_url, imdb_rating, release_year, length_minutes, genre)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING movie_id`,
    [imdb_id, title, description, poster_url, trailer_url, imdb_rating, release_year, length_minutes, genre]
  );
  return result.rows[0];
}

async function deleteMovie(movieId) {
  await pool.query('DELETE FROM showings WHERE movie_id = $1', [movieId]);
  return pool.query('DELETE FROM movies WHERE movie_id = $1', [movieId]);
}

async function getMovieByTitle(title) {
  const result = await pool.query(
    'SELECT * FROM movies WHERE LOWER(title) = LOWER($1)',
    [title]
  );
  return result.rows[0];
}

async function updateMovie(id, title, description, poster_url, trailer_url) {
  return pool.query(
    `UPDATE movies SET title = $1, description = $2, poster_url = $3, trailer_url = $4 WHERE movie_id = $5`,
    [title, description, poster_url, trailer_url, id]
  );
}

async function createMovieFromOMDb(title, apiKey) {
  const existing = await getMovieByTitle(title);
  if (existing) return { error: 'exists' };

  const response = await fetch(
    `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`
  );
  const data = await response.json();

  if (data.Response === 'False') return { error: 'not_found' };

  const trailer_url = await getYoutubeTrailer(title);

  await createMovie(
    data.Title,
    data.Plot,
    data.Poster,
    trailer_url,
    parseFloat(data.imdbRating),
    parseInt(data.Year),
    parseInt(data.Runtime),
    data.Genre
  );

  return { success: true };
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  getMovieByTitle,
  updateMovie,
  createMovieFromOMDb,
  getYoutubeTrailer,
};
