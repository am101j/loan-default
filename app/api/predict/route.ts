import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Extract features from form data
    const features = {
      age: Number.parseFloat(data.age),
      monthlyIncome: Number.parseFloat(data.monthlyIncome),
      debtRatio: Number.parseFloat(data.debtRatio),
      creditUtilization: Number.parseFloat(data.creditUtilization),
      openCreditLines: Number.parseInt(data.openCreditLines),
      realEstateLoans: Number.parseInt(data.realEstateLoans),
      dependents: Number.parseInt(data.dependents),
      late30Days: Number.parseInt(data.late30Days),
      late60Days: Number.parseInt(data.late60Days),
      late90Days: Number.parseInt(data.late90Days),
    }

    // Calculate risk score (simplified model for demo)
    // In production, this would load the actual trained model
    let riskScore = 0

    // Late payments are the strongest predictor
    riskScore += features.late90Days * 0.28
    riskScore += features.late60Days * 0.15
    riskScore += features.late30Days * 0.08

    // Credit utilization
    riskScore += features.creditUtilization * 0.19

    // Debt ratio
    riskScore += (features.debtRatio / 10) * 0.15

    // Age (younger = slightly higher risk)
    if (features.age < 30) riskScore += 0.05

    // Income (lower = higher risk)
    if (features.monthlyIncome < 3000) riskScore += 0.08
    else if (features.monthlyIncome < 5000) riskScore += 0.04

    // Normalize to probability (0-1)
    const defaultProbability = Math.min(Math.max(riskScore / 2, 0.05), 0.95)

    // Determine risk level
    let riskLevel = "Low Risk"
    if (defaultProbability >= 0.6) riskLevel = "High Risk"
    else if (defaultProbability >= 0.3) riskLevel = "Medium Risk"

    // Generate recommendation
    let recommendation = ""
    if (defaultProbability < 0.3) {
      recommendation = "✓ Approve - Low default risk. Borrower shows strong financial indicators."
    } else if (defaultProbability < 0.6) {
      recommendation = "⚠ Review - Moderate risk. Consider additional verification or adjusted terms."
    } else {
      recommendation = "✗ Decline - High default risk. Significant concerns in payment history and financial profile."
    }

    // Identify top risk factors
    const topFactors = []
    if (features.late90Days > 0) {
      topFactors.push({ factor: "90+ Days Late Payments", impact: "high" })
    }
    if (features.creditUtilization > 0.5) {
      topFactors.push({ factor: "High Credit Utilization", impact: "high" })
    }
    if (features.debtRatio > 0.5) {
      topFactors.push({ factor: "High Debt-to-Income Ratio", impact: "high" })
    }
    if (features.monthlyIncome < 3000) {
      topFactors.push({ factor: "Low Monthly Income", impact: "medium" })
    }
    if (features.age < 30) {
      topFactors.push({ factor: "Young Age", impact: "low" })
    }

    // If no risk factors, add positive indicators
    if (topFactors.length === 0) {
      topFactors.push({ factor: "Clean Payment History", impact: "low" })
      topFactors.push({ factor: "Healthy Credit Utilization", impact: "low" })
    }

    return NextResponse.json({
      defaultProbability,
      riskLevel,
      recommendation,
      topFactors: topFactors.slice(0, 5),
    })
  } catch (error) {
    console.error("[v0] Prediction API error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
