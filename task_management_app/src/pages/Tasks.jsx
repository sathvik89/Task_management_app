"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTaskContext } from "../TaskContext";
import TaskCard from "../Components/TaskCard";
import TaskModal from "../Components/TaskModal";
import { MdOutlineAddTask } from "react-icons/md";
import { FiFilter } from "react-icons/fi";

const Tasks = () => {
  const { status } = useParams();
  const { tasks, loading, error, filters, updateFilters, fetchTasks } =
    useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status) {
      updateFilters({ status });
    } else {
      updateFilters({ status: "" });
    }
  }, [status]);

  const handleEditTask = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const getPageTitle = () => {
    if (status === "completed") return "Completed Tasks";
    if (status === "in-progress") return "In Progress Tasks";
    if (status === "todo") return "To Do Tasks";
    return "All Tasks";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
          {getPageTitle()}
        </h1>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
          >
            <FiFilter size={18} />
            <span>Filter</span>
          </button>
          <button
            onClick={() => {
              setEditTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <MdOutlineAddTask size={20} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6] text-sm"
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6] text-sm"
              >
                <option value="">All Categories</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Urgent">Urgent</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6] text-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14B8A6]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => fetchTasks()}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 mb-4">
            {status
              ? `You don't have any ${status} tasks yet.`
              : "You don't have any tasks yet."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <MdOutlineAddTask size={20} />
            <span>Create your first task</span>
          </button>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTask(null);
        }}
        task={editTask}
        onSuccess={() => {
          fetchTasks();
          setEditTask(null);
        }}
      />
    </div>
  );
};

export default Tasks;
