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
      setFormData({
        title: "",
        description: "",
        status: "todo",
        category: "Other",
        dueDate: "",
      });
    }
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
        result = await updateTask(task._id, formData);
      } else {
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
    <>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out both;
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#0a2540] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
          <div className="flex justify-between items-center p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-white">
            {error && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm border border-red-400/40">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/30 rounded-lg text-sm bg-[#0a2540] text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Task title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-white/30 rounded-lg text-sm bg-[#0a2540] text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Task description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-white/30 rounded-lg text-sm bg-[#0a2540] text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-white/30 rounded-lg text-sm bg-[#0a2540] text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/30 rounded-lg text-sm bg-[#0a2540] text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-white/40 rounded-lg text-sm text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-md text-sm transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskModal;
