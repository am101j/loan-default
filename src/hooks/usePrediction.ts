import { useState, useCallback } from 'react'
import { LoanApplication, PredictionResult } from '@/src/types'
import { API_ENDPOINTS } from '@/src/constants'

interface UsePredictionReturn {
  prediction: PredictionResult | null
  loading: boolean
  error: string | null
  predict: (application: LoanApplication) => Promise<void>
  reset: () => void
}

export const usePrediction = (): UsePredictionReturn => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = useCallback(async (application: LoanApplication) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(API_ENDPOINTS.PREDICT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setPrediction(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Prediction failed'
      setError(errorMessage)
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setPrediction(null)
    setError(null)
  }, [])

  return {
    prediction,
    loading,
    error,
    predict,
    reset
  }
}