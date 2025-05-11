// created this for test
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie,
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    return res.status(500).json({ error: 'Authentication error.' });
  }
};

module.exports = { authenticateToken };