"use client"

import { useLanguage } from "../contexts/LanguageContext"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function DashboardHome() {
  const { t } = useLanguage()
  const [currentUV, setCurrentUV] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  // Simulate checking for device connection
  useEffect(() => {
    // In a real app, this would check if the UV device is connected
    const checkConnection = () => {
      // For now, simulate no connection
      setIsConnected(false)
    }
    checkConnection()
  }, [])

  const quickStats = [
    {
      title: t("dashboard.todaysPeak"),
      value: isConnected ? "8.5" : "--",
      unit: "UV Index",
      icon: "📈",
      color: "from-orange-400 to-red-500",
      textColor: "text-orange-700 dark:text-orange-400",
    },
    {
      title: t("dashboard.currentReading"),
      value: isConnected ? "6.2" : "--",
      unit: "UV Index",
      icon: "☀️",
      color: "from-yellow-400 to-orange-500",
      textColor: "text-yellow-700 dark:text-yellow-400",
    },
    {
      title: t("dashboard.avgThisWeek"),
      value: isConnected ? "5.8" : "--",
      unit: "UV Index",
      icon: "📊",
      color: "from-blue-400 to-cyan-500",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    {
      title: t("dashboard.totalReadings"),
      value: isConnected ? "1,247" : "--",
      unit: t("dashboard.readings"),
      icon: "🔢",
      color: "from-purple-400 to-pink-500",
      textColor: "text-purple-700 dark:text-purple-400",
    },
  ]

  const quickActions = [
    {
      title: t("nav.latest"),
      description: t("dashboard.viewLatestReadings"),
      icon: "📊",
      link: "/dashboard/latest",
      color: "bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
    },
    {
      title: t("nav.history"),
      description: t("dashboard.viewHistoricalData"),
      icon: "🕒",
      link: "/dashboard/history",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    },
    {
      title: t("nav.settings"),
      description: t("dashboard.configureSettings"),
      icon: "⚙️",
      link: "/dashboard/settings",
      color: "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-orange-700 dark:text-orange-400">
            {t("dashboard.welcome")}
          </h1>
          <p className="text-orange-600 dark:text-orange-500 mt-1">{t("dashboard.monitorUVLevels")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isConnected
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
            ></div>
            <span className="text-sm font-medium">
              {isConnected ? t("dashboard.connected") : t("dashboard.waitingForDevice")}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Alert */}
      {!isConnected && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="text-yellow-800 dark:text-yellow-400 font-semibold">
                {t("dashboard.deviceNotConnected")}
              </h3>
              <p className="text-yellow-700 dark:text-yellow-500 text-sm mt-1">{t("dashboard.connectDeviceMessage")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{stat.icon}</span>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} opacity-20`}></div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
              <span className="text-gray-500 dark:text-gray-500 text-sm">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4">{t("dashboard.quickActions")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{action.icon}</span>
                <h3 className="text-xl font-bold">{action.title}</h3>
              </div>
              <p className="text-white/90 text-sm">{action.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium">
                <span>{t("dashboard.goTo")}</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* UV Safety Tips */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
          <span>💡</span>
          {t("dashboard.uvSafetyTips")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧴</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.useSunscreen")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.sunscreenTip")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕶️</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.wearProtection")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.protectionTip")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.avoidPeakHours")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.peakHoursTip")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌳</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-400">{t("dashboard.seekShade")}</h3>
              <p className="text-orange-700 dark:text-orange-500 text-sm">{t("dashboard.shadeTip")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
