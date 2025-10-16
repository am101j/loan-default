"use client"

import { Shield } from "lucide-react"

interface DashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  const navItems = [
    { id: 'underwriting', label: 'Credit Underwriting', icon: '📋' },
    { id: 'batch', label: 'Portfolio Analysis', icon: '📊' },
    { id: 'risk-modeling', label: 'Risk Modeling', icon: '🎯' },
    { id: 'analytics', label: 'Market Analytics', icon: '📈' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-6">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CreditVision</h1>
              <p className="text-sm text-slate-300">Enterprise Risk Platform</p>
            </div>
          </div>
          <div className="text-sm text-slate-300">
            Risk Engine v2.1 | Live
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex space-x-0 border-t border-slate-700">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-6 py-3 text-sm font-medium border-r border-slate-700 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}