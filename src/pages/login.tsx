import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
import { usePageTitle } from "@/hooks/use-page-title"

export default function LoginPage() {
  usePageTitle("Sign In")
  return (
    <AuthShell backHref="/" backLabel="Back to home">
      <LoginForm />
    </AuthShell>
  )
}
