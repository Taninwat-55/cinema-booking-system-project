const pool = require('../db/database');
const bookingModel = require('../models/bookingModel');

async function createBooking(req, res) {
  const { showing_id, total_price, selected_seats, user_id, ticket_details } = req.body;

  const booking_number = Math.random().toString(36).substring(2, 8).toUpperCase();

  const booking = await bookingModel.createBooking(
    booking_number,
    user_id,
    showing_id,
    new Date().toISOString(),
    total_price
  );

  const bookingId = booking.booking_id;

  await bookingModel.insertBookedSeats(bookingId, selected_seats);
  await bookingModel.insertBookingDetails(bookingId, ticket_details);

  res.json({ message: 'Booking successfully!', booking_number });
}

async function getBookingsByUserId(req, res) {
  const userId = req.params.id;

  await bookingModel.deletePastBookings();

  const bookings = await bookingModel.getBookingsByUserId(userId);

  const bookingsWithSeats = await Promise.all(
    bookings.map(async (booking) => {
      const seats = await bookingModel.getSeatsByBookingId(booking.booking_id);
      return { ...booking, seats: seats.map((s) => s.seat_label) };
    })
  );

  res.json(bookingsWithSeats);
}

async function getBookingByBookingNumber(req, res) {
  const bookingNumber = req.params.bookingNumber;

  const booking = await bookingModel.getBookingByNumber(bookingNumber);

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const seats = await bookingModel.getSeatsByBookingId(booking.booking_id);

  res.json({ ...booking, seats: seats.map((s) => s.seat_label) });
}

async function trackBookingByNumber(req, res) {
  const { booking_number } = req.params;

  try {
    const booking = await bookingModel.trackBookingByNumber(booking_number);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to track booking.' });
  }
}

async function cancelBookingById(req, res) {
  const bookingId = req.params.id;
  const result = await bookingModel.cancelBooking(bookingId);

  if (result.rowCount > 0) {
    res.json({ message: 'Booking cancelled successfully' });
  } else {
    res.status(400).json({ error: 'Could not cancel booking' });
  }
}

async function claimBooking(req, res) {
  const { booking_number, user_id } = req.body;

  if (!booking_number || !user_id) {
    return res.status(400).json({ error: 'Missing booking number or user ID' });
  }

  const result = await pool.query(
    'UPDATE bookings SET user_id = $1 WHERE booking_number = $2 AND user_id IS NULL',
    [user_id, booking_number]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Booking not found or already claimed' });
  }

  res.json({ message: 'Booking successfully linked to your account' });
}

module.exports = {
  createBooking,
  getBookingsByUserId,
  getBookingByBookingNumber,
  trackBookingByNumber,
  cancelBookingById,
  claimBooking,
};
