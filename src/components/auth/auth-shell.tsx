import type React from "react"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

interface AuthShellProps {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

/**
 * Shared layout for all auth screens: a quiet, centered column on a light-gray
 * surface. Purely presentational.
 */
export function AuthShell({ children, backHref = "/", backLabel = "Back to home" }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <header className="frosted flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          to={backHref}
          className="group inline-flex items-center gap-0.5 text-sm text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {backLabel}
        </Link>
        <Link to="/" className="text-sm font-semibold tracking-tight">
          TalkToText Pro
        </Link>
        <span className="w-24" aria-hidden="true" />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
