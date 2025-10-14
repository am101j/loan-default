import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target } from "lucide-react"

export function ModelInsights() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Model Performance
          </CardTitle>
          <CardDescription>Random Forest Classifier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ROC-AUC Score</span>
              <span className="text-lg font-bold text-primary">0.8642</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Accuracy</span>
              <span className="text-lg font-bold">93.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Training Samples</span>
              <span className="text-lg font-bold">120,000+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Key Features
          </CardTitle>
          <CardDescription>Most important predictors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Late Payments (90+ days)", importance: 0.28 },
              { name: "Credit Utilization", importance: 0.19 },
              { name: "Debt-to-Income Ratio", importance: 0.15 },
              { name: "Age", importance: 0.12 },
              { name: "Monthly Income", importance: 0.1 },
            ].map((feature, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{feature.name}</span>
                  <span className="font-medium">{(feature.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${feature.importance * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
