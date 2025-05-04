const db = require('../db/database');

function getAllBookingsWithSeats() {
  const bookings = db
    .prepare(
      `
      SELECT 
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
      ORDER BY showings.showing_time DESC
    `
    )
    .all();

  const getSeats = db.prepare(`
    SELECT seat_id FROM booked_seats WHERE booking_id = ?
  `);

  return bookings.map((b) => {
    const seats = getSeats.all(b.booking_id).map((s) => s.seat_id);
    return {
      ...b,
      user_name: b.user_name || 'Guest',
      user_email: b.user_email || 'N/A',
      seats,
    };
  });
}

function getDashboardStats() {
  const totalMovies = db.prepare('SELECT COUNT(*) AS count FROM movies').get();
  const totalShowings = db
    .prepare('SELECT COUNT(*) AS count FROM showings')
    .get();
  const totalBookings = db
    .prepare('SELECT COUNT(*) AS count FROM bookings')
    .get();

  const popularMovie = db
    .prepare(
      `
      SELECT movies.title, COUNT(bookings.booking_id) AS bookings_count
      FROM bookings
      JOIN showings ON bookings.showing_id = showings.showing_id
      JOIN movies ON showings.movie_id = movies.movie_id
      GROUP BY movies.title
      ORDER BY bookings_count DESC
      LIMIT 1
    `
    )
    .get();

  return {
    total_movies: totalMovies.count,
    total_showings: totalShowings.count,
    total_bookings: totalBookings.count,
    popular_movie: popularMovie?.title || 'No bookings yet',
  };
}

module.exports = {
  getAllBookingsWithSeats,
  getDashboardStats,
};
