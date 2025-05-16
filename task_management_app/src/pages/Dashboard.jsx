// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../api";
// import { useAuth } from "../AuthContext";

// const Dashboard = () => {
//   const { user, logout: handleLogout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogoutClick = async () => {
//     try {
//       await logout();
//       handleLogout();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Welcome, {user?.name}</h1>
//       <button onClick={handleLogoutClick}>Logout</button>
//     </div>
//   );
// };

// export default Dashboard;
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useTaskContext } from "../TaskContext";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiList,
  FiRefreshCw,
} from "react-icons/fi";
import { MdOutlineAddTask } from "react-icons/md";
import TaskModal from "../Components/TaskModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, fetchStats, error: statsError } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchStats();
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [fetchStats]);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14B8A6]"></div>
      </div>
    );
  }

  if (error || statsError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error || statsError}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#14B8A6] hover:bg-teal-600 text-white rounded-md shadow-sm transition-colors flex items-center gap-2"
        >
          <FiRefreshCw size={16} />
          Refresh Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your tasks</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#14B8A6] hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
        >
          <MdOutlineAddTask size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <h3 className="text-3xl font-bold text-[#111827] mt-1">
                {stats.totalTasks}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E0F2F1] flex items-center justify-center">
              <FiList className="text-[#14B8A6] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">To Do</p>
              <h3 className="text-3xl font-bold text-[#111827] mt-1">
                {stats.todoTasks}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center">
              <FiClock className="text-amber-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <h3 className="text-3xl font-bold text-[#111827] mt-1">
                {stats.inProgressTasks}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8F4FD] flex items-center justify-center">
              <FiCalendar className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h3 className="text-3xl font-bold text-[#111827] mt-1">
                {stats.completedTasks}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E6F6F4] flex items-center justify-center">
              <FiCheckCircle className="text-[#14B8A6] text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-[#111827]">Upcoming Tasks</h2>
          <Link
            to="/tasks"
            className="text-[#14B8A6] hover:text-teal-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {stats.upcomingTasks && stats.upcomingTasks.length > 0 ? (
          <div className="space-y-4">
            {stats.upcomingTasks.map((task) => (
              <Link
                to={`/TaskDetails/${task._id}`}
                key={task._id}
                className="block p-4 border border-gray-100 rounded-lg hover:bg-[#F0FDF4] transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#111827]">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {task.description || "No description"}
                    </p>
                  </div>
                  <div className="flex items-center">
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
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {task.category || "Other"}
                  </span>
                  <span className="text-xs font-medium text-[#14B8A6] flex items-center gap-1">
                    <FiCalendar size={12} />
                    {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming tasks</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 text-[#14B8A6] hover:text-teal-700 font-medium"
            >
              Create a new task
            </button>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchStats();
        }}
      />
    </div>
  );
};

export default Dashboard;
