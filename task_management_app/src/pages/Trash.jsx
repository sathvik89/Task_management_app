"use client"

import { useEffect, useState } from "react"
import { useTaskContext } from "../TaskContext"
import { restoreTask, permanentDeleteTask } from "../api"
import { FiTrash2, FiRefreshCw } from "react-icons/fi"

const Trash = () => {
  const { deletedTasks, fetchDeletedTasks } = useTaskContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      await fetchDeletedTasks()
      setLoading(false)
    }

    loadTasks()
  }, [])

  const handleRestore = async (id) => {
    try {
      await restoreTask(id)
      fetchDeletedTasks()
    } catch (err) {
      console.error("Error restoring task:", err)
    }
  }

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        await permanentDeleteTask(id)
        fetchDeletedTasks()
      } catch (err) {
        console.error("Error permanently deleting task:", err)
      }
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6">Trash</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14B8A6]"></div>
        </div>
      ) : deletedTasks.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deletedTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#111827]">{task.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {task.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{task.category || "Other"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRestore(task._id)}
                          className="p-1.5 text-[#14B8A6] hover:bg-[#E0F2F1] rounded-full transition-colors"
                          title="Restore"
                        >
                          <FiRefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(task._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Permanently"
                        >
                          <FiTrash2 size={16} />
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
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Trash is empty</h3>
          <p className="text-gray-500">
            Items you delete will appear here for 30 days before being permanently removed.
          </p>
        </div>
      )}
    </div>
  )
}

export default Trash
