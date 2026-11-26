import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NotesPreferences } from "@/components/notes/notes-preferences";
import { useToast } from "@/hooks/use-toast";
import { applyMeetingNotes, rewriteMeetingNotes } from "@/lib/api";
import {
  DEFAULT_NOTES_LANGUAGE,
  DEFAULT_NOTES_LENGTH,
  type NotesLength,
} from "@/lib/notes-preferences";

interface NotesRewriteDialogProps {
  meetingId: string | number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplied: (notes: string) => void;
}

const PRESETS: Array<{ label: string; instruction: string; length?: NotesLength }> = [
  {
    label: "Shorter",
    instruction: "Make the notes significantly shorter and easier to scan.",
    length: "short",
  },
  {
    label: "More detail",
    instruction: "Add more detail and context to every section, using the transcript.",
    length: "long",
  },
  {
    label: "Focus on action items",
    instruction:
      "Emphasize action items and decisions. Be specific about owners and deadlines only when the transcript supports them.",
  },
  {
    label: "Client-ready",
    instruction:
      "Rewrite the notes in a polished, professional, client-ready tone while keeping all facts accurate.",
  },
  {
    label: "Bullet points",
    instruction: "Convert prose into concise bullet points throughout the notes.",
  },
];

export function NotesRewriteDialog({
  meetingId,
  open,
  onOpenChange,
  onApplied,
}: NotesRewriteDialogProps) {
  const { toast } = useToast();
  const [instructions, setInstructions] = useState("");
  const [length, setLength] = useState<NotesLength>(DEFAULT_NOTES_LENGTH);
  const [language, setLanguage] = useState(DEFAULT_NOTES_LANGUAGE);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setInstructions("");
      setLength(DEFAULT_NOTES_LENGTH);
      setLanguage(DEFAULT_NOTES_LANGUAGE);
      setPreview(null);
      setIsLoading(false);
      setIsApplying(false);
      setError(null);
    }
  }, [open]);

  const handleRewrite = async () => {
    setIsLoading(true);
    setError(null);
    setPreview(null);
    try {
      const result = await rewriteMeetingNotes(meetingId, {
        instructions: instructions.trim(),
        length,
        language,
      });
      setPreview(result.notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not rewrite the notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!preview) return;
    setIsApplying(true);
    setError(null);
    try {
      await applyMeetingNotes(meetingId, preview);
      onApplied(preview);
      toast({
        title: "Notes updated",
        description: "The rewritten notes are now live on this meeting.",
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the rewritten notes.");
    } finally {
      setIsApplying(false);
    }
  };

  const busy = isLoading || isApplying;

  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Rewrite meeting notes
          </DialogTitle>
          <DialogDescription>
            Choose the size and language, then tell the AI what to change. You&apos;ll see a preview
            first, and nothing is saved until you click Apply.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/20 p-3">
            <NotesPreferences
              length={length}
              language={language}
              onLengthChange={setLength}
              onLanguageChange={setLanguage}
              showFocus={false}
              disabled={busy}
              idPrefix="rewrite"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setInstructions(preset.instruction);
                  if (preset.length) setLength(preset.length);
                }}
                disabled={busy}
                className="rounded-full border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="rewrite-instructions" className="text-sm font-medium">
              What should change?
            </label>
            <textarea
              id="rewrite-instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              rows={3}
              maxLength={2000}
              disabled={busy}
              placeholder="Example: Make this shorter, focus on the marketing decisions, and add clearer owners to each action item."
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to improve structure and clarity without changing the content.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Reading the transcript and rewriting the notes...
            </div>
          )}

          {preview && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Preview</p>
                <span className="text-xs text-muted-foreground">Not saved yet</span>
              </div>
              <div className="max-h-[45vh] overflow-y-auto rounded-md border bg-muted/20 p-4 text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-semibold first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="mb-1.5 mt-4 text-sm font-semibold first:mt-0">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {preview}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          {preview ? (
            <>
              <Button variant="outline" onClick={handleRewrite} disabled={busy}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Try again
              </Button>
              <Button onClick={handleApply} disabled={busy}>
                {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Apply to notes
              </Button>
            </>
          ) : (
            <Button onClick={handleRewrite} disabled={busy}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Rewrite notes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
