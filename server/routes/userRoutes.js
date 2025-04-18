const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware'); // ✅ Don't forget this

router.put('/:id', requireAuth, updateUser);

module.exports = router;
