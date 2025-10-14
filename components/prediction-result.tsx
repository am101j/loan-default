import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PredictionResultProps {
  prediction: {
    defaultProbability?: number
    riskLevel?: string
    recommendation?: string
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

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>AI-generated risk assessment</CardDescription>
          </div>
          <Badge variant={getRiskBadgeVariant()} className="text-sm px-3 py-1">
            {riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Probability */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Default Probability</span>
            <span className={`text-3xl font-bold ${getRiskColor()}`}>{(probability * 100).toFixed(1)}%</span>
          </div>
          <Progress value={probability * 100} className="h-3" />
        </div>

        {/* Recommendation */}
        <Alert>
          {probability < 0.3 ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-warning" />
          )}
          <AlertDescription className="font-medium">{prediction.recommendation}</AlertDescription>
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
