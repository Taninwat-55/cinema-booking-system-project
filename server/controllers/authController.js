const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
  const { email, password, name } = req.body;

  const existingUser = userModel.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userModel.createUser(email, hashedPassword, name);

  res.status(201).json({ message: 'User registered successfully!' });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = userModel.getUserByEmail(email);

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { user_id: user.user_id, email: user.email, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { user_id: user.user_id, name: user.name, is_admin: user.is_admin },
  });
}

module.exports = { registerUser, loginUser };
