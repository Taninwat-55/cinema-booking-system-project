const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  createMovie,
  deleteMovie,
  createShowing,
  updateMovie,
  getDashboardStats,
} = require('../controllers/adminController');

const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/movies', getAllMovies);

router.post('/movies', createMovie);

router.delete('/movies/:id', deleteMovie);

router.post('/showings', createShowing);

router.put('/movies/:id', updateMovie);

router.get('/dashboard/stats', requireAuth, getDashboardStats);

module.exports = router;
