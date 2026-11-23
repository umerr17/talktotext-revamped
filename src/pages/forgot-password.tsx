import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { usePageTitle } from "@/hooks/use-page-title"

export default function ForgotPasswordPage() {
  usePageTitle("Forgot Password")
  return (
    <AuthShell backHref="/login" backLabel="Back to login">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
