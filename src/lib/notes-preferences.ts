export type NotesLength = "short" | "medium" | "long";

export const NOTES_LENGTH_OPTIONS: Array<{
  value: NotesLength;
  label: string;
  description: string;
}> = [
  {
    value: "short",
    label: "Short",
    description: "Quick scan · about 150–250 words",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced · about 350–600 words",
  },
  {
    value: "long",
    label: "Long",
    description: "Detailed · about 800–1200 words",
  },
];

export const NOTES_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Dutch",
  "Polish",
  "Turkish",
  "Russian",
  "Ukrainian",
  "Arabic",
  "Hindi",
  "Japanese",
  "Korean",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Indonesian",
  "Vietnamese",
  "Thai",
] as const;

export const DEFAULT_NOTES_LENGTH: NotesLength = "medium";
export const DEFAULT_NOTES_LANGUAGE = "English";
export const MAX_NOTES_FOCUS_LENGTH = 300;
