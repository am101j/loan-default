"use client"

import { Suspense, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PredictionForm } from "@/components/prediction-form"
import { ModelInsights } from "@/components/model-insights"
import { RiskFactors } from "@/components/risk-factors"
import { RiskSlider } from "@/components/risk-slider"
import { BatchProcessor } from "@/components/batch-processor"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [activeTab, setActiveTab] = useState('underwriting')

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="space-y-4">
          {/* Approval Legend */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3">
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Prime (5.5-8%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Standard (8-12%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-slate-700">High-Rate (12-20%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium text-slate-700">Decline (>80%)</span>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'underwriting' && (
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
                  <PredictionForm />
                </Suspense>
              </div>
              <div>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <ModelInsights />
                </Suspense>
              </div>
            </div>
          )}

          {activeTab === 'batch' && (
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <BatchProcessor />
            </Suspense>
          )}

          {activeTab === 'risk-modeling' && (
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <RiskSlider />
            </Suspense>
          )}

          {activeTab === 'analytics' && (
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <RiskFactors />
            </Suspense>
          )}


        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>RiskPulse AI • Built with Next.js, XGBoost & Advanced ML • Enterprise Risk Analytics Platform</p>
        </div>
      </footer>
    </div>
  )
}
