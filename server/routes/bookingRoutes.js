const express = require('express');
const router = express.Router();

const { createBooking, getBookingsByUserId } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/user/:id', getBookingsByUserId);

module.exports = router;
