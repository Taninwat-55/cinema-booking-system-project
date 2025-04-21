const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingsByUserId,
  getBookingByBookingNumber,
  trackBookingByNumber,
  cancelBookingById,
} = require('../controllers/bookingController');

const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/', createBooking);
router.get('/user/:id', requireAuth, getBookingsByUserId);
router.get('/confirmation/:bookingNumber', getBookingByBookingNumber);
router.get('/track/:booking_number', trackBookingByNumber);
router.put('/cancel/:id', requireAuth, cancelBookingById);

module.exports = router;
