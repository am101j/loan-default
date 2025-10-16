"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BatchResult {
  id: number
  age: number
  monthlyIncome: number
  defaultProbability: number
  suggestedRate: number
  decision: string
  riskLevel: string
}

export function BatchProcessor() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<BatchResult[]>([])
  const [error, setError] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile && uploadedFile.type === "text/csv") {
      setFile(uploadedFile)
      setError("")
    } else {
      setError("Please upload a valid CSV file")
    }
  }

  const processCSV = async () => {
    if (!file) return

    setProcessing(true)
    setProgress(0)
    setResults([])

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      // Validate headers
      const requiredHeaders = ['age', 'monthlyIncome', 'debtRatio', 'creditUtilization', 'late90Days', 'late30Days']
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
      
      if (missingHeaders.length > 0) {
        setError(`Missing required columns: ${missingHeaders.join(', ')}`)
        setProcessing(false)
        return
      }

      const batchResults: BatchResult[] = []
      
      // Process each row
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const rowData: any = {}
        
        headers.forEach((header, index) => {
          rowData[header] = values[index]
        })

        // Calculate risk (same logic as risk slider)
        let riskScore = 0
        riskScore += parseFloat(rowData.late90Days || 0) * 0.28
        riskScore += parseFloat(rowData.late30Days || 0) * 0.08
        riskScore += parseFloat(rowData.creditUtilization || 0) * 0.19
        riskScore += (parseFloat(rowData.debtRatio || 0) / 10) * 0.15
        
        if (parseFloat(rowData.age || 0) < 30) riskScore += 0.05
        if (parseFloat(rowData.monthlyIncome || 0) < 3000) riskScore += 0.08
        else if (parseFloat(rowData.monthlyIncome || 0) < 5000) riskScore += 0.04

        const probability = Math.min(Math.max(riskScore / 2, 0.05), 0.95)
        const baseRate = 5.5
        const riskPremium = probability * 15
        const suggestedRate = baseRate + riskPremium

        let riskLevel = "Low Risk"
        let decision = "APPROVE"
        
        if (probability >= 0.8) {
          riskLevel = "High Risk"
          decision = "DECLINE"
        } else if (probability >= 0.6) {
          riskLevel = "High Risk"
          decision = "APPROVE_HIGH_RATE"
        } else if (probability >= 0.3) {
          riskLevel = "Medium Risk"
          decision = "APPROVE_STANDARD"
        } else {
          riskLevel = "Low Risk"
          decision = "APPROVE_PRIME"
        }

        batchResults.push({
          id: i,
          age: parseFloat(rowData.age || 0),
          monthlyIncome: parseFloat(rowData.monthlyIncome || 0),
          defaultProbability: probability,
          suggestedRate: decision === "DECLINE" ? 0 : suggestedRate,
          decision,
          riskLevel
        })

        // Update progress
        setProgress((i / (lines.length - 1)) * 100)
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      setResults(batchResults)
    } catch (err) {
      setError("Error processing CSV file. Please check the format.")
    } finally {
      setProcessing(false)
    }
  }

  const downloadResults = () => {
    const csvContent = [
      "ID,Age,Monthly Income,Default Risk %,Suggested APR %,Decision,Risk Level",
      ...results.map(r => 
        `${r.id},${r.age},${r.monthlyIncome},${(r.defaultProbability * 100).toFixed(1)},${r.suggestedRate.toFixed(1)},${r.decision},${r.riskLevel}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'creditvision_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getDecisionStats = () => {
    const approved = results.filter(r => r.decision.includes("APPROVE")).length
    const declined = results.filter(r => r.decision === "DECLINE").length
    const avgRate = results.filter(r => r.decision !== "DECLINE")
      .reduce((sum, r) => sum + r.suggestedRate, 0) / (results.length - declined)

    return { approved, declined, avgRate: avgRate || 0 }
  }

  const stats = results.length > 0 ? getDecisionStats() : null

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            📊 Batch Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-slate-700">Upload CSV File</p>
              <p className="text-sm text-slate-500">
                Required columns: age, monthlyIncome, debtRatio, creditUtilization, late90Days, late30Days
              </p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {file && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{file.name}</span>
              </div>
              <Button 
                onClick={processCSV} 
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {processing ? "Processing..." : "Process File"}
              </Button>
            </div>
          )}

          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing applications...</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>📈 Batch Results</CardTitle>
              <Button onClick={downloadResults} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Results
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                  <div className="text-sm text-green-600">Approved</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{stats.declined}</div>
                  <div className="text-sm text-red-600">Declined</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{stats.avgRate.toFixed(1)}%</div>
                  <div className="text-sm text-blue-600">Avg APR</div>
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Age</th>
                    <th className="text-left p-3 font-medium">Income</th>
                    <th className="text-left p-3 font-medium">Risk %</th>
                    <th className="text-left p-3 font-medium">APR %</th>
                    <th className="text-left p-3 font-medium">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-t hover:bg-slate-50">
                      <td className="p-3">{result.id}</td>
                      <td className="p-3">{result.age}</td>
                      <td className="p-3">${result.monthlyIncome.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`font-medium ${
                          result.defaultProbability < 0.3 ? 'text-green-600' :
                          result.defaultProbability < 0.6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {(result.defaultProbability * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3">
                        {result.decision === "DECLINE" ? "N/A" : `${result.suggestedRate.toFixed(1)}%`}
                      </td>
                      <td className="p-3">
                        <Badge className={`${
                          result.decision === "DECLINE" 
                            ? 'bg-red-100 text-red-800' 
                            : result.decision === "APPROVE_PRIME"
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {result.decision === "DECLINE" ? "DECLINE" : "APPROVE"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}