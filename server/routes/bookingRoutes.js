const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingsByUserId,
} = require('../controllers/bookingController');

const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/', createBooking);
router.get('/user/:id', getBookingsByUserId);

module.exports = router;
