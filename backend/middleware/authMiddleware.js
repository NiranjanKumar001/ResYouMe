const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify session is still valid
    if (decoded.sessionId !== req.sessionID) {
      throw new Error('Session expired');
    }

    const user = await User.findById(decoded.userId)
      .select('-githubAccessToken -githubRefreshToken');
    
    if (!user) throw new Error('User not found');

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('authToken');
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};