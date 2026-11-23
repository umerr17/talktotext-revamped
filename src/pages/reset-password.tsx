import { AuthShell } from "@/components/auth/auth-shell"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { usePageTitle } from "@/hooks/use-page-title"

export default function ResetPasswordPage() {
  usePageTitle("Reset Password")
  return (
    <AuthShell backHref="/login" backLabel="Back to login">
      <ResetPasswordForm />
    </AuthShell>
  )
}
