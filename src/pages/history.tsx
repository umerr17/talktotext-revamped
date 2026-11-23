import { MeetingHistory } from "@/components/dashboard/meeting-history"
import { usePageTitle } from "@/hooks/use-page-title"

export default function HistoryPage() {
  usePageTitle("Meeting history")
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Meeting history</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View all your processed meetings, transcriptions, and generated notes.
        </p>
      </div>
      <MeetingHistory />
    </div>
  )
}
