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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#111827]">My Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-[#14B8A6] flex items-center justify-center text-white text-3xl font-semibold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#14B8A6]" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#14B8A6]" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-[#14B8A6] focus:border-[#14B8A6]"
                disabled // Email cannot be changed
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
