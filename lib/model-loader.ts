// Model loader utility for production use
// Note: This would require a Python service or ONNX conversion for browser use

export interface ModelPrediction {
  defaultProbability: number;
  riskLevel: string;
  recommendation: string;
  topFactors: Array<{ factor: string; impact: string }>;
}

export function calculateRiskScore(features: any): ModelPrediction {
  // Current simplified implementation
  // In production, this would call the actual trained model
  
  let riskScore = 0;
  
  // Late payments (strongest predictors)
  riskScore += features.late90Days * 0.28;
  riskScore += features.late60Days * 0.15;
  riskScore += features.late30Days * 0.08;
  
  // Credit utilization
  riskScore += features.creditUtilization * 0.19;
  
  // Debt ratio
  riskScore += (features.debtRatio / 10) * 0.15;
  
  // Age factor
  if (features.age < 30) riskScore += 0.05;
  
  // Income factor
  if (features.monthlyIncome < 3000) riskScore += 0.08;
  else if (features.monthlyIncome < 5000) riskScore += 0.04;
  
  const defaultProbability = Math.min(Math.max(riskScore / 2, 0.05), 0.95);
  
  let riskLevel = "Low Risk";
  if (defaultProbability >= 0.6) riskLevel = "High Risk";
  else if (defaultProbability >= 0.3) riskLevel = "Medium Risk";
  
  let recommendation = "";
  if (defaultProbability < 0.3) {
    recommendation = "✓ Approve - Low default risk. Strong financial indicators.";
  } else if (defaultProbability < 0.6) {
    recommendation = "⚠ Review - Moderate risk. Consider additional verification.";
  } else {
    recommendation = "✗ Decline - High default risk. Significant payment concerns.";
  }
  
  const topFactors = [];
  if (features.late90Days > 0) {
    topFactors.push({ factor: "90+ Days Late Payments", impact: "high" });
  }
  if (features.creditUtilization > 0.5) {
    topFactors.push({ factor: "High Credit Utilization", impact: "high" });
  }
  if (features.debtRatio > 0.5) {
    topFactors.push({ factor: "High Debt-to-Income Ratio", impact: "high" });
  }
  if (features.monthlyIncome < 3000) {
    topFactors.push({ factor: "Low Monthly Income", impact: "medium" });
  }
  
  if (topFactors.length === 0) {
    topFactors.push({ factor: "Clean Payment History", impact: "low" });
  }
  
  return {
    defaultProbability,
    riskLevel,
    recommendation,
    topFactors: topFactors.slice(0, 5)
  };
}