const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// Protected routes
router.put("/profile", protect, authController.updateProfile);
router.put("/password", protect, authController.updatePassword);

// Admin routes
router.get("/users", protect, authController.getUsers);

module.exports = router;
