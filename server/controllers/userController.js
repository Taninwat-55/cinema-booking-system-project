const db = require('../db/database');

function updateUser(req, res) {
  const userId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  db.prepare(
    `
      UPDATE users SET name = ?, email = ? WHERE user_id = ?
    `
  ).run(name, email, userId);

  res.json({ message: 'User updated successfully' });
}

module.exports = { updateUser };
