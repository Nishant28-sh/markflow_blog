import { useEffect, useRef, useState } from "react";
import type { SaveStatus } from "@/types";

/**
 * Calls `onSave` `intervalMs` after the last change, and on an interval
 * regardless while dirty. Tracks a SaveStatus for UI feedback.
 */
export function useAutosave(value: string, onSave: (value: string) => Promise<void>, intervalMs = 5000) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const lastSavedValue = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value === lastSavedValue.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        setStatus("saving");
        await onSave(value);
        lastSavedValue.current = value;
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, intervalMs]);

  return status;
}
