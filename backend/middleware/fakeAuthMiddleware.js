// // src/middlewares/fakeAuth.middleware.js
// const fakeAuthMiddleware = (req, res, next) => {
//   // Add a fake user object to the request
//   req.user = {
//     id: "6579e2a1b54d7e3a5c8b4567", // Fake MongoDB ObjectId
//     name: "Test User",
//     email: "test@example.com"
//   };
//   next();
// };

// module.exports = fakeAuthMiddleware;
const jwt = require('jsonwebtoken');

const fakeAuthMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token; 

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = fakeAuthMiddleware;
