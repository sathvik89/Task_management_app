import { useState, useEffect } from "react";
import { FiX, FiUser, FiMail } from "react-icons/fi";
import { updateUserProfile } from "../api";
import { useAuth } from "../AuthContext";
import Button from "./Button";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, setCredentials } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
    // Clear messages when modal opens/closes
    setError("");
    setSuccess("");
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate inputs
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }

      const updatedUser = await updateUserProfile(formData);

      // Update user in context/localStorage
      setCredentials(updatedUser, localStorage.getItem("token"));
      setSuccess("Profile updated successfully!");

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto
                  ring-1 ring-black ring-opacity-5
                  flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <header className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2
            id="profile-modal-title"
            className="text-2xl font-extrabold text-gray-900 tracking-tight"
          >
            My Profile
          </h2>
          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <FiX size={22} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 flex-grow flex flex-col"
        >
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm font-medium shadow-sm animate-fadeIn">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-medium shadow-sm animate-fadeIn">
              {success}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <div
              className="w-28 h-28 rounded-full bg-teal-600 flex items-center justify-center
                     text-white text-5xl font-bold select-none shadow-lg
                     ring-4 ring-teal-300/60"
              aria-label="User avatar with initial"
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <div className="space-y-1 w-full">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-800"
            >
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 text-lg" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl
                       shadow-sm placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500
                       transition duration-200 ease-in-out text-gray-900 font-medium"
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-1 w-full">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 text-lg" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl
                       bg-gray-100 text-gray-500 cursor-not-allowed
                       shadow-inner
                       focus:outline-none focus:ring-0 focus:border-gray-300
                       transition duration-200 ease-in-out font-medium"
                aria-disabled="true"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 italic select-none">
              Email cannot be changed
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-semibold
                     bg-teal-600 text-white rounded-lg shadow-md
                     hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50
                     transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
