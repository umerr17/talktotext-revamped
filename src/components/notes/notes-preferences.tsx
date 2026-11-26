import { AlignLeft, Languages, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  MAX_NOTES_FOCUS_LENGTH,
  NOTES_LANGUAGES,
  NOTES_LENGTH_OPTIONS,
  type NotesLength,
} from "@/lib/notes-preferences";

interface NotesPreferencesProps {
  length: NotesLength;
  language: string;
  focus?: string;
  onLengthChange: (value: NotesLength) => void;
  onLanguageChange: (value: string) => void;
  onFocusChange?: (value: string) => void;
  disabled?: boolean;
  showFocus?: boolean;
  idPrefix?: string;
  className?: string;
}

export function NotesPreferences({
  length,
  language,
  focus = "",
  onLengthChange,
  onLanguageChange,
  onFocusChange,
  disabled = false,
  showFocus = true,
  idPrefix = "notes",
  className,
}: NotesPreferencesProps) {
  const selectedLength = NOTES_LENGTH_OPTIONS.find((option) => option.value === length);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <AlignLeft className="h-3.5 w-3.5" />
            Notes length
          </Label>
          <div className="grid grid-cols-3 gap-1 rounded-lg border bg-muted/30 p-1">
            {NOTES_LENGTH_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onLengthChange(option.value)}
                disabled={disabled}
                aria-pressed={length === option.value}
                title={option.description}
                className={cn(
                  "rounded-md px-2 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  length === option.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">{selectedLength?.description}</p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-language`}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <Languages className="h-3.5 w-3.5" />
            Notes language
          </Label>
          <select
            id={`${idPrefix}-language`}
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            disabled={disabled}
            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {NOTES_LANGUAGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Note content is written in this language; section headings stay in English.
          </p>
        </div>
      </div>

      {showFocus && onFocusChange && (
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-focus`}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <Target className="h-3.5 w-3.5" />
            Focus
            <span className="font-normal">(optional)</span>
          </Label>
          <Input
            id={`${idPrefix}-focus`}
            value={focus}
            onChange={(event) => onFocusChange(event.target.value)}
            maxLength={MAX_NOTES_FOCUS_LENGTH}
            disabled={disabled}
            placeholder="e.g. decisions, metrics, and next steps"
          />
        </div>
      )}
    </div>
  );
}
