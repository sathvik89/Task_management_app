const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Improved CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

// Import routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Connect to MongoDB with improved error handling
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    const PORT = process.env.PORT || 8800;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
