const Task = require("../models/Task");

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const { status, category, sortBy } = req.query;
    const query = { createdBy: req.user.id, isDeleted: false };

    // Add filters if provided
    if (status) query.status = status;
    if (category) query.category = category;

    // Create sort object
    const sort = {};
    if (sortBy === "dueDate") {
      sort.dueDate = 1; // Ascending
    } else if (sortBy === "createdAt") {
      sort.createdAt = -1; // Descending (newest first)
    }

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get deleted tasks (trash)
exports.getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.id,
      isDeleted: true,
    });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching deleted tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, category, dueDate } = req.body;

    const newTask = new Task({
      title,
      description,
      status,
      category,
      dueDate,
      createdBy: req.user.id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, category, dueDate } = req.body;

    // Find and update the task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { title, description, status, category, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete a task (move to trash)
exports.softDeleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task moved to trash" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Restore a task from trash
exports.restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { isDeleted: false },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task restored" });
  } catch (err) {
    console.error("Error restoring task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Permanently delete a task
exports.permanentDeleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task permanently deleted" });
  } catch (err) {
    console.error("Error permanently deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({
      createdBy: req.user.id,
      isDeleted: false,
    });

    const todoTasks = await Task.countDocuments({
      createdBy: req.user.id,
      status: "todo",
      isDeleted: false,
    });

    const inProgressTasks = await Task.countDocuments({
      createdBy: req.user.id,
      status: "in-progress",
      isDeleted: false,
    });

    const completedTasks = await Task.countDocuments({
      createdBy: req.user.id,
      status: "completed",
      isDeleted: false,
    });

    const upcomingTasks = await Task.find({
      createdBy: req.user.id,
      dueDate: { $gte: new Date() },
      status: { $ne: "completed" },
      isDeleted: false,
    })
      .sort({ dueDate: 1 })
      .limit(5);

    res.json({
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      upcomingTasks,
    });
  } catch (err) {
    console.error("Error fetching task stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};
