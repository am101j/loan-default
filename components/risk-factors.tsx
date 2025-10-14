import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp } from "lucide-react"

const riskData = [
  { factor: "Late 90+ Days", defaulters: 2.8, nonDefaulters: 0.2 },
  { factor: "Credit Util.", defaulters: 0.68, nonDefaulters: 0.42 },
  { factor: "Debt Ratio", defaulters: 8.2, nonDefaulters: 5.1 },
  { factor: "Age", defaulters: 48, nonDefaulters: 52 },
  { factor: "Income ($K)", defaulters: 5.2, nonDefaulters: 6.8 },
]

export function RiskFactors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Risk Factor Analysis
        </CardTitle>
        <CardDescription>Comparison of key metrics between defaulters and non-defaulters</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
            <XAxis dataKey="factor" stroke="rgb(var(--color-muted-foreground))" fontSize={12} />
            <YAxis stroke="rgb(var(--color-muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(var(--color-card))",
                border: "1px solid rgb(var(--color-border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="defaulters" fill="rgb(var(--color-destructive))" name="Defaulters" />
            <Bar dataKey="nonDefaulters" fill="rgb(var(--color-success))" name="Non-Defaulters" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
