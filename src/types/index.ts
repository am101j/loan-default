export interface LoanApplication {
  age: number
  monthlyIncome: number
  debtRatio: number
  creditUtilization: number
  openCreditLines: number
  realEstateLoans: number
  dependents: number
  late30Days: number
  late60Days: number
  late90Days: number
}

export interface PredictionResult {
  defaultProbability: number
  suggestedRate: number
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk'
  confidence: number
  approvalStatus: 'Prime' | 'Standard' | 'High-Rate' | 'Decline'
}

export interface OCRResult {
  success: boolean
  extractedData: Partial<LoanApplication>
  rawText: string
  message: string
  error?: string
}

export interface BatchProcessingResult {
  id: string
  application: LoanApplication
  prediction: PredictionResult
  status: 'processed' | 'error'
}

export type RiskTier = 'prime' | 'standard' | 'high-rate' | 'decline'

export interface ModelMetrics {
  accuracy: number
  rocAuc: number
  precision: number
  recall: number
  f1Score: number
}