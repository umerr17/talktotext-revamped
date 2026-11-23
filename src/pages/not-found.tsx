import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { usePageTitle } from "@/hooks/use-page-title"

export default function NotFoundPage() {
  usePageTitle("Page not found")
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-6 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">Page not found.</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}
