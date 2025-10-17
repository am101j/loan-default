import { LoanApplication } from '@/src/types'

export class ValidationUtils {
  static validateLoanApplication(data: Partial<LoanApplication>): string[] {
    const errors: string[] = []
    
    // Required field validation
    const requiredFields: (keyof LoanApplication)[] = [
      'monthlyIncome', 'debtRatio', 'creditUtilization'
    ]
    
    requiredFields.forEach(field => {
      if (data[field] == null || data[field] === '') {
        errors.push(`${this.formatFieldName(field)} is required`)
      }
    })
    

    
    if (data.monthlyIncome != null) {
      if (data.monthlyIncome <= 0) {
        errors.push('Monthly income must be positive')
      }
      if (data.monthlyIncome > 1000000) {
        errors.push('Monthly income seems unrealistic')
      }
    }
    
    if (data.debtRatio != null) {
      if (data.debtRatio < 0 || data.debtRatio > 5) {
        errors.push('Debt ratio must be between 0 and 5')
      }
    }
    
    if (data.creditUtilization != null) {
      if (data.creditUtilization < 0 || data.creditUtilization > 2) {
        errors.push('Credit utilization must be between 0 and 2')
      }
    }
    
    // Non-negative validations
    const nonNegativeFields: (keyof LoanApplication)[] = [
      'openCreditLines', 'realEstateLoans', 'dependents', 
      'late30Days', 'late60Days', 'late90Days'
    ]
    
    nonNegativeFields.forEach(field => {
      if (data[field] != null && data[field]! < 0) {
        errors.push(`${this.formatFieldName(field)} cannot be negative`)
      }
    })
    
    return errors
  }
  
  static validateFileUpload(file: File): string[] {
    const errors: string[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB')
    }
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be JPEG, PNG, WebP, or PDF')
    }
    
    return errors
  }
  
  private static formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }
}

export const sanitizeInput = (value: string): string => {
  return value.trim().replace(/[<>\"']/g, '')
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
}