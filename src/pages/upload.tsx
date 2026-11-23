import { UploadZone } from "@/components/dashboard/upload-zone"
import { usePageTitle } from "@/hooks/use-page-title"

export default function UploadPage() {
  usePageTitle("Upload")
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Upload video</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload your meeting recordings to generate AI-powered transcriptions and structured notes.
        </p>
      </div>
      <UploadZone />
    </div>
  )
}
