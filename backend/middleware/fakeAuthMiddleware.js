// src/middlewares/fakeAuth.middleware.js
const fakeAuthMiddleware = (req, res, next) => {
  // Add a fake user object to the request
  req.user = {
    id: "6579e2a1b54d7e3a5c8b4567", // Fake MongoDB ObjectId
    name: "Test User",
    email: "test@example.com"
  };
  next();
};

module.exports = fakeAuthMiddleware;
