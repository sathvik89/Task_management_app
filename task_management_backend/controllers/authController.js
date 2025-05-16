const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login controller with improved error handling
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found. Please register first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Remove password from response
    const { password: _, ...userData } = user._doc;

    res.json({ user: userData, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Register controller with improved validation
exports.register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: !!isAdmin,
    });

    await newUser.save();

    // Generate token for immediate login
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return user data and token
    const { password: _, ...userData } = newUser._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};
