import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../main";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 🌐 Change this to your Render backend URL
  const BACKEND_URL = "https://uvify-backend.onrender.com";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/register";
      const url = `${BACKEND_URL}${endpoint}`;

      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        login(data.user);
        navigate("/dashboard/latest");
      } else {
        alert("Signup successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">
        {/* Hero Section */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
              UVify
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Your intelligent UV index monitoring system. Stay protected with
            real-time UV tracking and personalized safety recommendations.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {[
              {
                icon: "☀️",
                color: "text-yellow-500",
                title: "Real-time Monitoring",
                desc: "Live UV index readings from ESP32 sensors with instant updates.",
              },
              {
                icon: "🛡️",
                color: "text-orange-500",
                title: "Safety Alerts",
                desc: "Personalized recommendations and alerts based on current UV levels.",
              },
              {
                icon: "📈",
                color: "text-amber-500",
                title: "Historical Data",
                desc: "Track UV patterns over time with detailed charts and analytics.",
              },
              {
                icon: "👥",
                color: "text-red-500",
                title: "Multi-user Support",
                desc: "Individual profiles with personalized settings and preferences.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-yellow-200"
              >
                <div className={`${item.color} text-2xl mb-2`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {isLogin ? "Login to UVify" : "Create an Account"}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {isLogin ? "Sign in to your account" : "Sign up to get started"}
            </p>

            {error && (
              <div className="mb-4 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
              )}
              {!isLogin && (
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                required
              />

              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-medium shadow-md hover:from-yellow-600 hover:to-orange-700 transition-all"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-600 font-medium hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
