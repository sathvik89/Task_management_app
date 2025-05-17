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
    <div className="relative bg-slate-50 rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300 ease-in-out w-full max-w-md mx-auto min-h-[220px]">
      <div className="aspect-[5/3] h-auto p-5 flex flex-col justify-between gap-4 sm:gap-5">
        <div className="flex justify-between items-start">
          <Link
            to={`/TaskDetails/${task._id}`}
            className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-colors truncate max-w-[75%]"
            title={task.title}
          >
            {task.title}
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              aria-label="Edit Task"
              className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-1"
              type="button"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete Task"
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
              type="button"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-sm sm:text-base leading-snug break-words line-clamp-3">
          {task.description || "No description"}
        </p>

        <div className="flex justify-between items-center gap-3 flex-wrap">
          <span
            className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full select-none ${
              task.status === "todo"
                ? "bg-amber-200 text-amber-800"
                : task.status === "in-progress"
                ? "bg-blue-200 text-blue-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {task.status === "todo"
              ? "To Do"
              : task.status === "in-progress"
              ? "In Progress"
              : "Completed"}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[50%] sm:max-w-[60%]">
            {task.category || "Other"}
          </span>
        </div>

        {task.dueDate && (
          <div className="flex items-center text-xs sm:text-sm text-teal-600 mt-1">
            <FiCalendar size={14} className="mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
