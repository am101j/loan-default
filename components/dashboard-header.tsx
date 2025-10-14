import { Activity, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">LoanGuard AI</h1>
            <p className="text-xs text-muted-foreground">Risk Assessment Platform</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              View Code
            </a>
          </Button>
          <Button size="sm">Get Started</Button>
        </nav>
      </div>
    </header>
  )
}
