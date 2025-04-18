const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.put('/:id', requireAuth, updateUser);

module.exports = router;
