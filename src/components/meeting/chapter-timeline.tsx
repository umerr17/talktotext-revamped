import { useEffect, useState } from "react";
import { Clock, ListTree } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMeetingChapters, MeetingChapter } from "@/lib/api";

interface ChapterTimelineProps {
  meetingId: string | number;
  hasTimestamps: boolean;
  onJump: (seconds: number) => void;
}

function formatTime(milliseconds: number): string {
  const total = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ChapterTimeline({ meetingId, hasTimestamps, onJump }: ChapterTimelineProps) {
  const [chapters, setChapters] = useState<MeetingChapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hasTimestamps) return;

    let cancelled = false;
    setIsLoading(true);
    setFailed(false);

    getMeetingChapters(meetingId)
      .then((data) => {
        if (!cancelled) setChapters(data);
      })
      .catch((error) => {
        console.error("Failed to load chapters", error);
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [meetingId, hasTimestamps]);

  if (!hasTimestamps || failed || (!isLoading && chapters.length === 0)) {
    return null;
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTree className="h-5 w-5 text-primary" />
          Timeline
        </CardTitle>
        <CardDescription>Jump to the part of the recording you need.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex gap-3 overflow-hidden">
            {[0, 1, 2].map((item) => (
              <div key={item} className="min-w-[190px] space-y-2 rounded-xl border bg-muted/20 p-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-40" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onJump(Math.floor(chapter.start_ms / 1000))}
                className="min-w-[190px] max-w-[240px] flex-shrink-0 rounded-xl border bg-muted/20 p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="flex items-center gap-1 text-xs font-mono text-primary">
                  <Clock className="h-3 w-3" />
                  {formatTime(chapter.start_ms)}
                </span>
                <p className="mt-1 text-sm font-semibold leading-snug">{chapter.title}</p>
                {chapter.summary && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {chapter.summary}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
