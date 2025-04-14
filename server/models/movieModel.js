const db = require('../db/database');

function getAllMovies() {
  return db.prepare('SELECT * FROM movies').all();
}

function getMovieById(movieId) {
  return db.prepare('SELECT * FROM movies WHERE movie_id = ?').get(movieId);
}

function createMovie(title, description, poster_url, trailer_url) {
  const imdb_id = Math.random().toString(36).substring(2, 9);

  return db
    .prepare(
      `INSERT INTO movies (imdb_id, title, description, poster_url, trailer_url)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(imdb_id, title, description, poster_url, trailer_url);
}

// function createMovie(title, description, poster_url, trailer_url) {
//   return db
//     .prepare(
//       `INSERT INTO movies (title, description, poster_url, trailer_url)
//      VALUES (?, ?, ?, ?)`
//     )
//     .run(title, description, poster_url, trailer_url);
// }

function deleteMovie(movieId) {
  return db.prepare('DELETE FROM movies WHERE movie_id = ?').run(movieId);
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  deleteMovie,
};
