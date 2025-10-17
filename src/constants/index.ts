export const RISK_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.6,
  HIGH: 0.8
} as const

export const APPROVAL_CATEGORIES = {
  PRIME: { min: 0, max: 0.3, rate: { min: 5.5, max: 8 }, color: 'green' },
  STANDARD: { min: 0.3, max: 0.6, rate: { min: 8, max: 12 }, color: 'blue' },
  HIGH_RATE: { min: 0.6, max: 0.8, rate: { min: 12, max: 20 }, color: 'yellow' },
  DECLINE: { min: 0.8, max: 1, rate: { min: 20, max: 25 }, color: 'red' }
} as const

export const MODEL_CONFIG = {
  BASE_RATE: 5.5,
  MAX_RISK_PREMIUM: 15,
  CONFIDENCE_THRESHOLD: 0.7
} as const

export const OCR_CONFIG = {
  TESSERACT_PSM_MODE: '6',
  CHAR_WHITELIST: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .:$,%',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp']
} as const

export const API_ENDPOINTS = {
  PREDICT: '/api/predict',
  OCR: '/api/ocr',
  BATCH: '/api/batch'
} as const