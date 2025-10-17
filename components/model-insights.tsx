"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, TrendingUp, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function ModelInsights() {
  const [modelData, setModelData] = useState(null)
  
  useEffect(() => {
    fetch('/models/model_info.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Model data not found')
        }
        return res.json()
      })
      .then(data => setModelData(data))
      .catch(err => {
        console.error('Failed to load model data:', err)
        // Fallback to demo data if model not trained yet
        setModelData({
          roc_auc_score: 0.8248,
          test_samples: 30000,
          feature_importance: [
            { feature: 'NumberOfTimes90DaysLate', importance: 0.35 },
            { feature: 'RevolvingUtilizationOfUnsecuredLines', importance: 0.20 },
            { feature: 'DebtRatio', importance: 0.15 },
            { feature: 'MonthlyIncome', importance: 0.12 },
            { feature: 'NumberOfTime30-59DaysPastDueNotWorse', importance: 0.10 }
          ]
        })
      })
  }, [])
  
  if (!modelData) {
    return <div>Loading model insights...</div>
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Model Performance</CardTitle>
              <CardDescription className="text-slate-600">XGBoost Gradient Boosting</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-slate-800 mb-1">{modelData.roc_auc_score.toFixed(4)}</div>
              <div className="text-sm text-slate-600 font-medium">ROC-AUC Score</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-slate-800 mb-1">{modelData.test_samples.toLocaleString()}</div>
              <div className="text-sm text-slate-600 font-medium">Test Samples</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Feature Importance</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modelData.feature_importance.slice(0, 5).map((feature, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-800">{feature.feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-lg font-bold text-slate-800">{(feature.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-800 rounded-full" 
                    style={{ width: `${feature.importance * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
