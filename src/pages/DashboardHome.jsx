"use client"

import { useLanguage } from "../contexts/LanguageContext"
import { useUVData } from "../contexts/UVDataContext"
import { Link } from "react-router-dom"
import { getUVInfo, getAllUVLevels } from "../utils/uvInfo"

export default function DashboardHome() {
  const { t } = useLanguage()
  const { isConnected, getStats, lastUpdate } = useUVData()
  const stats = getStats()

  const currentUVInfo = stats.currentReading !== null ? getUVInfo(stats.currentReading) : null
  const allUVLevels = getAllUVLevels()

  const quickStats = [
    {
      title: t("dashboard.todaysPeak"),
      value: stats.todaysPeak !== null ? stats.todaysPeak.toFixed(1) : "--",
      unit: "UV Index",
      icon: "📈",
      color: "from-orange-400 to-red-500",
      textColor: "text-orange-700 dark:text-orange-400",
    },
    {
      title: t("dashboard.currentReading"),
      value: stats.currentReading !== null ? stats.currentReading.toFixed(1) : "--",
      unit: "UV Index",
      icon: "☀️",
      color: "from-yellow-400 to-orange-500",
      textColor: "text-yellow-700 dark:text-yellow-400",
    },
    {
      title: t("dashboard.avgThisWeek"),
      value: stats.avgThisWeek !== null ? stats.avgThisWeek : "--",
      unit: "UV Index",
      icon: "📊",
      color: "from-blue-400 to-cyan-500",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    {
      title: t("dashboard.totalReadings"),
      value: stats.totalReadings > 0 ? stats.totalReadings.toLocaleString() : "--",
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
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
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

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
          <span>📊</span>
          UV Index Analytics
        </h2>

        {/* Current UV Level Details */}
        {currentUVInfo && (
          <div
            className={`mb-6 p-4 rounded-lg bg-${currentUVInfo.color}-50 dark:bg-${currentUVInfo.color}-900/20 border-l-4 border-${currentUVInfo.color}-500`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3
                  className={`text-xl font-bold text-${currentUVInfo.color}-700 dark:text-${currentUVInfo.color}-400`}
                >
                  Current Level: {currentUVInfo.level} ({stats.currentReading.toFixed(1)})
                </h3>
                <p className={`text-${currentUVInfo.color}-600 dark:text-${currentUVInfo.color}-500 mt-1`}>
                  {currentUVInfo.description}
                </p>
              </div>
              <div className="text-center md:text-right">
                <div
                  className={`text-3xl font-bold text-${currentUVInfo.color}-700 dark:text-${currentUVInfo.color}-400`}
                >
                  ⏱️ {currentUVInfo.burnTime}
                </div>
                <p className={`text-sm text-${currentUVInfo.color}-600 dark:text-${currentUVInfo.color}-500`}>
                  Burn Time
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className={`font-semibold text-${currentUVInfo.color}-800 dark:text-${currentUVInfo.color}-400 mb-2`}>
                Recommendations:
              </h4>
              <ul className={`space-y-1 text-sm text-${currentUVInfo.color}-700 dark:text-${currentUVInfo.color}-500`}>
                {currentUVInfo.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* UV Index Reference Table */}
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">UV Index Reference Guide</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Level</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Range</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Risk</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Burn Time</th>
              </tr>
            </thead>
            <tbody>
              {allUVLevels.map((level, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 dark:border-gray-700 bg-${level.color}-50/50 dark:bg-${level.color}-900/10`}
                >
                  <td className={`py-3 px-3 font-semibold text-${level.color}-700 dark:text-${level.color}-400`}>
                    {level.level}
                  </td>
                  <td className={`py-3 px-3 text-${level.color}-600 dark:text-${level.color}-500`}>{level.range}</td>
                  <td className={`py-3 px-3 text-${level.color}-600 dark:text-${level.color}-500`}>{level.risk}</td>
                  <td className={`py-3 px-3 text-${level.color}-600 dark:text-${level.color}-500`}>{level.burnTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Important Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-400">
            <strong>Note:</strong> UV radiation levels fluctuate from day to day, and also by time of day, with more
            intense ultraviolet radiation during the middle of the day. Avoid direct exposure to UV radiation during
            midday, especially for long periods of time.
          </p>
        </div>
      </div>
    </div>
  )
}
