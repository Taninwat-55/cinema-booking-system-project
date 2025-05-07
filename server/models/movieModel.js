const db = require('../db/database');
const fetch = require('node-fetch');
require('dotenv').config();

async function getYoutubeTrailer(title) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn('YOUTUBE_API_KEY is not set — skipping trailer fetch.');
    return ''; // ⛔️ fallback to no trailer
  }

  const query = `${title} trailer`;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&key=${apiKey}&type=video&maxResults=1`;

  console.warn(`No trailer found for "${title}"`);

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    } else {
      return '';
    }
  } catch (err) {
    console.error('YouTube API Error:', err.message);
    return '';
  }
}

// async function getYoutubeTrailer(title) {
//   const query = `${title} trailer`;
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
//     query
//   )}&key=${apiKey}&type=video&maxResults=1`;

//   try {
//     const res = await fetch(searchUrl);
//     const data = await res.json();

//     if (data.items && data.items.length > 0) {
//       const videoId = data.items[0].id.videoId;
//       return `https://www.youtube.com/watch?v=${videoId}`;
//     } else {
//       return '';
//     }
//   } catch (err) {
//     console.error('YouTube API Error:', err.message);
//     return '';
//   }
// }

function getAllMovies(searchTerm = '', genre = '', year = '') {
  let query = 'SELECT * FROM movies WHERE 1=1';
  const params = [];

  if (searchTerm) {
    query += ' AND LOWER(title) LIKE ?';
    params.push(`%${searchTerm.toLowerCase()}%`);
  }

  if (genre) {
    query += ' AND genre LIKE ?';
    params.push(`%${genre}%`);
  }

  if (year) {
    query += ' AND release_year = ?';
    params.push(year);
  }

  return db.prepare(query).all(...params);
}

function getMovieById(movieId) {
  return db.prepare('SELECT * FROM movies WHERE movie_id = ?').get(movieId);
}

function createMovie(
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

  return db
    .prepare(
      `INSERT INTO movies (imdb_id, title, description, poster_url, trailer_url, imdb_rating, release_year, length_minutes, genre)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      imdb_id,
      title,
      description,
      poster_url,
      trailer_url,
      imdb_rating,
      release_year,
      length_minutes,
      genre
    );
}

function deleteMovie(movieId) {
  // Step 1: Delete all showings linked to this movie
  db.prepare('DELETE FROM showings WHERE movie_id = ?').run(movieId);

  // Step 2: Delete the movie
  return db.prepare('DELETE FROM movies WHERE movie_id = ?').run(movieId);
}

function getMovieByTitle(title) {
  return db
    .prepare('SELECT * FROM movies WHERE LOWER(title) = LOWER(?)')
    .get(title);
}

function updateMovie(id, title, description, poster_url, trailer_url) {
  return db
    .prepare(
      `
        UPDATE movies
        SET title = ?, description = ?, poster_url = ?, trailer_url = ?
        WHERE movie_id = ?
      `
    )
    .run(title, description, poster_url, trailer_url, id);
}

async function createMovieFromOMDb(title, apiKey) {
  const existing = getMovieByTitle(title);
  if (existing) return { error: 'exists' };

  const response = await fetch(
    `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`
  );
  const data = await response.json();

  if (data.Response === 'False') return { error: 'not_found' };

  const trailer_url = await getYoutubeTrailer(title);

  createMovie(
    data.Title,
    data.Plot,
    data.Poster,
    trailer_url, // ✅ Now fetched from YouTube!
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
