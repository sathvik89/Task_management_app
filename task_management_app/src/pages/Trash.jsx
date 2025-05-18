"use client";

import { useEffect, useState } from "react";
import { useTaskContext } from "../TaskContext";
import { restoreTask, permanentDeleteTask } from "../api";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";

const Trash = () => {
  const { deletedTasks, fetchDeletedTasks } = useTaskContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      await fetchDeletedTasks();
      setLoading(false);
    };

    loadTasks();
  }, []);

  const handleRestore = async (id) => {
    try {
      await restoreTask(id);
      fetchDeletedTasks();
    } catch (err) {
      console.error("Error restoring task:", err);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        await permanentDeleteTask(id);
        fetchDeletedTasks();
      } catch (err) {
        console.error("Error permanently deleting task:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-8 select-none">
        Trash
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#14B8A6]"></div>
        </div>
      ) : deletedTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deletedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {task.description || "No description"}
                </p>
              </div>
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  {task.category || "Other"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Due:</span>{" "}
                  {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 mt-auto">
                <button
                  onClick={() => handleRestore(task._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#E0F2F1] text-[#14B8A6] hover:bg-[#CCFBF1] rounded-lg text-sm font-medium shadow-sm transition-all"
                >
                  <FiRefreshCw size={16} />
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(task._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-medium shadow-sm transition-all"
                >
                  <FiTrash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-10 text-center select-none">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Trash is empty
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Items you delete will appear here for 30 days before being
            permanently removed.
          </p>
        </div>
      )}
    </div>
  );
};

export default Trash;
