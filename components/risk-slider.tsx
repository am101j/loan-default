"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Sliders, TrendingUp, TrendingDown } from "lucide-react"

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

  // Real-time prediction calculation (simplified)
  useEffect(() => {
    const calculateRisk = () => {
      let riskScore = 0
      
      // Late payments (strongest predictor)
      riskScore += sliderValues.late90Days[0] * 0.28
      riskScore += sliderValues.late30Days[0] * 0.08
      
      // Credit utilization
      riskScore += sliderValues.creditUtilization[0] * 0.19
      
      // Debt ratio
      riskScore += (sliderValues.debtRatio[0] / 10) * 0.15
      

      
      // Income factor
      if (sliderValues.monthlyIncome[0] < 3000) riskScore += 0.08
      else if (sliderValues.monthlyIncome[0] < 5000) riskScore += 0.04
      
      const probability = Math.min(Math.max(riskScore / 2, 0.05), 0.95)
      const baseRate = 5.5
      const riskPremium = probability * 15
      const suggestedRate = baseRate + riskPremium
      
      let riskLevel = "Low Risk"
      if (probability >= 0.6) riskLevel = "High Risk"
      else if (probability >= 0.3) riskLevel = "Medium Risk"
      
      setPrediction({
        defaultProbability: probability,
        suggestedRate,
        riskLevel
      })
    }
    
    calculateRisk()
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
              🎯 Risk Simulator
            </CardTitle>
            <Badge className={`${
              prediction.defaultProbability < 0.3 
                ? 'bg-green-100 text-green-800' 
                : prediction.defaultProbability < 0.6 
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {prediction.riskLevel}
            </Badge>
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

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Income Slider */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Monthly Income</label>
                <span className="text-lg font-bold text-slate-800">${sliderValues.monthlyIncome[0].toLocaleString()}</span>
              </div>
              <Slider
                value={sliderValues.monthlyIncome}
                onValueChange={(value) => handleSliderChange('monthlyIncome', value)}
                max={15000}
                min={1000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>$1K</span>
                <span>$15K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debt Ratio Slider */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Debt-to-Income Ratio</label>
                <span className="text-lg font-bold text-slate-800">{(sliderValues.debtRatio[0] * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={sliderValues.debtRatio}
                onValueChange={(value) => handleSliderChange('debtRatio', value)}
                max={2}
                min={0}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>200%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Utilization Slider */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Credit Utilization</label>
                <span className="text-lg font-bold text-slate-800">{(sliderValues.creditUtilization[0] * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={sliderValues.creditUtilization}
                onValueChange={(value) => handleSliderChange('creditUtilization', value)}
                max={1.5}
                min={0}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>150%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Late 90+ Days Slider */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Late 30-59 Days Slider */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="space-y-4">
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
    </div>
  )
}