import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PredictionForm } from "@/components/prediction-form"
import { ModelInsights } from "@/components/model-insights"
import { RiskFactors } from "@/components/risk-factors"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4 py-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Loan Default <span className="gradient-text">Prediction</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              AI-powered risk assessment to help banks make smarter lending decisions with real-time probability
              predictions and actionable insights.
            </p>
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Prediction Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
                <PredictionForm />
              </Suspense>
            </div>

            {/* Sidebar - Model Info */}
            <div className="space-y-6">
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <ModelInsights />
              </Suspense>
            </div>
          </div>

          {/* Risk Factors Analysis */}
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <RiskFactors />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Python, and Scikit-learn • Data Science Portfolio Project</p>
        </div>
      </footer>
    </div>
  )
}
