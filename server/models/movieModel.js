const db = require('../db/database');

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

  createMovie(
    data.Title,
    data.Plot,
    data.Poster,
    '', // Trailer URL
    data.imdbRating,
    data.Year,
    data.Runtime,
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
};
