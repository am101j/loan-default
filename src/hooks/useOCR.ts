import { useState, useCallback } from 'react'
import { OCRResult } from '@/src/types'
import { API_ENDPOINTS } from '@/src/constants'
import { ValidationUtils } from '@/src/utils/validation'

interface UseOCRReturn {
  result: OCRResult | null
  loading: boolean
  error: string | null
  processDocument: (file: File, useHandwriting?: boolean) => Promise<void>
  reset: () => void
}

export const useOCR = (): UseOCRReturn => {
  const [result, setResult] = useState<OCRResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processDocument = useCallback(async (file: File, useHandwriting = false) => {
    setLoading(true)
    setError(null)
    
    try {
      // Validate file before upload
      const validationErrors = ValidationUtils.validateFileUpload(file)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }
      
      const formData = new FormData()
      formData.append('image', file)
      if (useHandwriting) {
        formData.append('handwriting', 'true')
      }
      
      const response = await fetch(API_ENDPOINTS.OCR, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const ocrResult = await response.json()
      
      if (!ocrResult.success) {
        throw new Error(ocrResult.error || 'OCR processing failed')
      }
      
      setResult(ocrResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OCR processing failed'
      setError(errorMessage)
      console.error('OCR error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    result,
    loading,
    error,
    processDocument,
    reset
  }
}