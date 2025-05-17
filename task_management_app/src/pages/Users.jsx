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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["User", "Email", "Role", "Status"].map((title) => (
                    <th
                      key={title}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide select-none"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-4 whitespace-normal md:whitespace-nowrap max-w-xs md:max-w-full">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#14B8A6] rounded-full flex items-center justify-center text-white text-lg shadow-md">
                          <FiUser />
                        </div>
                        <div className="text-sm font-semibold text-[#111827] truncate max-w-[150px] sm:max-w-xs md:max-w-none">
                          {u.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-normal md:whitespace-nowrap text-sm text-gray-600 max-w-[200px] sm:max-w-md truncate">
                      <div className="flex items-center space-x-2">
                        <FiMail className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm select-none ${
                          u.isAdmin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-green-600 font-medium select-none">
                        <FiUserCheck className="mr-2" />
                        Active
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
