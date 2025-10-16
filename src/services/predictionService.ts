import { LoanApplication, PredictionResult } from '@/src/types'
import { MODEL_CONFIG, APPROVAL_CATEGORIES } from '@/src/constants'

export class PredictionService {
  static async predictDefault(application: LoanApplication): Promise<PredictionResult> {
    try {
      // Validate input data
      this.validateApplication(application)
      
      // Calculate risk score using weighted factors
      const riskScore = this.calculateRiskScore(application)
      
      // Convert to probability
      const defaultProbability = Math.min(Math.max(riskScore, 0.01), 0.99)
      
      // Calculate suggested rate
      const suggestedRate = this.calculateSuggestedRate(defaultProbability)
      
      // Determine risk level and approval status
      const riskLevel = this.getRiskLevel(defaultProbability)
      const approvalStatus = this.getApprovalStatus(defaultProbability)
      
      // Calculate confidence based on data completeness
      const confidence = this.calculateConfidence(application)
      
      return {
        defaultProbability,
        suggestedRate,
        riskLevel,
        confidence,
        approvalStatus
      }
    } catch (error) {
      throw new Error(`Prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static validateApplication(app: LoanApplication): void {
    const required = ['age', 'monthlyIncome', 'debtRatio', 'creditUtilization']
    const missing = required.filter(field => app[field as keyof LoanApplication] == null)
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }
    
    if (app.age < 18 || app.age > 100) {
      throw new Error('Age must be between 18 and 100')
    }
    
    if (app.monthlyIncome <= 0) {
      throw new Error('Monthly income must be positive')
    }
  }

  private static calculateRiskScore(app: LoanApplication): number {
    let score = 0
    
    // Late payment history (highest weight)
    score += (app.late90Days || 0) * 0.35
    score += (app.late60Days || 0) * 0.25
    score += (app.late30Days || 0) * 0.15
    
    // Credit utilization
    score += Math.min(app.creditUtilization, 1.5) * 0.20
    
    // Debt-to-income ratio
    score += Math.min(app.debtRatio, 2.0) * 0.15
    
    // Age factor (younger = higher risk)
    if (app.age < 25) score += 0.08
    else if (app.age < 35) score += 0.04
    
    // Income factor
    if (app.monthlyIncome < 2500) score += 0.10
    else if (app.monthlyIncome < 4000) score += 0.05
    
    // Credit lines (too few or too many = risk)
    const creditLines = app.openCreditLines || 5
    if (creditLines < 3 || creditLines > 20) score += 0.05
    
    // Dependents
    score += Math.min((app.dependents || 0) * 0.02, 0.08)
    
    return score
  }

  private static calculateSuggestedRate(probability: number): number {
    const baseRate = MODEL_CONFIG.BASE_RATE
    const riskPremium = probability * MODEL_CONFIG.MAX_RISK_PREMIUM
    return Math.round((baseRate + riskPremium) * 10) / 10
  }

  private static getRiskLevel(probability: number): PredictionResult['riskLevel'] {
    if (probability < 0.3) return 'Low Risk'
    if (probability < 0.6) return 'Medium Risk'
    return 'High Risk'
  }

  private static getApprovalStatus(probability: number): PredictionResult['approvalStatus'] {
    if (probability < 0.3) return 'Prime'
    if (probability < 0.6) return 'Standard'
    if (probability < 0.8) return 'High-Rate'
    return 'Decline'
  }

  private static calculateConfidence(app: LoanApplication): number {
    const fields = Object.values(app).filter(v => v != null && v !== '')
    const completeness = fields.length / 10 // Total expected fields
    
    // Base confidence on data completeness and consistency
    let confidence = completeness * 0.8
    
    // Boost confidence for critical fields
    if (app.late90Days != null && app.late30Days != null) confidence += 0.1
    if (app.monthlyIncome > 0 && app.debtRatio > 0) confidence += 0.1
    
    return Math.min(confidence, 1.0)
  }
}