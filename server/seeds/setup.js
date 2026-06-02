const pool = require('../db/database');

async function setup() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`DROP TABLE IF EXISTS booked_seats CASCADE`);
    await client.query(`DROP TABLE IF EXISTS booking_details CASCADE`);
    await client.query(`DROP TABLE IF EXISTS bookings CASCADE`);
    await client.query(`DROP TABLE IF EXISTS watchlist CASCADE`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE`);
    await client.query(`DROP TABLE IF EXISTS seats CASCADE`);
    await client.query(`DROP TABLE IF EXISTS showings CASCADE`);
    await client.query(`DROP TABLE IF EXISTS theaters CASCADE`);
    await client.query(`DROP TABLE IF EXISTS movies CASCADE`);

    await client.query(`
      CREATE TABLE movies (
        movie_id SERIAL PRIMARY KEY,
        imdb_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        length_minutes INTEGER,
        release_year INTEGER,
        director TEXT,
        poster_url TEXT,
        trailer_url TEXT,
        genre TEXT,
        imdb_rating REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE theaters (
        theater_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        seats_rows INTEGER NOT NULL,
        seats_columns INTEGER NOT NULL,
        total_seats INTEGER NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE showings (
        showing_id SERIAL PRIMARY KEY,
        movie_id INTEGER NOT NULL REFERENCES movies(movie_id),
        theater_id INTEGER NOT NULL REFERENCES theaters(theater_id),
        showing_time TIMESTAMP NOT NULL,
        price_adult REAL NOT NULL,
        price_child REAL NOT NULL,
        price_senior REAL NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE seats (
        seat_id SERIAL PRIMARY KEY,
        theater_id INTEGER NOT NULL REFERENCES theaters(theater_id),
        row_number INTEGER NOT NULL,
        seat_number INTEGER NOT NULL,
        is_available INTEGER DEFAULT 1
      )
    `);

    await client.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_admin INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE watchlist (
        watchlist_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id),
        movie_id INTEGER NOT NULL REFERENCES movies(movie_id),
        UNIQUE (user_id, movie_id)
      )
    `);

    await client.query(`
      CREATE TABLE bookings (
        booking_id SERIAL PRIMARY KEY,
        booking_number TEXT UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(user_id),
        showing_id INTEGER NOT NULL REFERENCES showings(showing_id),
        booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_price REAL NOT NULL,
        is_cancelled INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE booking_details (
        booking_detail_id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(booking_id),
        ticket_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price_per_ticket REAL NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE booked_seats (
        booked_seat_id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(booking_id),
        seat_id INTEGER NOT NULL REFERENCES seats(seat_id)
      )
    `);

    await client.query(`
      INSERT INTO theaters (name, seats_rows, seats_columns, total_seats)
      VALUES ('Salong 1', 7, 10, 70), ('Salong 2', 5, 10, 50)
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await client.query(`
      CREATE TRIGGER update_movies_timestamp
      BEFORE UPDATE ON movies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `);

    await client.query('COMMIT');
    console.log('✅ Tables created and initial data inserted!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Setup failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
