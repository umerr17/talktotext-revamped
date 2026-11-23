import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
}

export function TranscriptViewer({
  transcript,
  audioUrl,
  hasTimestamps = false,
  jumpToSeconds = null,
  jumpKey = 0,
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

    const element = segmentRefs.current[closest.id]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      highlightSegment(closest.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpKey, jumpToSeconds])

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current)
    }
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control audio playback
  }

  const jumpToTimestamp = (segment: TranscriptSegment) => {
    setCurrentTime(segment.timestamp)
    highlightSegment(segment.id)
    segmentRefs.current[segment.id]?.scrollIntoView({ behavior: "smooth", block: "center" })
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
                    ? "Speaker-aware transcript with exact timestamps. Search it or jump from a chat citation."
                    : "AI-generated transcript of the recording."}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <div className="h-[600px] w-full overflow-y-auto pr-2">
              <div className="space-y-4">
                {filteredTranscript.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    ref={(element) => {
                      segmentRefs.current[segment.id] = element
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index, 10) * 0.05 }}
                    className={cn(
                      "group rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/50",
                      highlightedId === segment.id &&
                        "border-primary/40 bg-primary/5 ring-2 ring-primary/30",
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="font-medium">
                          {segment.speaker}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-primary"
                          onClick={() => jumpToTimestamp(segment)}
                        >
                          {segment.timestamp}
                        </Button>
                      </div>
                      {typeof segment.confidence === "number" && segment.confidence > 0 && (
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-2 w-2 rounded-full ${getConfidenceColor(segment.confidence)}`}
                            title={`Confidence: ${(segment.confidence * 100).toFixed(1)}%`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {(segment.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="leading-7 text-foreground whitespace-pre-wrap">
                      {searchTerm
                        ? segment.text.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")).map((part, i) =>
                            part.toLowerCase() === searchTerm.toLowerCase() ? (
                              <mark key={i} className="rounded bg-primary/20 px-0.5 text-foreground">
                                {part}
                              </mark>
                            ) : (
                              part
                            ),
                          )
                        : segment.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            {filteredTranscript.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or clear the search to view all transcript segments.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
