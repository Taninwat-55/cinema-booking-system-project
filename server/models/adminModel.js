const pool = require('../db/database');

async function getAllBookingsWithSeats() {
  const bookings = await pool.query(
    `SELECT
      bookings.booking_id,
      bookings.booking_number,
      bookings.total_price,
      bookings.booking_time,
      users.name AS user_name,
      users.email AS user_email,
      movies.title AS movie_title,
      showings.showing_time,
      showings.theater_id
    FROM bookings
    LEFT JOIN users ON bookings.user_id = users.user_id
    JOIN showings ON bookings.showing_id = showings.showing_id
    JOIN movies ON showings.movie_id = movies.movie_id
    ORDER BY showings.showing_time DESC`
  );

  const result = [];
  for (const b of bookings.rows) {
    const seats = await pool.query(
      `SELECT seat_id FROM booked_seats WHERE booking_id = $1`,
      [b.booking_id]
    );
    result.push({
      ...b,
      user_name: b.user_name || 'Guest',
      user_email: b.user_email || 'N/A',
      seats: seats.rows.map((s) => s.seat_id),
    });
  }
  return result;
}

async function getDashboardStats() {
  const totalMovies = await pool.query('SELECT COUNT(*) AS count FROM movies');
  const totalShowings = await pool.query('SELECT COUNT(*) AS count FROM showings');
  const totalBookings = await pool.query('SELECT COUNT(*) AS count FROM bookings');
  const popularMovie = await pool.query(
    `SELECT movies.title, COUNT(bookings.booking_id) AS bookings_count
     FROM bookings
     JOIN showings ON bookings.showing_id = showings.showing_id
     JOIN movies ON showings.movie_id = movies.movie_id
     GROUP BY movies.title
     ORDER BY bookings_count DESC
     LIMIT 1`
  );

  return {
    total_movies: parseInt(totalMovies.rows[0].count),
    total_showings: parseInt(totalShowings.rows[0].count),
    total_bookings: parseInt(totalBookings.rows[0].count),
    popular_movie: popularMovie.rows[0]?.title || 'No bookings yet',
  };
}

module.exports = { getAllBookingsWithSeats, getDashboardStats };
