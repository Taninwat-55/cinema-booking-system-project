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

  bookingModel.insertBookedSeats(bookingId, selected_seats);
  bookingModel.insertBookingDetails(bookingId, ticket_details);

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

  const booking = bookingModel.getBookingByNumber(bookingNumber);

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const seats = bookingModel.getSeatsByBookingId(booking.booking_id);

  res.json({ ...booking, seats: seats.map((s) => s.seat_label) });
}

function trackBookingByNumber(req, res) {
  const { booking_number } = req.params;
  console.log('Looking for booking number:', booking_number);

  try {
    const booking = bookingModel.trackBookingByNumber(booking_number);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to track booking.' });
  }
}

module.exports = {
  createBooking,
  getBookingsByUserId,
  getBookingByBookingNumber,
  trackBookingByNumber,
};
