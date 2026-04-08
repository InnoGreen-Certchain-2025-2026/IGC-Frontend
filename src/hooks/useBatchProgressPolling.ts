import { useEffect, useMemo, useState } from "react";
import { templateApi } from "@/services/templateApi";
import type { BatchProgressResponse } from "@/types/template";

const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "SUCCESS",
  "DONE",
  "FAILED",
  "CANCELLED",
]);

function isTerminalProgress(progress: BatchProgressResponse) {
  if (progress.finishedAt) {
    return true;
  }

  return TERMINAL_STATUSES.has(progress.status.toUpperCase());
}

export function useBatchProgressPolling(
  batchId?: string | null,
  delayMs = 1500,
) {
  const [progress, setProgress] = useState<BatchProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) {
      setProgress(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const response = await templateApi.getBatchProgress(batchId);
        if (cancelled) return;

        setProgress(response.data);
        setError(null);

        if (!isTerminalProgress(response.data)) {
          timer = window.setTimeout(fetchProgress, delayMs);
        }
      } catch (fetchError) {
        if (cancelled) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Không thể tải tiến độ batch",
        );
        timer = window.setTimeout(fetchProgress, delayMs);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProgress();

    return () => {
      cancelled = true;
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [batchId, delayMs]);

  return useMemo(
    () => ({ progress, isLoading, error }),
    [progress, isLoading, error],
  );
}
