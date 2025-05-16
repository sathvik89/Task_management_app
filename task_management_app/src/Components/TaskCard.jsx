"use client";
import { Link } from "react-router-dom";
import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteTask } from "../api";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to move this task to trash?")) {
      try {
        await deleteTask(task._id);
        if (onDelete) onDelete();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <Link
            to={`/TaskDetails/${task._id}`}
            className="text-lg font-medium text-[#111827] hover:text-[#14B8A6] transition-colors line-clamp-1"
          >
            {task.title}
          </Link>
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-[#14B8A6] hover:bg-[#E0F2F1] rounded-full transition-colors"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {task.description || "No description"}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
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
          <span className="text-xs text-gray-500">
            {task.category || "Other"}
          </span>
        </div>

        {task.dueDate && (
          <div className="mt-3 flex items-center text-xs text-[#14B8A6]">
            <FiCalendar size={12} className="mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
