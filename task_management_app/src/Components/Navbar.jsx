import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../TaskContext";
import Profile from "./Profile";

const Navbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { updateFilters } = useTaskContext();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      updateFilters({ searchQuery: searchQuery.trim() });
      navigate("/tasks");
    }
  };

  return (
    <div className="bg-[#FEF9F0] sticky top-0 z-20 border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3 max-w-full">
      {/* Mobile view: menu, logo, profile */}
      <div className="flex items-center justify-between md:hidden">
        {/* Menu button */}
        <button
          aria-label="Open menu"
          onClick={onMenuClick}
          className="p-2 rounded-md text-[#14B8A6] hover:bg-teal-100 transition"
        >
          <IoMenu size={28} />
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-4xl font-semibold font-[Inter] pl-9 pt-2.5 tracking-wide text-gray-800 select-none">
            <span className="font-extrabold text-[#111827]">Task</span>
            <span className="text-[#14B8A6] font-bold">Ease</span>
          </h1>
        </div>

        {/* Profile icon */}
        <Profile />
      </div>

      {/* Desktop view: logo left, search middle, notifications + profile right */}
      <div className="hidden md:flex items-center justify-between max-w-[90vw] mx-auto">
        {/* Logo left */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold font-[Inter] tracking-wide text-gray-800 select-none">
            <span className="font-extrabold text-[#111827]">Task</span>
            <span className="text-[#14B8A6] font-bold">Ease</span>
          </h1>
        </div>

        {/* Search bar center */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 py-2 px-5 rounded-full bg-[#F0FDF4] border border-[#D1FAE5] shadow-sm focus-within:ring-2 focus-within:ring-[#14B8A6] transition w-[50%]"
        >
          <MdOutlineSearch className="text-[#14B8A6] text-2xl flex-shrink-0" />
          <input
            type="text"
            placeholder="Search tasks, team, projects..."
            className="flex-1 outline-none bg-transparent text-[#111827] placeholder:text-[#6B7280] text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className={`text-sm font-medium px-4 py-2 rounded-full border border-white text-white hover:border-teal-600 hover:text-teal-600 transition-colors duration-200 flex-shrink-0 ${
              searchQuery.trim()
                ? "bg-[#14B8A6] text-white hover:bg-teal-600"
                : "bg-teal-600 text-white cursor-not-allowed"
            }`}
            disabled={!searchQuery.trim()}
          >
            Search
          </button>
        </form>

        {/* Right side: Notifications + Profile */}
        <div className="flex items-center gap-6">
          {/* Notification button - desktop only */}
          <button
            aria-label="Notifications"
            className="relative text-[#14B8A6] hover:text-[#0d9488] transition-colors duration-200 text-3xl"
          >
            <IoNotificationsOutline />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-[#FEF9F0]" />
          </button>

          {/* Profile */}
          <Profile />
        </div>
      </div>

      {/* Search bar niche for mobile */}
      <form
        onSubmit={handleSearch}
        className="mt-4 flex items-center gap-2 py-2 px-4 rounded-full bg-[#F0FDF4] border border-[#D1FAE5] shadow-sm focus-within:ring-2 focus-within:ring-[#14B8A6] transition w-full md:hidden"
      >
        <MdOutlineSearch className="text-[#14B8A6] text-xl flex-shrink-0" />
        <input
          type="text"
          placeholder="Search tasks, team, projects..."
          className="flex-1 outline-none bg-transparent text-[#111827] placeholder:text-[#6B7280] text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className={`text-xs font-medium px-3 py-1.5 rounded-full border border-white text-white hover:border-teal-600 hover:text-teal-600 transition-colors duration-200 flex-shrink-0 ${
            searchQuery.trim()
              ? "bg-[#14B8A6] text-white hover:bg-teal-600"
              : "bg-teal-600 text-white cursor-not-allowed"
          }`}
          disabled={!searchQuery.trim()}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Navbar;
