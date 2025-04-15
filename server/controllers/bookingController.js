const db = require('../db/database');
const bookingModel = require('../models/bookingModel');

function createBooking(req, res) {
  const { showing_id, total_price, selected_seats, user_id, ticket_details } =
    req.body;

  const booking_number = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  const result = bookingModel.createBooking(
    booking_number,
    user_id,
    showing_id,
    new Date().toISOString(),
    total_price
  );

  const bookingId = result.lastInsertRowid;

  const insertBookedSeat = db.prepare(`
    INSERT INTO booked_seats (booking_id, seat_id)
    VALUES (?, ?)
  `);

  for (const seatId of selected_seats) {
    insertBookedSeat.run(bookingId, seatId);
  }

  const insertBookingDetail = db.prepare(`
    INSERT INTO booking_details (booking_id, ticket_type, quantity, price_per_ticket)
    VALUES (?, ?, ?, ?)
  `);

  for (const detail of ticket_details) {
    insertBookingDetail.run(
      bookingId,
      detail.ticket_type,
      detail.quantity,
      detail.price_per_ticket
    );
  }

  res.json({ message: 'Booking successfully!', booking_number });
}

function getBookingsByUserId(req, res) {
  const userId = req.params.id;

  bookingModel.deletePastBookings();

  const bookings = bookingModel.getBookingsByUserId(userId);

  const bookingsWithSeats = bookings.map((booking) => {
    const seats = bookingModel.getSeatsByBookingId(booking.booking_id);
    return { ...booking, seats: seats.map((s) => s.seat_label) };
  });

  res.json(bookingsWithSeats);
}

function getBookingByBookingNumber(req, res) {
  const bookingNumber = req.params.bookingNumber;

  const booking = db
    .prepare(
      `
    SELECT bookings.*, movies.title AS movie_title, movies.poster_url, showings.showing_time
    FROM bookings
    JOIN showings ON bookings.showing_id = showings.showing_id
    JOIN movies ON showings.movie_id = movies.movie_id
    WHERE bookings.booking_number = ?
  `
    )
    .get(bookingNumber);

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const seats = bookingModel.getSeatsByBookingId(booking.booking_id);

  res.json({ ...booking, seats: seats.map((s) => s.seat_label) });
}

module.exports = {
  createBooking,
  getBookingsByUserId,
  getBookingByBookingNumber,
};
