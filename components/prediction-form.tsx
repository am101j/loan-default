"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, FileImage } from "lucide-react"
import { PredictionResult } from "@/components/prediction-result"

export function PredictionForm() {
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    age: "",
    monthlyIncome: "",
    debtRatio: "",
    creditUtilization: "",
    openCreditLines: "",
    realEstateLoans: "",
    dependents: "",
    late30Days: "",
    late60Days: "",
    late90Days: "",
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
      console.error("Prediction error:", error)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setOcrLoading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)
      
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: uploadFormData
      })
      
      const result = await response.json()
      
      console.log('OCR Response:', result)
      
      if (result.success && result.extractedData) {
        console.log('Filling form with:', result.extractedData)
        Object.entries(result.extractedData).forEach(([key, value]) => {
          if (value) {
            console.log(`Setting ${key} = ${value}`)
            handleChange(key, String(value))
          }
        })
      } else {
        console.error('OCR failed:', result.error || 'Unknown error')
      }
    } catch (error) {
      console.error('OCR error:', error)
    } finally {
      setOcrLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Borrower Information</CardTitle>
          <CardDescription className="text-slate-600">Enter borrower details manually or upload a document for auto-extraction</CardDescription>
          
          {/* OCR Upload Section */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <FileImage className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Document Scanner</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">Upload loan application, credit report, or financial document</p>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={ocrLoading}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {ocrLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>
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
                    placeholder="e.g. 35"
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
                    placeholder="e.g. 4500"
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
                    placeholder="e.g. 2"
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
                    placeholder="e.g. 0.35"
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
                    placeholder="e.g. 0.25"
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
                    placeholder="e.g. 8"
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
                    placeholder="e.g. 1"
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
                    placeholder="e.g. 0"
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
                    placeholder="e.g. 0"
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
                    placeholder="e.g. 0"
                    value={formData.late90Days}
                    onChange={(e) => handleChange("late90Days", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-slate-800 hover:bg-slate-900 text-white cursor-pointer transition-all duration-200 hover:scale-105" 
              size="lg" 
              disabled={loading}
            >
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
