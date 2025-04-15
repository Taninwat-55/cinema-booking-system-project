const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingsByUserId,
  getBookingByBookingNumber,
} = require('../controllers/bookingController');

const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/', createBooking);
router.get('/user/:id', requireAuth, getBookingsByUserId);
router.get('/confirmation/:bookingNumber', getBookingByBookingNumber);

module.exports = router;
