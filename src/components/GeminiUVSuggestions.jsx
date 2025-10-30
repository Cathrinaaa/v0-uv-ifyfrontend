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
    }
  }

  const fetchGeminiSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      const accumulation = calculateAccumulation()

      const prompt = `Based on the following UV exposure data, provide personalized health recommendations:
      
Current UV Index: ${accumulation.currentUV}
Today's Peak UV: ${accumulation.todaysPeak}
Today's Accumulated UV: ${accumulation.todayAccumulated}
This Week's Accumulated UV: ${accumulation.weekAccumulated}
This Month's Accumulated UV: ${accumulation.monthAccumulated}

Please provide:
1. Assessment of current UV exposure level
2. Specific recommendations for sun protection
3. Suggested activities based on UV levels
4. Health tips for skin protection
5. When to avoid outdoor activities

Keep the response concise and actionable.`

      const response = await fetch("/api/gemini-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions")
      }

      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (err) {
      console.error("Error fetching Gemini suggestions:", err)
      setError("Failed to load AI suggestions. Please try again.")
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
    </div>
  )
}
