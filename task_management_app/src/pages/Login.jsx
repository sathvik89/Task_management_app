import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      isValid = false;
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    }

    if (isValid) {
      console.log("Logging in:", formData);
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: "#FEF9F0" }}
    >
      <div className="text-center mb-10">
        <p className="text-sm text-[#14B8A6] font-medium tracking-wide">
          Manage all your tasks in one place!
        </p>
        <h1 className="text-4xl font-extrabold text-[#111827] mt-3 leading-snug">
          Task Manager App
        </h1>
        <div className="w-16 h-16 mx-auto mt-5 rounded-full bg-[#14B8A6] flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">TM</span>
        </div>
      </div>

      <div className="w-full max-w-md p-7 bg-white shadow-xl rounded-2xl border border-[#E5E7EB]">
        <h2 className="text-2xl font-bold text-[#111827] mb-3 text-center">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Keep all your credentials safe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <FiMail
                className="absolute left-3 top-3.5 text-[#14B8A6]"
                size={20}
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border text-sm text-[#111827] bg-white ${
                  errors.email
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#6EE7B7]"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <FiLock
                className="absolute left-3 top-3.5 text-[#14B8A6]"
                size={20}
              />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border text-sm text-[#111827] bg-white ${
                  errors.password
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#6EE7B7]"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#14B8A6] hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 transform hover:scale-[1.01]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
