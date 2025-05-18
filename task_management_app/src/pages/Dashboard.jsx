"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useTaskContext } from "../TaskContext";
import { Link } from "react-router-dom";
// import {Link} from "react-router-dom"; import{" "}
//       {(FiList, FiClock, FiActivity, FiCheckCircle)} from "react-icons/fi"; //
//       Inside your Dashboard component:
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiList,
  FiRefreshCw,
  FiActivity,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";
import { MdOutlineAddTask } from "react-icons/md";
import TaskModal from "../Components/TaskModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, fetchStats, error: statsError } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState("");

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

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, [fetchStats]);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate completion rate
  const completionRate = stats.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  // Get urgent tasks (tasks due today or overdue)
  const getUrgentTasksCount = () => {
    if (!stats.upcomingTasks) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return stats.upcomingTasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate <= today && task.status !== "completed";
    }).length;
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
            {greeting}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#14B8A6] hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
        >
          <MdOutlineAddTask size={20} />
          <span>add New Task</span>
        </button>
      </div>
      {/* Stats Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Link
          to="/tasks"
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
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
        </Link>

        <Link
          to="/todoTasks/todo"
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
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
        </Link>

        <Link
          to="/inProgressTasks/in-progress"
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <h3 className="text-3xl font-bold text-[#111827] mt-1">
                {stats.inProgressTasks}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8F4FD] flex items-center justify-center">
              <FiActivity className="text-blue-500 text-xl" />
            </div>
          </div>
        </Link>

        <Link
          to="/completedTasks/completed"
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
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
        </Link>
      </div>
      {/* Middle Section - Progress and Urgent Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">
            Progress Overview
          </h2>

          <div className="space-y-4">
            {/* Completion Rate */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Completion Rate
                </span>
                <span className="text-sm font-medium text-[#14B8A6]">
                  {completionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#14B8A6] h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Task Distribution */}
            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Task Distribution
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[120px] bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <FiClock className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">To Do</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {stats.todoTasks}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-[120px] bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiActivity className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">In Progress</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {stats.inProgressTasks}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-[120px] bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCheckCircle className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {stats.completedTasks}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#111827]">Urgent Tasks</h2>
            <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
              <FiAlertCircle size={14} />
              <span>{getUrgentTasksCount()} tasks</span>
            </div>
          </div>

          <div className="space-y-3">
            {stats.upcomingTasks && stats.upcomingTasks.length > 0 ? (
              stats.upcomingTasks
                .filter((task) => {
                  if (!task.dueDate) return false;
                  const dueDate = new Date(task.dueDate);
                  dueDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return dueDate <= today && task.status !== "completed";
                })
                .slice(0, 3)
                .map((task) => (
                  <Link
                    to={`/TaskDetails/${task._id}`}
                    key={task._id}
                    className="block p-3 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800">
                        {task.title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700`}
                      >
                        Urgent
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {task.category || "Other"}
                      </span>
                      <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                        <FiCalendar size={12} />
                        {task.dueDate
                          ? formatDate(task.dueDate)
                          : "No due date"}
                      </span>
                    </div>
                  </Link>
                ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No urgent tasks</p>
              </div>
            )}

            {getUrgentTasksCount() > 3 && (
              <Link
                to="/tasks"
                className="block text-center text-sm text-[#14B8A6] hover:text-teal-700 font-medium mt-2"
              >
                View all urgent tasks
              </Link>
            )}
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
      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-[#111827]">Recent Activity</h2>
          <div className="text-xs font-medium text-[#14B8A6] bg-[#E0F2F1] px-2 py-1 rounded-full">
            Last 7 days
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
              <FiCheckCircle className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-800">
                You completed{" "}
                <span className="font-medium">{stats.completedTasks}</span>{" "}
                tasks
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Keep up the good work!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
              <FiTrendingUp className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-800">
                Your productivity increased by{" "}
                <span className="font-medium">15%</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Compared to last week
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mt-1">
              <FiClock className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-800">
                You have{" "}
                <span className="font-medium">
                  {stats.todoTasks + stats.inProgressTasks}
                </span>{" "}
                tasks pending
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Focus on completing high priority tasks first
              </p>
            </div>
          </div>
        </div>
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
