"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sliders, TrendingUp, TrendingDown, Loader2 } from "lucide-react"

export function RiskSlider() {
  const [sliderValues, setSliderValues] = useState({
    monthlyIncome: [5000],
    debtRatio: [0.35],
    creditUtilization: [0.25],
    late90Days: [0],
    late30Days: [0]
  })

  const [prediction, setPrediction] = useState({
    defaultProbability: 0.15,
    suggestedRate: 6.8,
    riskLevel: "Low Risk"
  })

  const [loading, setLoading] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Call real ML model API with debouncing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new debounced call
    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthlyIncome: sliderValues.monthlyIncome[0].toString(),
            debtRatio: sliderValues.debtRatio[0].toString(),
            creditUtilization: sliderValues.creditUtilization[0].toString(),
            openCreditLines: '5',
            realEstateLoans: '1',
            dependents: '0',
            late30Days: sliderValues.late30Days[0].toString(),
            late60Days: '0',
            late90Days: sliderValues.late90Days[0].toString()
          })
        })

        const result = await response.json()

        if (!result.error) {
          setPrediction({
            defaultProbability: result.defaultProbability,
            suggestedRate: result.suggestedRate || 5.5,
            riskLevel: result.riskLevel
          })
        }
      } catch (error) {
        console.error('Prediction API error:', error)
      } finally {
        setLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [sliderValues])

  const handleSliderChange = (field: string, value: number[]) => {
    setSliderValues(prev => ({ ...prev, [field]: value }))
  }

  const getRiskColor = () => {
    if (prediction.defaultProbability < 0.3) return "text-green-600"
    if (prediction.defaultProbability < 0.6) return "text-blue-800"
    return "text-red-600"
  }

  const getRiskBg = () => {
    if (prediction.defaultProbability < 0.3) return "bg-green-50 border-green-200"
    if (prediction.defaultProbability < 0.6) return "bg-blue-50 border-blue-200"
    return "bg-red-50 border-red-200"
  }

  return (
    <div className="space-y-6">
      {/* Real-time Risk Display */}
      <Card className={`border-2 ${getRiskBg()}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              🎯 Risk Simulator (Live ML)
            </CardTitle>
            <div className="flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
              <Badge className={`${prediction.defaultProbability < 0.3
                ? 'bg-green-100 text-green-800'
                : prediction.defaultProbability < 0.6
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {prediction.riskLevel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-sm font-medium text-slate-600 mb-2">Default Risk</div>
              <div className={`text-4xl font-bold ${getRiskColor()}`}>
                {(prediction.defaultProbability * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-slate-600 mb-2">Suggested APR</div>
              <div className="text-4xl font-bold text-slate-800">
                {prediction.suggestedRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sliders */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Adjust Risk Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Monthly Income */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Monthly Income</label>
              <span className="text-lg font-bold text-slate-800">${sliderValues.monthlyIncome[0].toLocaleString()}</span>
            </div>
            <Slider
              value={sliderValues.monthlyIncome}
              onValueChange={(value) => handleSliderChange('monthlyIncome', value)}
              max={20000}
              min={1000}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>$1,000</span>
              <span>$20,000</span>
            </div>
          </div>

          {/* Debt Ratio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Debt-to-Income Ratio</label>
              <span className="text-lg font-bold text-slate-800">{sliderValues.debtRatio[0].toFixed(2)}</span>
            </div>
            <Slider
              value={sliderValues.debtRatio}
              onValueChange={(value) => handleSliderChange('debtRatio', value)}
              max={2}
              min={0}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Credit Utilization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Credit Utilization</label>
              <span className="text-lg font-bold text-slate-800">{(sliderValues.creditUtilization[0] * 100).toFixed(0)}%</span>
            </div>
            <Slider
              value={sliderValues.creditUtilization}
              onValueChange={(value) => handleSliderChange('creditUtilization', value)}
              max={1}
              min={0}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* 90+ Days Late */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">90+ Days Late Payments</label>
              <span className="text-lg font-bold text-slate-800">{sliderValues.late90Days[0]}</span>
            </div>
            <Slider
              value={sliderValues.late90Days}
              onValueChange={(value) => handleSliderChange('late90Days', value)}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0</span>
              <span>10+</span>
            </div>
          </div>

          {/* 30-59 Days Late */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">30-59 Days Late Payments</label>
              <span className="text-lg font-bold text-slate-800">{sliderValues.late30Days[0]}</span>
            </div>
            <Slider
              value={sliderValues.late30Days}
              onValueChange={(value) => handleSliderChange('late30Days', value)}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0</span>
              <span>10+</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}