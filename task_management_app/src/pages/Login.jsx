"use client";

import { useRef, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import Button from "../Components/Button";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { setCredentials } = useAuth();

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!emailRef.current.value.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!passwordRef.current.value.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  console.log(isAdmin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await login(
        emailRef.current.value,
        passwordRef.current.value
      );

      if (res?.user) {
        setCredentials(res.user, res.token);
        navigate("/dashboard");
      } else {
        setApiError("Login failed: No user returned");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError(
        error.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === "admin") {
      emailRef.current.value = "boss@gmail.com";
      passwordRef.current.value = "boss@1234";
      setIsAdmin(true);
    } else {
      emailRef.current.value = "user@gmail.com";
      passwordRef.current.value = "user@1234";
      setIsAdmin(false);
    }
    setErrors({ email: "", password: "" });
    setApiError("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f0] via-[#f0f9ff] to-[#fefce8] px-4 py-12 overflow-hidden">
      {/* Beautiful animated blurred background blobs */}
      <div className="absolute top-[-50px] left-[-50px] w-[350px] h-[350px] bg-[#14B8A6] opacity-30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute top-[80px] right-[30px] w-[250px] h-[250px] bg-[#60A5FA] opacity-30 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-100px] left-[100px] w-[300px] h-[300px] bg-[#F472B6] opacity-30 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#14B8A6] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">TM</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Task Manager App
          </h1>
          <p className="text-s text-[#14B8A6] font-extrabold">
            Stay organized. Stay productive.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-8 shadow-2xl rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 text-center mb-5">
            Enter your credentials to continue
          </p>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3 text-[#14B8A6]" size={20} />
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="email@example.com"
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border text-sm text-gray-800 bg-white ${
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
              <div className="relative flex items-center">
                <FiLock className="absolute left-3 text-[#14B8A6]" size={20} />
                <input
                  ref={passwordRef}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border text-sm text-gray-800 bg-white ${
                    errors.password
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#6EE7B7]"
                  } focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-3 text-sm text-[#14B8A6] font-medium focus:outline-none hover:text-teal-700 transition"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="text-right mt-2">
              <span
                onClick={() => alert("Please register again")}
                className="text-sm text-[#14B8A6] hover:text-teal-700 font-medium cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Account Buttons */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-3">
              Or try with demo accounts
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => fillDemoCredentials("user")}
                className="flex-1 py-2 px-3 border border-[#14B8A6] bg-white rounded-lg text-sm font-medium text-[#14B8A6] hover:bg-[#D1FAE5] hover:shadow-md transition-all duration-200"
              >
                Demo User
              </button>
              <button
                onClick={() => fillDemoCredentials("admin")}
                className="flex-1 py-2 px-3 border border-[#14B8A6] bg-white rounded-lg text-sm font-medium text-[#14B8A6] hover:bg-[#D1FAE5] hover:shadow-md transition-all duration-200"
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#14B8A6] hover:text-teal-700 font-medium"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}