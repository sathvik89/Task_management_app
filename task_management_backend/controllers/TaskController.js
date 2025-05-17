const Task = require("../models/Task");

// Get all tasks with filtering, sorting, and search
exports.getTasks = async (req, res) => {
  try {
    const { status, category, sortBy, searchQuery } = req.query;
    const userId = req.user.id;

    // Build query
    const query = {
      userId,
      isDeleted: false,
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Add search query if provided
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Build sort options
    let sort = {};
    if (sortBy === "dueDate") {
      sort = { dueDate: 1 }; // Ascending by due date
    } else {
      sort = { createdAt: -1 }; // Default: descending by creation date
    }

    const tasks = await Task.find(query).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new Task({
      title,
      description,
      status: status || "todo",
      category: category || "Other",
      dueDate,
      userId: req.user.id,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, isDeleted: false },
      { title, description, status, category, dueDate },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// Soft delete a task (move to trash)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task moved to trash" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

// Restore a task from trash
exports.restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found in trash" });
    }

    res.status(200).json({ message: "Task restored from trash" });
  } catch (error) {
    console.error("Restore task error:", error);
    res.status(500).json({ message: "Server error while restoring task" });
  }
};

// Permanently delete a task
exports.permanentDeleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found in trash" });
    }

    res.status(200).json({ message: "Task permanently deleted" });
  } catch (error) {
    console.error("Permanent delete task error:", error);
    res
      .status(500)
      .json({ message: "Server error while permanently deleting task" });
  }
};

// Get deleted tasks (trash)
exports.getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get deleted tasks error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching deleted tasks" });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts for different task statuses
    const totalTasks = await Task.countDocuments({
      userId,
      isDeleted: false,
    });

    const todoTasks = await Task.countDocuments({
      userId,
      status: "todo",
      isDeleted: false,
    });

    const inProgressTasks = await Task.countDocuments({
      userId,
      status: "in-progress",
      isDeleted: false,
    });

    const completedTasks = await Task.countDocuments({
      userId,
      status: "completed",
      isDeleted: false,
    });

    // Get upcoming tasks (sorted by due date)
    const upcomingTasks = await Task.find({
      userId,
      isDeleted: false,
    })
      .sort({ dueDate: 1 })
      .limit(5);

    res.status(200).json({
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      upcomingTasks,
    });
  } catch (error) {
    console.error("Get task stats error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching task statistics" });
  }
};
