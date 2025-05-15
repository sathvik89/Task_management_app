import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../AuthContext";

const linkData = [
  {
    label: "Dashboard",
    link: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "/tasks",
    icon: <FaTasks />,
  },
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
  {
    label: "Team",
    link: "/users",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    link: "/bin",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useAuth();
  // console.log("Sidebar user:", user);
  const location = useLocation();
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5 bg-[#FEF9F0] border-r border-gray-200">
      <div className="flex gap-2 items-center">
        <div className="bg-[#14B8A6] text-4xl font-extrabold p-3 rounded-full shadow">
          📚
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">TaskEase</h1>
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-6">
        {sidebarLinks.map((item) => {
          const isActive = location.pathname.startsWith(item.link);
          return (
            <Link
              key={item.label}
              to={item.link}
              className={clsx(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-[#111827] hover:bg-[#E0F2F1] transition",
                isActive && "bg-[#14B8A6] text-white"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4">
        <button className="w-full flex gap-2 p-2 items-center text-lg text-[#111827] hover:text-[#14B8A6]">
          <MdSettings />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
