"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask, deleteTask } from "../api";
import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import TaskModal from "../Components/TaskModal";
export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTaskById(id);
        setTask(data);
      } catch (err) {
        console.error("Error loading task:", err);
        setError("Couldn't fetch task. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateTask(id, { ...task, status: newStatus });
      setTask(updated);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirm) return;

    try {
      await deleteTask(id);
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-[#14B8A6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }

  if (!task) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-lg font-semibold text-gray-700">Task not found</h2>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
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
                className="p-2 text-gray-500 hover:text-[#14B8A6] hover:bg-gray-100 rounded-full"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full"
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

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-[#111827] mb-3">
              Change Status
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleStatusChange("todo")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  task.status === "todo"
                    ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-amber-50"
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => handleStatusChange("in-progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-green-50"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>
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
}
