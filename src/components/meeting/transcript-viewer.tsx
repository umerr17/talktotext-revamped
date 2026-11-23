import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TranscriptSegment {
  id: string
  speaker: string
  timestamp: string
  text: string
  confidence?: number
  startSeconds?: number
}

interface TranscriptViewerProps {
  transcript: TranscriptSegment[]
  audioUrl?: string
  hasTimestamps?: boolean
  /** When this key changes, scroll to the segment closest to jumpToSeconds. */
  jumpToSeconds?: number | null
  jumpKey?: number
  /** Shown above the transcript when hasTimestamps is false. */
  noTimestampsMessage?: string
}

export function TranscriptViewer({
  transcript,
  audioUrl,
  hasTimestamps = false,
  jumpToSeconds = null,
  jumpKey = 0,
  noTimestampsMessage = "Line-by-line timestamps aren't available for this recording. Re-upload it to add them.",
}: TranscriptViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00:00")
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const segmentRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const highlightTimeoutRef = useRef<number | null>(null)

  const filteredTranscript = transcript.filter(
    (segment) =>
      segment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segment.speaker.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const speakerLabels = new Set(
    transcript.map((segment) => segment.speaker).filter((speaker) => Boolean(speaker)),
  )
  const showSpeakers = speakerLabels.size > 1

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.95) return "bg-success"
    if (confidence >= 0.9) return "bg-warning"
    return "bg-destructive"
  }

  const highlightSegment = (segmentId: string) => {
    setHighlightedId(segmentId)
    if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current)
    highlightTimeoutRef.current = window.setTimeout(() => setHighlightedId(null), 2600)
  }

  useEffect(() => {
    if (jumpToSeconds === null || jumpToSeconds === undefined) return

    if (searchTerm) setSearchTerm("")

    const timedSegments = transcript.filter((segment) => typeof segment.startSeconds === "number")
    if (timedSegments.length === 0) return

    let closest = timedSegments[0]
    let closestDiff = Math.abs((closest.startSeconds ?? 0) - jumpToSeconds)

    for (const segment of timedSegments.slice(1)) {
      const diff = Math.abs((segment.startSeconds ?? 0) - jumpToSeconds)
      if (diff < closestDiff) {
        closest = segment
        closestDiff = diff
      }
    }

    // Wait briefly so clearing the search has restored every row before scrolling.
    const timeout = window.setTimeout(() => {
      const element = segmentRefs.current[closest.id]
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        highlightSegment(closest.id)
      }
    }, 50)

    return () => window.clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpKey, jumpToSeconds])

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current)
    }
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const jumpToTimestamp = (segment: TranscriptSegment) => {
    setCurrentTime(segment.timestamp)
    highlightSegment(segment.id)
    segmentRefs.current[segment.id]?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const renderHighlightedText = (text: string) => {
    const query = searchTerm.trim()
    if (!query) return text

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return text.split(new RegExp(`(${escaped})`, "gi")).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="rounded bg-primary/20 px-0.5 text-foreground">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      {audioUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                Audio Playback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={handlePlayPause} size="icon">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">{currentTime} / 45:32</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Transcript */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Full Transcript
                </CardTitle>
                <CardDescription>
                  {hasTimestamps
                    ? "Transcript with line-by-line timestamps. Search it or jump from a chat citation."
                    : "AI-generated transcript of the recording."}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transcript..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!hasTimestamps && (
              <div className="mb-3 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                {noTimestampsMessage}
              </div>
            )}
            <div className="h-[600px] w-full overflow-y-auto pr-2">
              <div className="divide-y divide-border/50">
                {filteredTranscript.map((segment) => {
                  const lowConfidence =
                    typeof segment.confidence === "number" &&
                    segment.confidence > 0 &&
                    segment.confidence < 0.9

                  return (
                    <div
                      key={segment.id}
                      ref={(element) => {
                        segmentRefs.current[segment.id] = element
                      }}
                      className={cn(
                        "group flex scroll-mt-6 gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40",
                        highlightedId === segment.id &&
                          "bg-primary/5 ring-1 ring-primary/30",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => jumpToTimestamp(segment)}
                        title={`Jump to ${segment.timestamp}`}
                        aria-label={`Jump to ${segment.timestamp}`}
                        className="mt-0.5 w-16 shrink-0 rounded px-1 py-0.5 text-left font-mono text-xs tabular-nums text-primary transition-colors hover:bg-primary/10"
                      >
                        {segment.timestamp}
                      </button>

                      <div className="min-w-0 flex-1">
                        {showSpeakers && segment.speaker && (
                          <span className="mb-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {segment.speaker}
                          </span>
                        )}
                        <p className="whitespace-pre-wrap leading-7 text-foreground">
                          {renderHighlightedText(segment.text)}
                        </p>
                      </div>

                      {lowConfidence && (
                        <span
                          className={cn(
                            "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                            getConfidenceColor(segment.confidence as number),
                          )}
                          title={`Low confidence: ${((segment.confidence as number) * 100).toFixed(0)}%`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {filteredTranscript.length === 0 && (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  {searchTerm ? "No results found" : "Transcript unavailable"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms or clear the search to view all transcript lines."
                    : "This recording doesn't have a transcript yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
