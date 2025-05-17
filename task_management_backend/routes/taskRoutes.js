const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");
const { protect } = require("../middleware/authMiddleware");

// Apply auth middleware to all routes
router.use(protect);

// Task routes
router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.get("/stats", taskController.getTaskStats);
router.get("/trash", taskController.getDeletedTasks);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.put("/:id/restore", taskController.restoreTask);
router.delete("/:id/permanent", taskController.permanentDeleteTask);

module.exports = router;
