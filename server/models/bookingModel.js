const pool = require('../db/database');

async function createBooking(bookingNumber, userId, showingId, bookingTime, totalPrice) {
  const result = await pool.query(
    `INSERT INTO bookings (booking_number, user_id, showing_id, booking_time, total_price)
     VALUES ($1, $2, $3, $4, $5) RETURNING booking_id`,
    [bookingNumber, userId, showingId, bookingTime, totalPrice]
  );
  return result.rows[0];
}

async function getBookingsByUserId(userId) {
  const result = await pool.query(
    `SELECT
      bookings.booking_id,
      bookings.booking_number,
      bookings.total_price,
      bookings.booking_time,
      showings.showing_id,
      showings.showing_time,
      movies.title AS movie_title,
      movies.poster_url
    FROM bookings
    JOIN showings ON bookings.showing_id = showings.showing_id
    JOIN movies ON showings.movie_id = movies.movie_id
    WHERE bookings.user_id = $1 AND (bookings.is_cancelled IS NULL OR bookings.is_cancelled = 0)
    ORDER BY showings.showing_time ASC`,
    [userId]
  );
  return result.rows;
}

async function getSeatsByBookingId(bookingId) {
  const result = await pool.query(
    `SELECT seats.row_number::text || seats.seat_number::text AS seat_label
     FROM booked_seats
     JOIN seats ON booked_seats.seat_id = seats.seat_id
     WHERE booked_seats.booking_id = $1`,
    [bookingId]
  );
  return result.rows;
}

async function deletePastBookings() {
  const oldBookings = await pool.query(
    `SELECT booking_id FROM bookings WHERE booking_time < CURRENT_TIMESTAMP`
  );

  for (const { booking_id } of oldBookings.rows) {
    await pool.query(`DELETE FROM booked_seats WHERE booking_id = $1`, [booking_id]);
    await pool.query(`DELETE FROM booking_details WHERE booking_id = $1`, [booking_id]);
    await pool.query(`DELETE FROM bookings WHERE booking_id = $1`, [booking_id]);
  }
}

async function insertBookedSeats(bookingId, seatIds) {
  for (const seatId of seatIds) {
    await pool.query(
      `INSERT INTO booked_seats (booking_id, seat_id) VALUES ($1, $2)`,
      [bookingId, seatId]
    );
  }
}

async function insertBookingDetails(bookingId, details) {
  for (const detail of details) {
    await pool.query(
      `INSERT INTO booking_details (booking_id, ticket_type, quantity, price_per_ticket) VALUES ($1, $2, $3, $4)`,
      [bookingId, detail.ticket_type, detail.quantity, detail.price_per_ticket]
    );
  }
}

async function getBookingByNumber(bookingNumber) {
  const result = await pool.query(
    `SELECT bookings.*, movies.title AS movie_title, movies.poster_url, showings.showing_time
     FROM bookings
     JOIN showings ON bookings.showing_id = showings.showing_id
     JOIN movies ON showings.movie_id = movies.movie_id
     WHERE bookings.booking_number = $1`,
    [bookingNumber]
  );
  return result.rows[0];
}

async function trackBookingByNumber(bookingNumber) {
  const bookingResult = await pool.query(
    `SELECT b.booking_id, b.booking_number, b.total_price, b.showing_id,
            s.showing_time, m.title, m.poster_url
     FROM bookings b
     JOIN showings s ON b.showing_id = s.showing_id
     JOIN movies m ON s.movie_id = m.movie_id
     WHERE b.booking_number = $1`,
    [bookingNumber]
  );

  const booking = bookingResult.rows[0];
  if (!booking) return null;

  const seatsResult = await pool.query(
    `SELECT s.row_number AS seat_row, s.seat_number AS seat_column
     FROM booked_seats bs
     JOIN seats s ON bs.seat_id = s.seat_id
     WHERE bs.booking_id = $1`,
    [booking.booking_id]
  );

  return { ...booking, seats: seatsResult.rows };
}

async function cancelBooking(bookingId) {
  const result = await pool.query(
    `UPDATE bookings SET is_cancelled = 1 WHERE booking_id = $1 AND booking_time > CURRENT_TIMESTAMP`,
    [bookingId]
  );
  return { rowCount: result.rowCount };
}

module.exports = {
  getBookingsByUserId,
  getSeatsByBookingId,
  createBooking,
  deletePastBookings,
  insertBookedSeats,
  insertBookingDetails,
  getBookingByNumber,
  trackBookingByNumber,
  cancelBooking,
};
