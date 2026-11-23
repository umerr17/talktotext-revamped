import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"
import { usePageTitle } from "@/hooks/use-page-title"

export default function ProfilePage() {
  usePageTitle("Profile")
  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link to="/dashboard" className="group inline-flex items-center gap-0.5 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Profile</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage your personal information and account preferences.</p>
        </div>

        <ProfileForm />
      </div>
    </div>
  )
}
