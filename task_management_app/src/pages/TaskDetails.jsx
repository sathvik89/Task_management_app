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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14B8A6]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700">Task not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">
                {task.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
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
                <span className="text-sm text-gray-500">
                  {task.category || "Other"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-gray-500 hover:text-[#14B8A6] hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <FiCalendar size={16} />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#111827] mb-2">
              Description
            </h3>
            <p className="text-gray-600 whitespace-pre-line">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Status Change */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-[#111827] mb-3">
              Change Status
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleStatusChange("todo")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  task.status === "todo"
                    ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-amber-50"
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => handleStatusChange("in-progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-blue-50"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-green-50"
                }`}
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
