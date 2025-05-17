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
          <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-[#14B8A6] shadow hover:bg-teal-600 transition-colors">
            <span className="text-white font-semibold">{getInitials()}</span>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="p-3 space-y-1">
              {/* User info section */}
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="font-medium text-[#111827]">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <Menu.Item>
                {() => (
                  <button
                    onClick={() => setOpenProfile(true)}
                    className="flex items-center w-full gap-2 px-3 py-2 text-sm text-[#111827] hover:bg-[#DCFCE7] rounded-md"
                  >
                    <FaUser className="text-[#14B8A6]" />
                    My Profile
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {() => (
                  <button
                    onClick={() => setOpenPassword(true)}
                    className="flex items-center w-full gap-2 px-3 py-2 text-sm text-[#111827] hover:bg-[#DCFCE7] rounded-md"
                  >
                    <FaUserLock className="text-[#14B8A6]" />
                    Update Password
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {() => (
                  <button
                    onClick={logoutHandler}
                    className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <TbLogout2 />
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
