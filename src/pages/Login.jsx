"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../main"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  // 🌐 Change this to your Render backend URL
  const BACKEND_URL = "https://uvify-backend.onrender.com"

  useEffect(() => {
    const savedEmail = getCookie("uvify_email")
    const savedPassword = getCookie("uvify_password")
    const wasRemembered = getCookie("uvify_remember_me") === "true"

    if (savedEmail && savedPassword) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        password: savedPassword,
      }))
      setRememberMe(wasRemembered)
    }
  }, [])

  const setCookie = (name, value, days = 30) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  const getCookie = (name) => {
    const nameEQ = name + "="
    const cookies = document.cookie.split(";")
    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length)
      }
    }
    return ""
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Login attempt started")

    try {
      const url = `${BACKEND_URL}/auth/login`
      const body = { email: formData.email, password: formData.password }

      console.log("[v0] Sending request to:", url)

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      console.log("[v0] Response received:", data)

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong")
        console.log("[v0] Login failed:", data.message)
        setIsLoading(false)
        return
      }

      if (rememberMe) {
        setCookie("uvify_email", formData.email, 30)
        setCookie("uvify_password", formData.password, 30)
        setCookie("uvify_remember_me", "true", 30)
      } else {
        setCookie("uvify_email", "", -1)
        setCookie("uvify_password", "", -1)
        setCookie("uvify_remember_me", "", -1)
      }

      login(data.user)
      console.log("[v0] Login successful, navigating to dashboard")
      navigate("/dashboard")
    } catch (err) {
      console.error("[v0] Auth error:", err)
      setError("Server error. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl w-full items-center">
        {/* Hero Section - Improved spacing and typography */}
        <div className="space-y-8 text-center lg:text-left lg:pr-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500 block lg:inline">
                UVify
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Your intelligent UV index monitoring system. Stay protected with real-time UV tracking and personalized safety recommendations.
            </p>
          </div>

          {/* Features Grid - Improved spacing and responsiveness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8">
            {[
              {
                icon: "☀️",
                color: "text-yellow-500 dark:text-yellow-400",
                title: "Real-time Monitoring",
                desc: "Live UV index readings with instant updates.",
              },
              {
                icon: "🛡️",
                color: "text-orange-500 dark:text-orange-400",
                title: "Safety Alerts",
                desc: "Personalized recommendations based on UV levels.",
              },
              {
                icon: "📈",
                color: "text-amber-500 dark:text-amber-400",
                title: "Historical Data",
                desc: "Track UV patterns with detailed analytics.",
              },
              {
                icon: "👥",
                color: "text-red-500 dark:text-red-400",
                title: "Multi-user Support",
                desc: "Individual profiles with personalized settings.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-yellow-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-yellow-200 dark:hover:border-gray-600"
              >
                <div className={`${item.color} text-2xl mb-3`}>{item.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base lg:text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card - Enhanced styling and spacing */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-yellow-100 dark:border-gray-700 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="text-center mb-6 lg:mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl text-white">☀️</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">Sign in to continue to UVify</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-all duration-200 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 px-2 py-1 text-sm font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-yellow-500 cursor-pointer focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium transition-colors duration-200">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 text-white rounded-xl font-semibold shadow-lg hover:from-yellow-600 hover:to-orange-700 dark:hover:from-yellow-700 dark:hover:to-orange-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </>
                  ) : (
                    "Login to UVify"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium transition-colors duration-200">
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
