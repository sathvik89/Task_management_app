import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Trash from "./pages/Trash";
import TaskDetails from "./pages/TaskDetails";
import Sidebar from "./Components/Sidebar";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

function MainFrame() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen relative overflow-x-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 bg-white shadow-md z-10">
        <Sidebar />
      </div>

      {/* Mobile hamburger button */}
      <button
        className="absolute top-4 left-4 md:hidden z-30 bg-white p-2 rounded-md shadow"
        onClick={() => setMobileOpen(true)}
      >
        <IoMenu size={24} />
      </button>

      {/* Sidebar and backdrop on mobile */}
      {mobileOpen && (
        <>
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40">
            <Sidebar />
          </div>
          <div
            className="fixed inset-0 bg-black opacity-40 z-30"
            onClick={() => setMobileOpen(false)}
          />
        </>
      )}

      {/* Page content */}
      <div className="flex-1 bg-[#fef9f0] p-4 z-0">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainFrame />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completedTasks/:status" element={<Tasks />} />
          <Route path="/inProgressTasks/:status" element={<Tasks />} />
          <Route path="/todoTasks/:status" element={<Tasks />} />
          <Route path="/users" element={<Users />} />
          <Route path="/bin" element={<Trash />} />
          <Route path="/TaskDetails/:id" element={<TaskDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
