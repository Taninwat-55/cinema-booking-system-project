const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  createMovie,
  deleteMovie,
  createShowing,
  updateMovie,
  getDashboardStats,
  getAllBookings,
  updateShowing,
  deleteShowing,
} = require('../controllers/adminController');

const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/movies', getAllMovies);
router.post('/movies', createMovie);
router.delete('/movies/:id', deleteMovie);
router.post('/showings', createShowing);
router.put('/movies/:id', updateMovie);
router.get('/dashboard/stats', requireAuth, getDashboardStats);
router.get('/bookings', requireAuth, getAllBookings);
router.put('/showings/:id', updateShowing);
router.delete('/showings/:id', deleteShowing);

module.exports = router;
