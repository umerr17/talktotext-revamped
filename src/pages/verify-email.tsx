import { AuthShell } from "@/components/auth/auth-shell"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"
import { usePageTitle } from "@/hooks/use-page-title"

export default function VerifyEmailPage() {
  usePageTitle("Verify Email")
  return (
    <AuthShell backHref="/" backLabel="Back to home">
      <VerifyEmailForm />
    </AuthShell>
  )
}
