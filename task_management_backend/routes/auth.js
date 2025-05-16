const express = require("express");
const router = express.Router();
const { login, register, getUsers } = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, admin, getUsers);

module.exports = router;
