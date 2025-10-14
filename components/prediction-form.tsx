"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PredictionResult } from "@/components/prediction-result"

export function PredictionForm() {
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)

  const [formData, setFormData] = useState({
    age: "45",
    monthlyIncome: "5000",
    debtRatio: "0.35",
    creditUtilization: "0.25",
    openCreditLines: "8",
    realEstateLoans: "1",
    dependents: "2",
    late30Days: "0",
    late60Days: "0",
    late90Days: "0",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      setPrediction(result)
    } catch (error) {
      console.error("[v0] Prediction error:", error)
      setPrediction({
        error: "Failed to generate prediction. Please ensure the model is trained.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Borrower Information</CardTitle>
          <CardDescription>Enter borrower details to predict default probability</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Personal Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={formData.dependents}
                    onChange={(e) => handleChange("dependents", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Financial Profile</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="debtRatio">Debt-to-Income Ratio</Label>
                  <Input
                    id="debtRatio"
                    type="number"
                    step="0.01"
                    value={formData.debtRatio}
                    onChange={(e) => handleChange("debtRatio", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditUtilization">Credit Utilization (0-1)</Label>
                  <Input
                    id="creditUtilization"
                    type="number"
                    step="0.01"
                    value={formData.creditUtilization}
                    onChange={(e) => handleChange("creditUtilization", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Credit Lines */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Credit History</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openCreditLines">Open Credit Lines</Label>
                  <Input
                    id="openCreditLines"
                    type="number"
                    value={formData.openCreditLines}
                    onChange={(e) => handleChange("openCreditLines", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="realEstateLoans">Real Estate Loans</Label>
                  <Input
                    id="realEstateLoans"
                    type="number"
                    value={formData.realEstateLoans}
                    onChange={(e) => handleChange("realEstateLoans", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Late Payments */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Payment History</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="late30Days">30-59 Days Late</Label>
                  <Input
                    id="late30Days"
                    type="number"
                    value={formData.late30Days}
                    onChange={(e) => handleChange("late30Days", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="late60Days">60-89 Days Late</Label>
                  <Input
                    id="late60Days"
                    type="number"
                    value={formData.late60Days}
                    onChange={(e) => handleChange("late60Days", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="late90Days">90+ Days Late</Label>
                  <Input
                    id="late90Days"
                    type="number"
                    value={formData.late90Days}
                    onChange={(e) => handleChange("late90Days", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Risk...
                </>
              ) : (
                "Predict Default Risk"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {prediction && <PredictionResult prediction={prediction} />}
    </div>
  )
}
