import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../TaskContext";
import Profile from "./Profile";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { updateFilters } = useTaskContext();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Update filters with search query
      updateFilters({ searchQuery: searchQuery.trim() });

      // Navigate to tasks page to show results
      navigate("/tasks");
    }
  };

  return (
    <div className="flex justify-between items-center bg-[#FEF9F0] px-6 py-3 sticky top-0 z-20 shadow-sm border-b border-gray-200">
      {/* Left side: Logo + Search */}
      <div className="flex items-center gap-6 w-full max-w-4xl">
        {/* Logo area */}
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-[#14B8A6] text-2xl font-extrabold p-2 rounded-full shadow">
            📚
          </div>
          <h1 className="text-xl font-bold text-[#111827]">TaskEase</h1>
        </div>

        {/* Search input */}
        <form
          onSubmit={handleSearch}
          className="flex items-center flex-1 max-w-md gap-3 py-2 px-5 rounded-full bg-[#F0FDF4] border border-[#D1FAE5] shadow-sm focus-within:ring-2 focus-within:ring-[#14B8A6] transition"
        >
          <MdOutlineSearch className="text-[#14B8A6] text-2xl" />
          <input
            type="text"
            placeholder="Search tasks, team, projects..."
            className="flex-1 outline-none bg-transparent text-[#111827] placeholder:text-[#6B7280] text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className={`text-sm font-medium rounded-full px-3 py-1 transition-colors ${
              searchQuery.trim()
                ? "bg-[#14B8A6] text-white hover:bg-teal-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!searchQuery.trim()}
          >
            Search
          </button>
        </form>
      </div>

      {/* Right side: Notifications + Profile */}
      <div className="flex items-center gap-6">
        <button
          aria-label="Notifications"
          className="relative text-[#14B8A6] hover:text-[#0d9488] transition-colors duration-200 text-2xl"
        >
          <IoNotificationsOutline />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#FEF9F0]" />
        </button>

        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
