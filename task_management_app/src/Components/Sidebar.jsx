import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import clsx from "clsx";
import { useAuth } from "../AuthContext";
import SettingsModal from "./SettingsModal";

const linkData = [
  { label: "Dashboard", link: "/dashboard", icon: <MdDashboard /> },
  { label: "Tasks", link: "/tasks", icon: <FaTasks /> },
  {
    label: "Completed",
    link: "/completedTasks/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "/inProgressTasks/in-progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "/todoTasks/todo",
    icon: <MdOutlinePendingActions />,
  },
  { label: "Recently Deleted", link: "/bin", icon: <FaTrashAlt /> },
  { label: "Team", link: "/users", icon: <FaUsers /> },
];

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0);

  return (
    <>
      <aside className="w-full h-full flex flex-col bg-[#FEF9F0] border-r border-gray-200 rounded-tr-3xl rounded-br-3xl shadow-inner overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="bg-[#14B8A6] text-3xl p-3 rounded-full shadow text-white">
            📚
          </div>
          <h1 className="text-2xl font-semibold font-[Inter] tracking-wide text-gray-800">
            <span className="font-extrabold text-[#111827]">Task</span>
            <span className="text-[#14B8A6] font-bold">Ease</span>
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1 text-[15px] font-medium text-gray-700">
          {sidebarLinks.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.link);
            const dividers = [0, 1, 4, 6]; // positions after which to place a line

            return (
              <React.Fragment key={item.label}>
                <Link
                  to={item.link}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition",
                    isActive
                      ? "bg-[#14B8A6] text-white shadow-md"
                      : "hover:bg-teal-100 hover:text-[#14B8A6]"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
                {dividers.includes(idx) && (
                  <hr className="my-2 border-gray-200" />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="border-t border-gray-300 p-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-start gap-3 px-4 py-2 rounded-lg text-gray-700 hover:text-teal-700 hover:bg-teal-50 transition text-sm font-medium"
          >
            <MdSettings className="text-lg" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Sidebar;
