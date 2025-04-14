const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  createMovie,
  deleteMovie,
  createShowing,
  updateMovie,
} = require('../controllers/adminController');

router.get('/movies', getAllMovies);

router.post('/movies', createMovie);

router.delete('/movies/:id', deleteMovie);

router.post('/showings', createShowing);

router.put('/movies/:id', updateMovie);

module.exports = router;
