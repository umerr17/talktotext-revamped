import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadZone } from "@/components/dashboard/upload-zone"
import { MeetingHistory } from "@/components/dashboard/meeting-history"
import { MesmerizingStats } from "@/components/dashboard/mesmerizing-stats"
import { MesmerizingCharts } from "@/components/dashboard/mesmerizing-charts"
import { useUser } from "@/context/user-provider"
import { usePageTitle } from "@/hooks/use-page-title"

export default function DashboardPage() {
  usePageTitle("Dashboard")
  const { user } = useUser()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Transform your meeting recordings into structured notes with AI.
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/dashboard/upload">
            <Plus />
            New upload
          </Link>
        </Button>
      </div>

      <MesmerizingStats />
      <MesmerizingCharts />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Quick upload</h2>
          <p className="text-sm text-muted-foreground">Drop a new recording to get started. Ongoing tasks appear below.</p>
        </div>
        <UploadZone />
      </section>

      <MeetingHistory />
    </div>
  )
}
