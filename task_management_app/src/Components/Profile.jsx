import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ProfileModal from "./ProfileModal";
import PasswordModal from "./PasswordModal";

const Profile = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-teal-600 shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-colors duration-300">
            <span className="text-white font-semibold select-none tracking-wide">
              {getInitials()}
            </span>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-2xl ring-1 ring-black/10 focus:outline-none">
            <div className="p-4 space-y-3">
              {/* User info section */}
              <div className="px-3 py-2 border-b border-gray-200 mb-2">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <Menu.Item>
                {() => (
                  <button
                    onClick={() => setOpenProfile(true)}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-900 rounded-lg hover:bg-teal-100 focus:bg-teal-100 focus:outline-none transition-colors duration-200"
                  >
                    <FaUser className="text-teal-600 flex-shrink-0" />
                    My Profile
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {() => (
                  <button
                    onClick={() => setOpenPassword(true)}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-900 rounded-lg hover:bg-teal-100 focus:bg-teal-100 focus:outline-none transition-colors duration-200"
                  >
                    <FaUserLock className="text-teal-600 flex-shrink-0" />
                    Update Password
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {() => (
                  <button
                    onClick={logoutHandler}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors duration-200"
                  >
                    <TbLogout2 className="flex-shrink-0" />
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
      />

      {/* Password Modal */}
      <PasswordModal
        isOpen={openPassword}
        onClose={() => setOpenPassword(false)}
      />
    </div>
  );
};

export default Profile;
