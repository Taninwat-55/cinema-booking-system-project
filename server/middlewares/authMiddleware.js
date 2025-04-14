const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  const token = authHeader.split(' ')[1]; // Bearer token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, email, name }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

module.exports = { requireAuth };

// function requireAuth(req, res, next) {
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res
//       .status(401)
//       .json({ error: 'Unauthorized. Please log in first.' });
//   }

//   next();
// }

// module.exports = { requireAuth };
