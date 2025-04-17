const db = require('../db/database');

function getAllMovies(searchTerm = '') {
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    return db
      .prepare('SELECT * FROM movies WHERE LOWER(title) LIKE ?')
      .all(`%${lower}%`);
  }

  return db.prepare('SELECT * FROM movies').all();
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

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  deleteMovie,
};
