import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Square, Sparkles, Clock, Bot, User, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface MeetingChatProps {
  meetingId: string | number;
  apiBaseUrl: string;
  getAuthToken?: () => string | null;
  initialMessages?: ChatMessage[];
  onTimestampClick?: (seconds: number, rawTimestamp: string) => void;
  onClearHistory?: () => Promise<void> | void;
  suggestedPrompts?: string[];
  hasTimestamps?: boolean;
}

const STARTER_PROMPTS = [
  "Summarize the key decisions made",
  "Extract all action items with owners",
  "What questions or blockers were raised?",
  "Draft a concise follow-up email",
];

function parseTimestampToSeconds(raw: string): number {
  const clean = raw.replace(/[\[\]]/g, "");
  const parts = clean.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

/**
 * The API returns plain text answers with citations like [12:34].
 * Turn those into markdown links (#t=seconds) so ReactMarkdown can render
 * clickable timestamp badges with our custom <a> component.
 */
function linkifyTimestamps(content: string): string {
  return content.replace(/\[((?:\d{1,2}:)?\d{1,2}:\d{2})\]/g, (_match, timestamp: string) => {
    const seconds = parseTimestampToSeconds(timestamp);
    return `[${timestamp}](#t=${seconds})`;
  });
}

export function MeetingChat({
  meetingId,
  apiBaseUrl,
  getAuthToken,
  initialMessages = [],
  onTimestampClick,
  onClearHistory,
  suggestedPrompts,
  hasTimestamps = false,
}: MeetingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  };

  const sendMessage = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const assistantMsgId = `assistant-${Date.now() + 1}`;
    const placeholderAssistant: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, placeholderAssistant]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const token = getAuthToken?.();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiBaseUrl}/meetings/${meetingId}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        let detail = `Chat request failed (${response.status})`;
        try {
          const data = await response.json();
          if (data?.detail) detail = data.detail;
        } catch {
          // Keep the status-based message.
        }
        throw new Error(detail);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const line = event
            .split("\n")
            .find((l) => l.startsWith("data: "));
          if (!line) continue;

          const rawData = line.slice(6).trim();
          if (rawData === "[DONE]") continue;

          try {
            const parsed = JSON.parse(rawData);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.token) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + parsed.token }
                    : m
                )
              );
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== "Unexpected end of JSON input") {
              throw parseErr;
            }
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantMsgId && m.content === ""))
        );
        return;
      }
      const errMsg = err instanceof Error ? err.message : "Failed to get response.";
      setError(errMsg);
      setMessages((prev) =>
        prev.filter((m) => !(m.id === assistantMsgId && m.content === ""))
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const copyMessage = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  const handleClear = async () => {
    if (!onClearHistory || isStreaming) return;
    const confirmed = window.confirm("Clear this conversation? This cannot be undone.");
    if (!confirmed) return;
    try {
      await onClearHistory();
      setMessages([]);
      setError(null);
    } catch {
      setError("Could not clear the conversation. Please try again.");
    }
  };

  const prompts = suggestedPrompts?.length ? suggestedPrompts : STARTER_PROMPTS;

  return (
    <div className="flex h-[min(72vh,640px)] min-h-[440px] flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Ask this recording</h3>
          <Badge variant="secondary" className="hidden text-[10px] font-medium sm:inline-flex">
            AI
          </Badge>
        </div>
        {messages.length > 0 && onClearHistory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isStreaming}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Bot className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Chat with this recording</p>
            <p className="mb-4 max-w-xs text-xs text-muted-foreground">
              Ask about decisions, speaker quotes, action items, or any detail in the transcript.
              {hasTimestamps && " Answers can cite exact moments."}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-2.5",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0 max-w-[82%]">
                <div
                  className={cn(
                    "rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "whitespace-pre-wrap bg-primary text-primary-foreground"
                      : "bg-muted/70 text-foreground"
                  )}
                >
                  {msg.role === "assistant" ? (
                    msg.content ? (
                      <div className="chat-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ href, children }) => {
                              if (href?.startsWith("#t=")) {
                                const seconds = Number(href.slice(3));
                                const label = String(children);
                                return (
                                  <Badge
                                    variant="secondary"
                                    onClick={() => onTimestampClick?.(seconds, label)}
                                    className="mx-0.5 inline-flex cursor-pointer items-center gap-1 px-1.5 py-0 text-xs font-mono transition-colors hover:bg-primary hover:text-primary-foreground"
                                    title={`Jump to ${label}`}
                                  >
                                    <Clock className="h-3 w-3" />
                                    {label}
                                  </Badge>
                                );
                              }
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline underline-offset-2"
                                >
                                  {children}
                                </a>
                              );
                            },
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
                            ),
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            h1: ({ children }) => (
                              <h1 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mb-2 mt-3 text-sm font-semibold first:mt-0">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-1.5 mt-3 text-sm font-semibold first:mt-0">{children}</h3>
                            ),
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            blockquote: ({ children }) => (
                              <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground">
                                {children}
                              </blockquote>
                            ),
                            code: ({ children, className }) => (
                              <code
                                className={cn(
                                  "rounded bg-background/70 px-1 py-0.5 font-mono text-[0.85em]",
                                  className
                                )}
                              >
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="my-2 overflow-x-auto rounded-md bg-background/70 p-2 text-xs">
                                {children}
                              </pre>
                            ),
                            table: ({ children }) => (
                              <div className="my-2 overflow-x-auto">
                                <table className="w-full border-collapse text-xs">{children}</table>
                              </div>
                            ),
                            th: ({ children }) => (
                              <th className="border-b px-2 py-1 text-left font-semibold">{children}</th>
                            ),
                            td: ({ children }) => <td className="border-b px-2 py-1">{children}</td>,
                            hr: () => <hr className="my-3 border-border" />,
                          }}
                        >
                          {linkifyTimestamps(msg.content)}
                        </ReactMarkdown>
                        {isStreaming && msg.content && (
                          <span className="ml-0.5 inline-block h-3.5 w-1 animate-pulse bg-current align-middle" />
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                        <span className="ml-1 text-xs">Reading the recording...</span>
                      </span>
                    )
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "assistant" && msg.content && !isStreaming && (
                  <div className="mt-1 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(msg)}
                      className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === msg.id ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <Copy className="mr-1 h-3 w-3" />
                      )}
                      {copiedId === msg.id ? "Copied" : "Copy"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-end gap-2 border-t p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="Ask anything about this recording..."
          disabled={isStreaming}
          rows={1}
          className="max-h-32 min-h-10 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isStreaming ? (
          <Button type="button" variant="destructive" size="icon" onClick={stopGeneration}>
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
