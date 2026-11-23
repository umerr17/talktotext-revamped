import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      // Store the token, then go to the dashboard
      localStorage.setItem("token", token)
      navigate("/dashboard", { replace: true })
    } else {
      // No token: back to login with an error
      navigate("/login?error=auth_failed", { replace: true })
    }
  }, [navigate, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Signing in</CardTitle>
          <CardDescription>Please wait while we authenticate your account...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    </div>
  )
}
