"use client";

import { useState, useEffect } from "react";
import { createTask, updateTask } from "../api";
import { FiX } from "react-icons/fi";

const TaskModal = ({ isOpen, onClose, task, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    category: "Other",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        category: task.category || "Other",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        status: "todo",
        category: "Other",
        dueDate: "",
      });
    }
    // Clear any previous errors
    setError("");
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      let result;
      if (task) {
        // Update existing task
        result = await updateTask(task._id, formData);
      } else {
        // Create new task
        result = await createTask(formData);
      }

      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
      setError(err.message || "Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#111827]">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              placeholder="Task description"
              rows="4"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Urgent">Urgent</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#14B8A6] hover:bg-teal-600 text-white rounded-md shadow-sm transition-colors disabled:opacity-70"
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
