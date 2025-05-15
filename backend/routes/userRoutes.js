const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");

// User CRUD routes
router.post("/", userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Resume linking
router.post("/link-resume", userController.linkResume);

module.exports = router;