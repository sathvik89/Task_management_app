"use client"

import { useRef, useState } from "react"
import { FiMail, FiLock } from "react-icons/fi"
import Button from "../Components/Button"
import { login } from "../api"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../AuthContext"

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const navigate = useNavigate()
  const { setCredentials } = useAuth()

  const validate = () => {
    let isValid = true
    const newErrors = {
      email: "",
      password: "",
    }

    if (!emailRef.current.value.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    }

    if (!passwordRef.current.value.trim()) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError("")

    if (!validate()) return

    setIsLoading(true)
    try {
      const res = await login(emailRef.current.value, passwordRef.current.value)

      if (res?.user) {
        setCredentials(res.user, res.token) // Save to context + localStorage
        navigate("/dashboard")
      } else {
        setApiError("Login failed: No user returned")
      }
    } catch (error) {
      console.error("Login error:", error)
      setApiError(error.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ backgroundColor: "#FEF9F0" }}>
      <div className="text-center mb-10">
        <p className="text-sm text-[#14B8A6] font-large tracking-wide">Manage all your tasks in one place!</p>
        <h1 className="text-5xl font-extrabold text-[#111827] mt-3 leading-snug">Task Manager App</h1>
        <div className="w-16 h-16 mx-auto mt-5 rounded-full bg-[#14B8A6] flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">TM</span>
        </div>
      </div>

      <div className="w-full max-w-md p-7 bg-white shadow-xl rounded-2xl border border-[#E5E7EB]">
        <h2 className="text-2xl font-bold text-[#111827] mb-3 text-center">Welcome back</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Keep all your credentials safe.</p>

        {apiError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{apiError}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3 text-[#14B8A6]" size={20} />
              <input
                ref={emailRef}
                type="email"
                id="email"
                placeholder="email@example.com"
                className={`pl-10 pr-4 py-2 w-full rounded-lg border text-sm text-[#111827] bg-white ${
                  errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-[#6EE7B7]"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3 text-[#14B8A6]" size={20} />
              <input
                ref={passwordRef}
                type={showPass ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className={`pl-10 pr-4 py-2 w-full rounded-lg border text-sm text-[#111827] bg-white ${
                  errors.password ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-[#6EE7B7]"
                } focus:outline-none focus:ring-2`}
              />
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-3 hover:cursor-pointer text-sm text-[#14B8A6] font-medium focus:outline-none hover:text-teal-700 transition-colors duration-200"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          <div className="text-right mt-2">
            <span
              onClick={() => {
                //still need to add the forgot password 
                console.log("Forgot password clicked")
              }}
              className="text-sm text-[#14B8A6] hover:text-teal-700 font-medium cursor-pointer transition-colors duration-200"
            >
              Forgot Password?
            </span>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#14B8A6] hover:text-teal-700 font-medium">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
