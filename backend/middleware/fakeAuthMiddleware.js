// src/middlewares/fakeAuth.middleware.js
const fakeAuthMiddleware = (req, res, next) => {

  req.user = {
    id: "682361c50669f235be6e045f",
    name: "Niranjan Kumar",
    email: "niranjankumarofficial003@gmail.com"
  };
  next();
};

module.exports = fakeAuthMiddleware;
