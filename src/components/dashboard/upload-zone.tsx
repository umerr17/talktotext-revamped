import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UploadCloud, FileAudio, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOngoingTasks, deleteTask } from "@/lib/api";

interface UploadFile {
  id: string;
  file: File | { name: string; size: number };
  status: "uploading" | "processing" | "completed" | "error" | "pending";
  progress: number; // This will be the target progress from the backend
  details: string;
}

// --- NEW: SmoothedProgress Component ---
// This component manages the smooth animation from a start to an end value.
const SmoothedProgress = ({ targetProgress }: { targetProgress: number }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // When the targetProgress from the backend updates, we start an interval.
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev < targetProgress) {
          // Increment the display value until it reaches the target
          return prev + 1;
        }
        // Once reached, clear the interval.
        clearInterval(interval);
        return targetProgress;
      });
    }, 20); // The interval duration controls the speed of the animation.

    return () => clearInterval(interval); // Cleanup on component unmount or re-render
  }, [targetProgress]);

  return <Progress value={displayProgress} className="h-1.5" />;
};


export function UploadZone() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndPollOngoingTasks = async () => {
      try {
        const ongoingTasks = await getOngoingTasks();
        const tasksToDisplay: UploadFile[] = ongoingTasks.map(task => {
          pollProgress(task.id);
          return {
            id: task.id,
            file: { name: task.original_filename, size: 0 },
            status: task.status.toLowerCase() as "processing" | "pending",
            progress: task.progress_percent,
            details: task.details,
          };
        });

        setFiles(prev => {
          const existingIds = new Set(prev.map(f => f.id));
          const newTasks = tasksToDisplay.filter(t => !existingIds.has(t.id));
          return [...newTasks, ...prev];
        });
      } catch (error) {
        console.error("Failed to fetch ongoing tasks", error);
      }
    };
    fetchAndPollOngoingTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pollProgress = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/progress/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          clearInterval(interval);
          setFiles((prev) => prev.filter((f) => f.id !== taskId));
          return;
        }
        if (!res.ok) throw new Error("Progress fetch failed");

        const data = await res.json();

        setFiles((prev) =>
          prev.map((f) =>
            f.id === taskId
              ? {
                ...f,
                status: data.status.toLowerCase(),
                progress: data.progress_percent,
                details: data.details,
              }
              : f
          )
        );

        if (data.status === "Completed") {
          clearInterval(interval);
          setTimeout(() => navigate(`/meeting/${data.meeting_id}`), 1500);
        }

        if (data.status === "Error") {
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === taskId ? { ...f, status: "error", details: "Could not retrieve processing status." } : f))
        );
      }
    }, 2500);
  };

  const handleUpload = async (file: File) => {
    const tempId = Math.random().toString(36).substring(2, 9);
    const uploadFile: UploadFile = {
      id: tempId,
      file,
      status: "uploading",
      progress: 0,
      details: "Preparing upload...",
    };
    setFiles((prev) => [uploadFile, ...prev]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload-audio`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 1;
          const progress = Math.round((progressEvent.loaded / total) * 100);
          setFiles((prev) =>
            prev.map((f) => (f.id === tempId ? { ...f, progress, details: "Uploading file..." } : f))
          );
        },
      });

      const { task_id } = res.data;

      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, id: task_id, status: "pending", progress: 100, details: "Upload complete, queueing task..." } : f))
      );

      // Brief delay to show upload completion before polling starts
      setTimeout(() => {
        pollProgress(task_id);
      }, 1000);

    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || "Upload failed.";
      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, status: "error", details: errorDetail, progress: 0 } : f))
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    acceptedFiles.forEach(handleUpload);
    fileRejections.forEach((rejection) => {
      const { file, errors } = rejection;
      const errorDetail = errors[0].code === 'file-too-large'
        ? `File is too large. Max size is 1GB.`
        : errors[0].message;

      const errorFile: UploadFile = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        status: "error",
        progress: 0,
        details: errorDetail
      };
      setFiles(prev => [errorFile, ...prev]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFile = async (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (!fileToRemove) return;

    setFiles((prev) => prev.filter((f) => f.id !== fileId));

    if (fileToRemove.status !== 'completed' && fileToRemove.status !== 'uploading' && fileToRemove.status !== "error") {
      try {
        await deleteTask(fileId);
      } catch (error) {
        console.error("Failed to delete task from backend:", error);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
      "video/*": [".mp4", ".mov", ".webm"],
    },
    maxSize: 1024 * 1024 * 1024, // 1GB
  });

  return (
    <div className="space-y-5">
      <div
        {...getRootProps()}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed bg-card px-6 py-12 text-center transition-all duration-200 sm:py-14",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
          isDragActive
            ? "border-primary bg-accent/60 shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_12%,transparent)]"
            : "border-input hover:border-primary/50 hover:bg-accent/30",
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary ring-1 ring-primary/10 transition-transform duration-200",
            isDragActive ? "scale-110" : "group-hover:-translate-y-0.5",
          )}
        >
          <UploadCloud className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">
          {isDragActive ? "Drop files to upload" : "Upload meeting recordings"}
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          Drag and drop audio or video here, or click to browse your files.
        </p>
        <Button variant="outline" className="mt-5" type="button">
          Choose files
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">MP3, WAV, M4A, MP4, MOV, WEBM · up to 1GB</p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-muted-foreground">Processing files</h3>
            {files.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="rounded-xl border bg-card p-4 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <FileAudio className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{uploadFile.file.name}</p>
                      {uploadFile.file.size > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {uploadFile.status === "completed" ? (
                      <Badge className="border-transparent bg-success/10 text-success">
                        <CheckCircle2 />
                        Complete
                      </Badge>
                    ) : uploadFile.status === "error" ? (
                      <Badge className="border-transparent bg-destructive/10 text-destructive">
                        <AlertCircle />
                        Error
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="capitalize">
                        <Loader2 className="animate-spin" />
                        {uploadFile.status}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      onClick={() => removeFile(uploadFile.id)}
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className={cn(uploadFile.status === "error" && "text-destructive")}>{uploadFile.details}</span>
                    <span className="font-medium tabular-nums">{Math.round(uploadFile.progress)}%</span>
                  </div>
                  <SmoothedProgress targetProgress={uploadFile.progress} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
