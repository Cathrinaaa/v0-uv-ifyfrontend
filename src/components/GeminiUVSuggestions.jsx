"use client"

import { useState, useEffect } from "react"
import { useUVData } from "../contexts/UVDataContext"
import { useLanguage } from "../contexts/LanguageContext"

export default function GeminiUVSuggestions() {
  const { getStats } = useUVData()
  const { t } = useLanguage()
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasData, setHasData] = useState(false)

  const calculateAccumulation = () => {
    const stats = getStats()
    const now = new Date()
    const lastMonth = new Date(now)
    lastMonth.setDate(now.getDate() - 30)

    const todayAccumulated = stats.todaysReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)
    const weekAccumulated = stats.weekReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)
    const monthReadings =
      stats.history?.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= lastMonth && itemDate <= now
      }) || []
    const monthAccumulated = monthReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)

    return {
      todayAccumulated: Number.parseFloat(todayAccumulated.toFixed(1)),
      weekAccumulated: Number.parseFloat(weekAccumulated.toFixed(1)),
      monthAccumulated: Number.parseFloat(monthAccumulated.toFixed(1)),
      currentUV: stats.currentReading || 0,
      todaysPeak: stats.todaysPeak || 0,
      totalReadings: stats.totalReadings || 0,
    }
  }

  const fetchGeminiSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      const accumulation = calculateAccumulation()
      console.log("[v0] UV Accumulation data:", accumulation)

      if (accumulation.totalReadings === 0) {
        setHasData(false)
        setError("No UV data available yet. Please wait for readings from your device.")
        setLoading(false)
        return
      }

      setHasData(true)

      const response = await fetch("https://uvify-backend.onrender.com/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uvData: {
            currentUV: accumulation.currentUV,
            todaysPeak: accumulation.todaysPeak,
            todayAccumulated: accumulation.todayAccumulated,
            weekAccumulated: accumulation.weekAccumulated,
            monthAccumulated: accumulation.monthAccumulated,
            totalReadings: accumulation.totalReadings,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error("[v0] API error response:", errorData)
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      const suggestionText = data.candidates?.[0]?.content?.parts?.[0]?.text || data.text || "No suggestions available"
      setSuggestions(suggestionText)
    } catch (err) {
      console.error("[v0] Error fetching Gemini suggestions:", err)
      setError(
        "Unable to generate AI suggestions at the moment. This may be due to network issues. Your UV data is still being tracked locally.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGeminiSuggestions()
  }, [])

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-700 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
          <span>🤖</span>
          {t("suggestions.aiRecommendations") || "AI-Powered UV Recommendations"}
        </h2>
        <button
          onClick={fetchGeminiSuggestions}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-blue-600 dark:text-blue-400">Generating recommendations...</span>
        </div>
      )}

      {suggestions && !loading && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {suggestions}
          </div>
        </div>
      )}

      {!loading && !suggestions && !error && !hasData && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Waiting for UV readings to generate personalized recommendations...
          </p>
        </div>
      )}
    </div>
  )
}
