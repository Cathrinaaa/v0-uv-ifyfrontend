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
  const [accumulation, setAccumulation] = useState(null)

  const calculateTodayAccumulation = () => {
    const stats = getStats()
    const todayAccumulated = stats.todaysReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)
    return Number.parseFloat(todayAccumulated.toFixed(2))
  }

  const fetchGeminiSuggestions = async () => {
    setLoading(true)
    setError(null)
    setSuggestions(null)

    try {
      const todayUV = calculateTodayAccumulation()
      console.log("[v0] Today's accumulated UV:", todayUV)
      setAccumulation(todayUV)

      const requestPayload = {
        uvData: {
          today: todayUV,
        },
      }
      console.log("[v0] Sending request payload:", JSON.stringify(requestPayload))

      const response = await fetch("https://uvify-backend.onrender.com/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", {
        contentType: response.headers.get("content-type"),
      })

      const data = await response.json()
      console.log("[v0] Full API response object:", data)
      console.log("[v0] Response stringified:", JSON.stringify(data, null, 2))

      if (!response.ok) {
        console.error("[v0] Error response received:", data)
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`)
      }

      let suggestionText = null

      if (data.suggestion) {
        suggestionText = data.suggestion
        console.log("[v0] Extracted from data.suggestion:", suggestionText)
      } else if (data.response) {
        suggestionText = data.response
        console.log("[v0] Extracted from data.response:", suggestionText)
      } else if (data.text) {
        suggestionText = data.text
        console.log("[v0] Extracted from data.text:", suggestionText)
      } else if (data.message) {
        suggestionText = data.message
        console.log("[v0] Extracted from data.message:", suggestionText)
      } else if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        suggestionText = data.candidates[0].content.parts[0].text
        console.log("[v0] Extracted from Gemini candidates structure:", suggestionText)
      } else if (typeof data === "string") {
        suggestionText = data
        console.log("[v0] Response is a string:", suggestionText)
      } else {
        console.error("[v0] Response structure keys:", Object.keys(data))
        console.error("[v0] Full data for inspection:", JSON.stringify(data, null, 2))
        throw new Error("Unexpected response format - no suggestion field found")
      }

      if (!suggestionText || suggestionText.trim() === "") {
        throw new Error("Received empty suggestion from API")
      }

      console.log("[v0] Final suggestion text:", suggestionText)
      setSuggestions(suggestionText)
    } catch (err) {
      console.error("[v0] Complete error:", err)
      console.error("[v0] Error message:", err.message)
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

      {accumulation !== null && (
        <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Today's UV Accumulation</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{accumulation} UV Index Points</p>
        </div>
      )}

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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {suggestions}
          </div>
        </div>
      )}

      {!loading && !suggestions && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Waiting for UV readings to generate personalized recommendations...
          </p>
        </div>
      )}
    </div>
  )
}
