import { AuthShell } from "@/components/auth/auth-shell"
import { SignupForm } from "@/components/auth/signup-form"
import { usePageTitle } from "@/hooks/use-page-title"

export default function SignupPage() {
  usePageTitle("Create Account")
  return (
    <AuthShell backHref="/" backLabel="Back to home">
      <SignupForm />
    </AuthShell>
  )
}
