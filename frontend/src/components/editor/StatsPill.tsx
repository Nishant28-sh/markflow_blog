import { Check, Cloud, CloudOff, Loader2 } from "lucide-react";
import type { SaveStatus } from "@/types";
import clsx from "@/utils/clsx";

interface StatsPillProps {
  words: number;
  characters: number;
  readingTime: number;
  saveStatus: SaveStatus;
}

const statusMap: Record<SaveStatus, { icon: typeof Cloud; label: string; color: string }> = {
  idle: { icon: Cloud, label: "All changes saved", color: "text-text-faint" },
  saving: { icon: Loader2, label: "Saving...", color: "text-secondary" },
  saved: { icon: Check, label: "Saved", color: "text-accent" },
  error: { icon: CloudOff, label: "Save failed", color: "text-danger" },
};

export default function StatsPill({ words, characters, readingTime, saveStatus }: StatsPillProps) {
  const { icon: Icon, label, color } = statusMap[saveStatus];

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-20">
      <div
        className={clsx(
          "pointer-events-auto flex items-center gap-4 rounded-2xl border border-border/60 bg-surface/80 backdrop-blur-md px-5 py-3 shadow-soft",
          saveStatus === "idle" && "animate-breathe"
        )}
      >
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <Icon className={clsx("h-3.5 w-3.5", color, saveStatus === "saving" && "animate-spin")} />
          {label}
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="text-xs text-text-muted">
          <strong className="text-text font-semibold">{words}</strong> words
        </span>
        <span className="text-xs text-text-muted">
          <strong className="text-text font-semibold">{characters}</strong> chars
        </span>
        <span className="text-xs text-text-muted">
          <strong className="text-text font-semibold">{readingTime}</strong> min read
        </span>
      </div>
    </div>
  );
}
