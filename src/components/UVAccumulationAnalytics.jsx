"use client"

import { useUVData } from "../contexts/UVDataContext"
import { useLanguage } from "../contexts/LanguageContext"

export default function UVAccumulationAnalytics() {
  const { getStats } = useUVData()
  const { t } = useLanguage()

  const calculateAccumulation = () => {
    const stats = getStats()
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]

    // Get last 7 days
    const lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 7)

    // Get last 30 days
    const lastMonth = new Date(now)
    lastMonth.setDate(now.getDate() - 30)

    // Calculate accumulated UV for today
    const todayAccumulated = stats.todaysReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)

    // Calculate accumulated UV for week
    const weekAccumulated = stats.weekReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)

    // Calculate accumulated UV for month
    const monthReadings =
      stats.history?.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= lastMonth && itemDate <= now
      }) || []

    const monthAccumulated = monthReadings.reduce((sum, item) => sum + Number.parseFloat(item.uvi || 0), 0)

    return {
      todayAccumulated: todayAccumulated.toFixed(1),
      weekAccumulated: weekAccumulated.toFixed(1),
      monthAccumulated: monthAccumulated.toFixed(1),
      todayReadings: stats.todaysReadings.length,
      weekReadings: stats.weekReadings.length,
      monthReadings: monthReadings.length,
    }
  }

  const accumulation = calculateAccumulation()

  const getAccumulationLevel = (accumulated) => {
    const value = Number.parseFloat(accumulated)
    if (value <= 10)
      return {
        level: "Low",
        color: "green",
        icon: "✅",
        description: "Minimal sun exposure. Your skin is well protected.",
        recommendation: "Continue normal outdoor activities with basic sun protection.",
        healthImpact: "Very low risk of skin damage or sunburn.",
        healthRisks: [
          "Minimal risk of UV-related illnesses",
          "Skin damage is unlikely at this level",
          "No immediate health concerns from UV exposure",
        ],
        preventionActions: [
          "Maintain your current sun protection habits",
          "Apply SPF 15+ sunscreen when outdoors",
          "Continue checking UV levels daily",
        ],
      }
    if (value <= 30)
      return {
        level: "Moderate",
        color: "yellow",
        icon: "⚠️",
        description: "Moderate cumulative sun exposure detected.",
        recommendation: "Apply SPF 30+ sunscreen and wear protective clothing when outdoors.",
        healthImpact: "Some UV exposure accumulation. Light tanning may occur.",
        healthRisks: [
          "Risk of accelerated skin aging (premature wrinkles, age spots)",
          "Potential for minor sun burns if exposure continues",
          "Early signs of sun damage may develop",
          "Risk of photoaging - skin texture changes",
        ],
        preventionActions: [
          "Use SPF 30+ broad-spectrum sunscreen daily",
          "Reapply sunscreen every 2 hours or after swimming",
          "Wear protective clothing (long sleeves, pants)",
          "Limit outdoor time during peak hours (10 AM - 4 PM)",
          "Wear a wide-brimmed hat and UV-blocking sunglasses",
        ],
      }
    if (value <= 60)
      return {
        level: "High",
        color: "orange",
        icon: "⚠️",
        description: "Significant cumulative UV exposure over this period.",
        recommendation: "Use high SPF sunscreen (50+), seek shade during peak hours (10AM-4PM), and wear full sun protection.",
        healthImpact: "Noticeable risk of sunburn and skin damage. Extra caution advised.",
        healthRisks: [
          "Increased risk of melanoma (skin cancer) development",
          "Risk of basal cell and squamous cell carcinoma",
          "Significant photoaging - visible wrinkles and age spots",
          "Risk of solar lentigines (sun spots/liver spots)",
          "Potential eye damage (cataracts) with long-term exposure",
          "Immunosuppression affecting skin's defense mechanisms",
        ],
        preventionActions: [
          "Apply SPF 50+ broad-spectrum sunscreen liberally",
          "Reapply every 1-2 hours or immediately after water exposure",
          "Seek shade whenever possible, especially 10 AM - 4 PM",
          "Wear protective UPF clothing, hats, and UV-blocking sunglasses",
          "Consider staying indoors during peak UV hours",
          "Schedule skin cancer screenings with a dermatologist",
          "Use lip balm with SPF 30+",
          "Avoid tanning beds and sun lamps",
        ],
      }
    return {
      level: "Very High",
      color: "red",
      icon: "🚨",
      description: "Excessive cumulative UV exposure. Immediate protective measures needed.",
      recommendation: "Limit outdoor time, use SPF 50+ sunscreen, wear hat/sunglasses, seek shade, and consider staying indoors during peak hours.",
      healthImpact: "High risk of significant skin damage, sunburn, and accelerated aging.",
      healthRisks: [
        "Very high risk of melanoma - most dangerous form of skin cancer",
        "Increased likelihood of basal cell carcinoma and squamous cell carcinoma",
        "Severe photoaging with deep wrinkles, leathery skin, and pigmentation changes",
        "High risk of solar keratosis (precancerous growths)",
        "Risk of pterygium (tissue growth on the eye)",
        "Photokeratitis (temporary eye damage from UV exposure)",
        "Skin texture degradation and permanent damage",
        "Immunosuppression affecting skin's defense mechanisms",
      ],
      preventionActions: [
        "Minimize outdoor exposure - stay indoors when possible",
        "Apply SPF 50+ waterproof sunscreen generously every 1-2 hours",
        "Wear protective UPF 50+ clothing and wide-brimmed hats",
        "Use UV-blocking sunglasses that block 99-100% of UVA/UVB",
        "Seek shade at all times, especially 10 AM - 4 PM",
        "Use umbrellas or sun shelters when outdoors",
        "Visit a dermatologist immediately for skin examination",
        "Perform monthly self-examinations using the ABCDE method for moles",
        "Consider vitamin D supplementation instead of sun exposure",
        "Avoid tanning beds and reflective surfaces that intensify UV",
        "Keep records of cumulative UV exposure for health monitoring",
      ],
    }
  }

  const todayLevel = getAccumulationLevel(accumulation.todayAccumulated)
  const weekLevel = getAccumulationLevel(accumulation.weekAccumulated)
  const monthLevel = getAccumulationLevel(accumulation.monthAccumulated)

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-50 border-green-200 text-green-700",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      red: "bg-red-50 border-red-200 text-red-700",
    }
    return colors[color] || colors.green
  }

  const getAverageDailyExposure = (periodAccumulation, daysCount) => {
    if (daysCount === 0) return 0
    return (Number.parseFloat(periodAccumulation) / daysCount).toFixed(1)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 mt-6">
      <h2 className="text-xl font-semibold mb-2 text-orange-700">📈 {t("analytics.uvAccumulation") || "UV Accumulation Analytics"}</h2>
      <p className="text-sm text-gray-600 mb-6">Understand your cumulative sun exposure and its impact on your skin health</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Accumulation */}
        <div className={`p-4 rounded-lg border-2 ${getColorClasses(todayLevel.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{todayLevel.icon} Today</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white rounded">{accumulation.todayReadings} readings</span>
          </div>
          <p className="text-3xl font-bold mb-1">{accumulation.todayAccumulated}</p>
          <p className="text-xs opacity-75 mb-2">Accumulated UV Index</p>
          <p className="text-xs font-medium mb-3">{todayLevel.level} Exposure</p>
          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-semibold mb-1">What this means:</p>
            <p className="text-xs leading-relaxed text-gray-700">{todayLevel.description}</p>
            <p className="text-xs mt-2 text-gray-600">
              <span className="font-semibold">Recommendation:</span> {todayLevel.recommendation}
            </p>
            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Possible Health Risks:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {todayLevel.healthRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-green-700 mb-1">✅ What You Should Do:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {todayLevel.preventionActions.map((action, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Week's Accumulation */}
        <div className={`p-4 rounded-lg border-2 ${getColorClasses(weekLevel.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{weekLevel.icon} This Week</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white rounded">{accumulation.weekReadings} readings</span>
          </div>
          <p className="text-3xl font-bold mb-1">{accumulation.weekAccumulated}</p>
          <p className="text-xs opacity-75 mb-2">Accumulated UV Index</p>
          <p className="text-xs font-medium mb-3">{weekLevel.level} Exposure</p>
          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-semibold mb-1">Weekly Average:</p>
            <p className="text-xs text-gray-700 mb-2">
              ~{getAverageDailyExposure(accumulation.weekAccumulated, Math.max(accumulation.weekReadings / 3, 1))} UV per day
            </p>
            <p className="text-xs leading-relaxed text-gray-700">{weekLevel.description}</p>
            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Possible Health Risks:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {weekLevel.healthRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-green-700 mb-1">✅ What You Should Do:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {weekLevel.preventionActions.map((action, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Month's Accumulation */}
        <div className={`p-4 rounded-lg border-2 ${getColorClasses(monthLevel.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{monthLevel.icon} This Month</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white rounded">{accumulation.monthReadings} readings</span>
          </div>
          <p className="text-3xl font-bold mb-1">{accumulation.monthAccumulated}</p>
          <p className="text-xs opacity-75 mb-2">Accumulated UV Index</p>
          <p className="text-xs font-medium mb-3">{monthLevel.level} Exposure</p>
          <div className="border-t pt-3 mt-3">
            <p className="text-xs font-semibold mb-1">Monthly Trend:</p>
            <p className="text-xs text-gray-700 mb-2">
              ~{getAverageDailyExposure(accumulation.monthAccumulated, 30)} UV per day average
            </p>
            <p className="text-xs leading-relaxed text-gray-700">{monthLevel.description}</p>
            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Possible Health Risks:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {monthLevel.healthRisks.map((risk, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 border-t pt-2">
              <p className="text-xs font-semibold text-green-700 mb-1">✅ What You Should Do:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {monthLevel.preventionActions.map((action, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 mb-2">💡 Understanding Accumulated UV Index</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Accumulated UV shows total sun exposure over time, not just peak readings</li>
          <li>• Higher values indicate greater cumulative skin stress and damage risk</li>
          <li>• Monitor trends: Consistently high values mean you need stronger protection habits</li>
          <li>• Use this data to adjust your sun protection strategy for better skin health</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm font-semibold text-purple-900 mb-2">🏥 Current Health Impact</p>
        <p className="text-sm text-purple-800">{monthLevel.healthImpact}</p>
      </div>
    </div>
  )
}
