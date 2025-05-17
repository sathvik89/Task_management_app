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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-8 select-none">
        Trash
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#14B8A6]"></div>
        </div>
      ) : deletedTasks.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider select-none"
                  >
                    Task
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider select-none"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider select-none"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider select-none"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deletedTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-4 whitespace-normal md:whitespace-nowrap max-w-xs md:max-w-full">
                      <div className="text-sm font-semibold text-[#111827] truncate">
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2 md:line-clamp-1">
                        {task.description || "No description"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.category || "Other"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRestore(task._id)}
                          className="p-2 text-[#14B8A6] hover:bg-[#E0F2F1] rounded-lg transition-colors shadow-sm"
                          title="Restore"
                          aria-label="Restore task"
                        >
                          <FiRefreshCw size={18} />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(task._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                          title="Delete Permanently"
                          aria-label="Delete task permanently"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
