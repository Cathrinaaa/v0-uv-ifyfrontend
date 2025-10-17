"use client"

import { createContext, useContext, useState, useEffect } from "react"

const UVDataContext = createContext()

export const useUVData = () => {
  const context = useContext(UVDataContext)
  if (!context) {
    throw new Error("useUVData must be used within UVDataProvider")
  }
  return context
}

export const UVDataProvider = ({ children }) => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  // 🧩 Helper: Remove duplicate readings (same date & time)
  const removeDuplicates = (data) => {
    const unique = new Map()
    data.forEach((item) => {
      const key = `${item.date}-${item.time}`
      if (!unique.has(key)) {
        unique.set(key, item)
      }
    })
    return Array.from(unique.values())
  }

  // 🧠 Helper: Format date & time for display
  const formatDateTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`)
    return dateTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // 📦 Fetch UV history from backend
  const fetchHistory = async () => {
    try {
      const response = await fetch("https://uvify-backend.onrender.com/history")
      const data = await response.json()

      // ✅ Remove duplicates
      const uniqueData = removeDuplicates(data)

      // ✅ Sort by newest first
      const sortedData = uniqueData.sort((a, b) => {
        const dateTimeA = new Date(`${a.date} ${a.time}`)
        const dateTimeB = new Date(`${b.date} ${b.time}`)
        return dateTimeB - dateTimeA
      })

      // ✅ Add formatted date-time field
      const enrichedData = sortedData.map((item) => ({
        ...item,
        formattedDateTime: formatDateTime(item.date, item.time),
      }))

      setHistory(enrichedData)
      setIsConnected(enrichedData.length > 0)
      setLastUpdate(new Date())
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching UV history:", error)
      setIsConnected(false)
      setIsLoading(false)
    }
  }

  // ⏱️ Initial fetch
  useEffect(() => {
    fetchHistory()
  }, [])

  // 🔁 Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHistory()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // 📊 Calculate statistics
  const getStats = () => {
    if (history.length === 0) {
      return {
        todaysPeak: null,
        currentReading: null,
        avgThisWeek: null,
        totalReadings: 0,
        todaysReadings: [],
        weekReadings: [],
      }
    }

    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]
    const lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 7)

    const todaysReadings = history.filter((item) => item.date === todayStr)
    const weekReadings = history.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= lastWeek && itemDate <= now
    })

    const todaysPeak =
      todaysReadings.length > 0
        ? Math.max(...todaysReadings.map((item) => Number.parseFloat(item.uvi)))
        : null

    const currentReading = history.length > 0 ? Number.parseFloat(history[0].uvi) : null

    const avgThisWeek =
      weekReadings.length > 0
        ? (
            weekReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi), 0) /
            weekReadings.length
          ).toFixed(1)
        : null

    return {
      todaysPeak,
      currentReading,
      avgThisWeek,
      totalReadings: history.length,
      todaysReadings,
      weekReadings,
    }
  }

  const value = {
    history, // Each item includes `formattedDateTime`
    isLoading,
    isConnected,
    lastUpdate,
    fetchHistory,
    getStats,
  }

  return <UVDataContext.Provider value={value}>{children}</UVDataContext.Provider>
}
