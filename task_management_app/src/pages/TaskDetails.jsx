"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask, deleteTask } from "../api";
import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import TaskModal from "../Components/TaskModal";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(id);
        setTask(data);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = await updateTask(id, { ...task, status: newStatus });
      setTask(updatedTask);
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        navigate("/tasks");
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#14B8A6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md mx-auto mt-8 text-center shadow-md">
        {error}
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto mt-8">
        <h3 className="text-xl font-semibold text-gray-700">Task not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-0">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {task.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span
                className={`inline-block text-sm font-semibold px-4 py-1 rounded-full tracking-wide ${
                  task.status === "todo"
                    ? "bg-amber-100 text-amber-700"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.status === "todo"
                  ? "To Do"
                  : task.status === "in-progress"
                  ? "In Progress"
                  : "Completed"}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {task.category || "Other"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 items-center sm:items-start">
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Edit Task"
              className="p-3 rounded-full text-gray-500 hover:text-[#14B8A6] hover:bg-gray-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
            >
              <FiEdit2 size={20} />
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete Task"
              className="p-3 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-gray-500 mb-6">
            <FiCalendar size={18} />
            <span className="text-md font-medium">
              Due: {formatDate(task.dueDate)}
            </span>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line min-h-[6rem]">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Status Change */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Change Status
            </h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleStatusChange("todo")}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-lg text-sm font-semibold transition-colors border-2 ${
                  task.status === "todo"
                    ? "bg-amber-100 text-amber-700 border-amber-300 shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-amber-50 hover:border-amber-400"
                } focus:outline-none focus:ring-2 focus:ring-amber-300`}
              >
                To Do
              </button>
              <button
                onClick={() => handleStatusChange("in-progress")}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-lg text-sm font-semibold transition-colors border-2 ${
                  task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700 border-blue-300 shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-300`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange("completed")}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-lg text-sm font-semibold transition-colors border-2 ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700 border-green-300 shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-400"
                } focus:outline-none focus:ring-2 focus:ring-green-300`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        onSuccess={(updatedTask) => {
          setTask(updatedTask);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default TaskDetails;
