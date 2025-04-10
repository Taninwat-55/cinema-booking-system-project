const express = require('express');
const router = express.Router();
const { getSeatsByShowingId } = require('../controllers/seatController');

router.get('/:id', getSeatsByShowingId);

module.exports = router;
