"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp } from "lucide-react"

const riskFactors = [
  {
    title: "Late Payments (90+ Days)",
    data: [{ group: "Late 90+ Days", defaulters: 2.09, nonDefaulters: 0.14 }]
  },
  {
    title: "Age Comparison", 
    data: [{ group: "Age (Years)", defaulters: 45.9, nonDefaulters: 52.7 }]
  },
  {
    title: "Monthly Income",
    data: [{ group: "Income ($K)", defaulters: 5.59, nonDefaulters: 6.48 }]
  },
  {
    title: "Credit Utilization",
    data: [{ group: "Credit Util.", defaulters: 437, nonDefaulters: 617 }]
  },
  {
    title: "Debt-to-Income Ratio", 
    data: [{ group: "Debt Ratio", defaulters: 295, nonDefaulters: 357 }]
  }
]

export function RiskFactors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {riskFactors.map((factor, idx) => (
        <Card key={idx} className="bg-white border-slate-200 shadow-sm">
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
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="rect"
                />
                <Bar dataKey="defaulters" fill="#1e3a8a" name="Defaulters" radius={[2, 2, 0, 0]} maxBarSize={60} />
                <Bar dataKey="nonDefaulters" fill="#475569" name="Non-Defaulters" radius={[2, 2, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
