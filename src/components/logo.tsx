import { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/config"

/** Shows /public/logo.png; falls back to a text wordmark if the image is missing. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  const [failed, setFailed] = useState(false)

  return (
    <Link to="/" onClick={onClick} aria-label={`${APP_NAME} home`} className="flex items-center">
      {failed ? (
        <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
      ) : (
        <img
          src="/logo.png"
          alt={APP_NAME}
          onError={() => setFailed(true)}
          className={cn("h-8 w-auto", className)}
        />
      )}
    </Link>
  )
}
