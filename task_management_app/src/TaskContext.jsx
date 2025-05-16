"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getTasks, getTaskStats, getDeletedTasks } from "./api";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    upcomingTasks: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    sortBy: "createdAt",
  });

  // Fetch tasks based on current filters
  const fetchTasks = useCallback(async () => {
    if (!user) return; // Don't fetch if not logged in

    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(filters);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message || "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  // Fetch task statistics
  const fetchStats = useCallback(async () => {
    if (!user) return; // Don't fetch if not logged in

    try {
      const data = await getTaskStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching task stats:", err);
      // Don't set error here to avoid blocking the UI
    }
  }, [user]);

  // Fetch deleted tasks
  const fetchDeletedTasks = useCallback(async () => {
    if (!user) return; // Don't fetch if not logged in

    try {
      const data = await getDeletedTasks();
      setDeletedTasks(data);
    } catch (err) {
      console.error("Error fetching deleted tasks:", err);
      // Don't set error here to avoid blocking the UI
    }
  }, [user]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Effect to fetch tasks when filters change or user logs in
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [fetchTasks, user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        deletedTasks,
        stats,
        loading,
        error,
        filters,
        updateFilters,
        fetchTasks,
        fetchStats,
        fetchDeletedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
