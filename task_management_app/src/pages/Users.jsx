"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { getUsers } from "../api";
import { FiUser, FiMail, FiUserCheck } from "react-icons/fi";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#14B8A6]"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-8 select-none">
          Team Members
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-10 text-center select-none">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Access Denied
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-8 select-none">
          Team Members
        </h1>
        <div className="bg-red-50 text-red-600 p-5 rounded-lg mb-6 shadow-sm border border-red-200 select-none">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-3 bg-[#14B8A6] hover:bg-teal-600 text-white rounded-md shadow-md transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-8 select-none">
        Team Members
      </h1>

      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white shadow-md rounded-xl p-5 flex flex-col space-y-3 border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-10 w-10 bg-[#14B8A6] rounded-full flex items-center justify-center text-white text-lg shadow-md">
                  <FiUser />
                </div>
                <div className="text-sm font-semibold text-[#111827] truncate">
                  {u.name}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <FiMail className="text-gray-400" />
                <span className="truncate">{u.email}</span>
              </div>

              <div>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm select-none ${
                    u.isAdmin
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {u.isAdmin ? "Admin" : "User"}
                </span>
              </div>

              <div className="flex items-center text-sm text-green-600 font-medium select-none">
                <FiUserCheck className="mr-2" />
                Active
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-10 text-center select-none">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            No users found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are no users in the system yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Users;
