const db = require('../db/database');

// Drop tables if they exist
db.exec(`
  DROP TABLE IF EXISTS booked_seats;
  DROP TABLE IF EXISTS booking_details;
  DROP TABLE IF EXISTS bookings;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS seats;
  DROP TABLE IF EXISTS showings;
  DROP TABLE IF EXISTS theaters;
  DROP TABLE IF EXISTS movies;

  -- Tabell för filmer
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

  -- Tabell för biografsalonger
  CREATE TABLE theaters (
    theater_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    seats_rows INTEGER NOT NULL,
    seats_columns INTEGER NOT NULL,
    total_seats INTEGER NOT NULL
  );

  -- Tabell för filmvisningar
  CREATE TABLE showings (
    showing_id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    theater_id INTEGER NOT NULL,
    showing_time TIMESTAMP NOT NULL,
    price_adult REAL NOT NULL,
    price_child REAL NOT NULL,
    price_senior REAL NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies (movie_id),
    FOREIGN KEY (theater_id) REFERENCES theaters (theater_id)
  );

  -- Tabell för platser i salonger
  CREATE TABLE seats (
    seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    theater_id INTEGER NOT NULL,
    row_number INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT 1,
    FOREIGN KEY (theater_id) REFERENCES theaters (theater_id)
  );

  -- Tabell för användare (för inloggning och bokningshistorik)
  CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabell för watchlist (favoritfilmer)
  CREATE TABLE watchlist (
    watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (movie_id) REFERENCES movies (movie_id),
    UNIQUE (user_id, movie_id)
);

  -- Tabell för bokningar
  CREATE TABLE bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_number TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    showing_id INTEGER NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (showing_id) REFERENCES showings (showing_id)
  );

  -- Tabell för bokningsdetaljer (antal biljetter av varje typ)
  CREATE TABLE booking_details (
    booking_detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    ticket_type TEXT NOT NULL, -- 'vuxen', 'barn', 'pensionär'
    quantity INTEGER NOT NULL,
    price_per_ticket REAL NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
  );

  -- Tabell för bokade platser
  CREATE TABLE booked_seats (
    booked_seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id),
    FOREIGN KEY (seat_id) REFERENCES seats (seat_id)
  );

  -- Data för salonger
  INSERT INTO theaters (name, seats_rows, seats_columns, total_seats)
  VALUES 
    ('Salong 1', 7, 10, 70),
    ('Salong 2', 5, 10, 50);

  -- Trigger för att uppdatera updated_at när en film ändras
  CREATE TRIGGER update_movies_timestamp 
  AFTER UPDATE ON movies
  BEGIN
    UPDATE movies SET updated_at = CURRENT_TIMESTAMP WHERE movie_id = NEW.movie_id;
  END;
`);

console.log('✅ Tables created and initial data inserted!');
