"use client"

import { useLanguage } from "../contexts/LanguageContext"
import UVAnalyticsChart from "../components/UVAnalyticsChart"
import { useUVData } from "../contexts/UVDataContext"

export default function Analytics() {
  const { t } = useLanguage()
  const { isConnected, lastUpdate } = useUVData()

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-400">
            📊 {t("analytics.title") || "UV Analytics"}
          </h1>
          <p className="text-orange-600 dark:text-orange-500 mt-1">
            {t("analytics.subtitle") || "Detailed UV data visualization and trends"}
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("common.lastUpdated") || "Last updated"}: {lastUpdate.toLocaleTimeString()}
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
              <p className="text-yellow-700 dark:text-yellow-500 text-sm mt-1">
                {t("analytics.noDataMessage") || "Connect your UV device to see real-time analytics"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UV Analytics Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-orange-200 dark:border-gray-700">
        <UVAnalyticsChart />
      </div>

      {/* Additional Analytics Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
            <span>📈</span>
            {t("analytics.trendAnalysis") || "Trend Analysis"}
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            {t("analytics.trendDescription") ||
              "Monitor UV index patterns over time to identify peak exposure periods and plan outdoor activities accordingly."}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-3 flex items-center gap-2">
            <span>🎯</span>
            {t("analytics.insights") || "Key Insights"}
          </h3>
          <p className="text-purple-700 dark:text-purple-300 text-sm">
            {t("analytics.insightsDescription") ||
              "Analyze historical data to understand UV exposure patterns and make informed decisions about sun protection."}
          </p>
        </div>
      </div>
    </div>
  )
}
