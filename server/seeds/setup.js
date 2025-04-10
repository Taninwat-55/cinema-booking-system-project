const db = require('../db/database');

// Drop tables if they exist
db.exec(`
  DROP TABLE IF EXISTS seats;
  DROP TABLE IF EXISTS showings;
  DROP TABLE IF EXISTS movies;
`);

// Create movies table
db.exec(`
  CREATE TABLE movies (
    movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
    imdb_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    length_minutes INTEGER,
    release_year INTEGER,
    director TEXT,
    poster_url TEXT,
    trailer_url TEXT,
    genre TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create showings table
db.exec(`
  CREATE TABLE showings (
    showing_id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    datetime TEXT NOT NULL,
    theater TEXT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
  );
`);

// Create seats table
db.exec(`
  CREATE TABLE seats (
    seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    showing_id INTEGER NOT NULL,
    seat_number TEXT NOT NULL,
    is_available INTEGER DEFAULT 1,
    FOREIGN KEY (showing_id) REFERENCES showings(showing_id)
  );
`);

console.log('✅ Tables created!');
