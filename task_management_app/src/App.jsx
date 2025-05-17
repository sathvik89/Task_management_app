"use client";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Trash from "./pages/Trash";
import TaskDetails from "./pages/TaskDetails";
import Sidebar from "./Components/Sidebar";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import Navbar from "./Components/Navbar";

function MainFrame() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#FEF9F0] text-[#111827] relative overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-[#FEF9F0] border-r border-gray-200 shadow-md z-20">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      {!mobileOpen && (
        <button
          className="absolute top-4 left-4 md:hidden z-40 bg-white p-2 rounded-md shadow-md border border-gray-200"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <IoMenu size={24} className="text-[#14B8A6]" />
        </button>
      )}

      {/* Mobile Sidebar + Backdrop */}
      {mobileOpen && (
        <>
          <aside className="fixed top-0 left-0 w-64 h-full bg-[#FEF9F0] shadow-lg z-50">
            <Sidebar />
          </aside>
          <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu backdrop"
          />
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <div className="sticky top-0 z-30">
          <Navbar isMobileMenuOpen={mobileOpen} />
        </div>
        <div className="flex-1 px-4 py-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainFrame />}>
          <Route path="/" element={<Navigate to="/login" />} />
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
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
