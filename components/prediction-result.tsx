import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PredictionResultProps {
  prediction: {
    defaultProbability?: number
    confidence?: number
    riskLevel?: string
    recommendation?: string
    suggestedRate?: number
    pricingDecision?: string
    topFactors?: Array<{ factor: string; impact: string }>
    error?: string
  }
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  if (prediction.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{prediction.error}</AlertDescription>
      </Alert>
    )
  }

  const probability = prediction.defaultProbability || 0
  const riskLevel = prediction.riskLevel || "Unknown"

  const getRiskColor = () => {
    if (probability < 0.3) return "text-success"
    if (probability < 0.6) return "text-warning"
    return "text-destructive"
  }

  const getRiskBadgeVariant = () => {
    if (probability < 0.3) return "default"
    if (probability < 0.6) return "secondary"
    return "destructive"
  }

  const getCardBorderColor = () => {
    if (probability < 0.3) return "border-green-500"
    if (probability < 0.6) return "border-yellow-500"
    return "border-red-500"
  }

  const getCardBgColor = () => {
    if (probability < 0.3) return "bg-green-50"
    if (probability < 0.6) return "bg-yellow-50"
    return "bg-red-50"
  }

  return (
    <Card className={`border-2 ${getCardBorderColor()} ${getCardBgColor()}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">Prediction Results</CardTitle>
            <CardDescription className="text-slate-600">AI-generated risk assessment</CardDescription>
          </div>
          <Badge 
            className={`text-sm px-3 py-1 ${
              probability < 0.3 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : probability < 0.6 
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}
          >
            {riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white border border-slate-200">
            <div className="text-center">
              <div className="text-sm font-medium text-slate-600 mb-2">Default Risk</div>
              <div className={`text-3xl font-bold mb-3 ${getRiskColor()}`}>{(probability * 100).toFixed(1)}%</div>
              <Progress value={probability * 100} className="h-2" />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white border border-slate-200">
            <div className="text-center">
              <div className="text-sm font-medium text-slate-600 mb-2">Model Confidence</div>
              <div className="text-3xl font-bold text-slate-800 mb-3">{prediction.confidence?.toFixed(0)}%</div>
              <Progress value={prediction.confidence || 0} className="h-2" />
            </div>
          </div>
        </div>

        {/* Pricing Decision */}
        {prediction.suggestedRate && (
          <div className={`p-4 rounded-lg border-2 ${
            prediction.pricingDecision === 'APPROVE_PRIME' 
              ? 'border-green-200 bg-green-50' 
              : prediction.pricingDecision === 'APPROVE_STANDARD'
              ? 'border-blue-200 bg-blue-50'
              : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">Suggested Interest Rate</h4>
                <p className="text-sm text-slate-600">Risk-adjusted pricing recommendation</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">{prediction.suggestedRate.toFixed(1)}%</div>
                <div className="text-sm text-slate-600">APR</div>
              </div>
            </div>
          </div>
        )}

        {/* Final Decision */}
        <Alert className={`${
          prediction.pricingDecision === 'DECLINE'
            ? 'border-red-200 bg-red-50'
            : prediction.pricingDecision === 'APPROVE_PRIME'
            ? 'border-green-200 bg-green-50'
            : 'border-blue-200 bg-blue-50'
        }`}>
          {prediction.pricingDecision === 'DECLINE' ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={`font-medium ${
            prediction.pricingDecision === 'DECLINE'
              ? 'text-red-800'
              : prediction.pricingDecision === 'APPROVE_PRIME'
              ? 'text-green-800'
              : 'text-blue-800'
          }`}>
            {prediction.recommendation}
          </AlertDescription>
        </Alert>

        {/* Top Risk Factors */}
        {prediction.topFactors && prediction.topFactors.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Key Risk Factors</h4>
            <div className="space-y-2">
              {prediction.topFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">{factor.factor}</span>
                  <div className="flex items-center gap-2">
                    {factor.impact === "high" ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-success" />
                    )}
                    <span className="text-xs font-medium capitalize">{factor.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
