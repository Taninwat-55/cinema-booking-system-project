function requireAuth(req, res, next) {
  const { user_id } = req.body;

  if (!user_id) {
    return res
      .status(401)
      .json({ error: 'Unauthorized. Please log in first.' });
  }

  next();
}

module.exports = { requireAuth };
