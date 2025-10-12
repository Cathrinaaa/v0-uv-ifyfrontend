"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Latest from "./pages/Latest"
import History from "./pages/History"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import DashboardHome from "./pages/DashboardHome" // ✅ NEW: import DashboardHome
import "./index.css"
import Profile from "./pages/Profile"
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { UVDataProvider } from "./contexts/UVDataContext"

// =============================
// Simple auth context
// =============================
export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null)

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // ✅ NEW: update user info and persist
  const updateUser = (updatedData) => {
    setUser(updatedData)
    localStorage.setItem("user", JSON.stringify(updatedData))
  }

  React.useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser && savedUser !== "null") {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const isAuthenticated = () => !!user

  const value = {
    user,
    setUser,
    isAuthenticated,
    login,
    logout,
    updateUser, // ✅ make this available
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// =============================
// Route Components
// =============================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext)
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext)
  return !isAuthenticated() ? children : <Navigate to="/dashboard" replace />
}

const LandingPage = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-600 dark:to-orange-700 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center text-white max-w-md">
        <h1 className="text-5xl font-bold mb-4">☀️ {t("landing.title")}</h1>
        <p className="text-xl mb-6">{t("landing.subtitle")}</p>
        <p className="text-lg mb-8 opacity-90">{t("landing.description")}</p>
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            {t("landing.enterDashboard")}
          </Link>
          <Link
            to="/login"
            className="block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            {t("landing.adminLogin")}
          </Link>
        </div>
      </div>
    </div>
  )
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
)

const App = () => {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="home" element={<DashboardHome />} />
        <Route path="latest" element={<Latest />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <UVDataProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UVDataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
