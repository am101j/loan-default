"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, Loader2 } from "lucide-react"

interface RiskFactor {
  factor: string
  defaulter_avg: number
  non_defaulter_avg: number
  impact: string
}

interface InsightsData {
  total_borrowers: number
  defaulters: number
  non_defaulters: number
  default_rate: number
  risk_factors: RiskFactor[]
}

export function RiskFactors() {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/insights.json')
      .then(res => res.json())
      .then(data => {
        setInsights(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load insights:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-white border-slate-200">
              <CardContent className="p-4 text-center">
                <div className="h-8 bg-slate-200 rounded w-20 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-24 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="h-5 bg-slate-200 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] bg-slate-100 rounded flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!insights) {
    return <div className="text-center p-12 text-slate-500">Failed to load analytics data</div>
  }

  // Transform insights into chart format
  const riskFactors = insights.risk_factors.map(rf => ({
    title: rf.factor,
    data: [{
      group: rf.factor,
      defaulters: rf.defaulter_avg,
      nonDefaulters: rf.non_defaulter_avg
    }]
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">{insights.total_borrowers.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Total Borrowers</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{insights.non_defaulters.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Non-Defaulters</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{insights.defaulters.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Defaulters</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{insights.default_rate.toFixed(2)}%</div>
            <div className="text-sm text-slate-600">Default Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factor Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riskFactors.map((factor, idx) => (
          <Card
            key={idx}
            className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-800">
                {factor.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={factor.data} margin={{ top: 20, right: 20, left: 20, bottom: 40 }} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="group"
                    tick={{ fontSize: 11, fill: '#1e293b' }}
                    hide
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#1e293b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      color: "#1e293b"
                    }}
                    formatter={(value: number) => value.toFixed(2)}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                    iconType="rect"
                  />
                  <Bar dataKey="defaulters" fill="#dc2626" name="Defaulters (avg)" radius={[2, 2, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="nonDefaulters" fill="#16a34a" name="Non-Defaulters (avg)" radius={[2, 2, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
