import JSZip from "jszip";
import { MAX_FILES_LIMIT } from "./file-standards";

export interface BatchProgress {
  current: number;
  total: number;
  percent: number;
  currentName?: string;
  isProcessing: boolean;
  isCancelled: boolean;
  errors: string[];
}

export interface BatchOptions<T> {
  concurrency?: number;
  maxItems?: number;
  onProgress?: (progress: BatchProgress) => void;
  signal?: AbortSignal;
}

/**
 * Executes a batch of items with controlled concurrency (default 2),
 * preventing browser memory exhaustion and main thread lockups on up to 100 files / 1 GB.
 */
export async function processBatch<T, R>(
  items: T[],
  processItem: (item: T, index: number, signal?: AbortSignal) => Promise<R>,
  options: BatchOptions<T> = {}
): Promise<{ results: R[]; errors: { index: number; error: Error }[] }> {
  const {
    concurrency = 2,
    maxItems = MAX_FILES_LIMIT,
    onProgress,
    signal,
  } = options;

  const boundedItems = items.slice(0, maxItems);
  const total = boundedItems.length;
  let completed = 0;
  const results: R[] = new Array(total);
  const errors: { index: number; error: Error }[] = [];
  const errorMessages: string[] = [];

  let nextIndex = 0;

  const updateProgress = (name?: string) => {
    if (onProgress) {
      onProgress({
        current: completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        currentName: name,
        isProcessing: completed < total && !signal?.aborted,
        isCancelled: !!signal?.aborted,
        errors: [...errorMessages],
      });
    }
  };

  updateProgress();

  async function worker() {
    while (nextIndex < total) {
      if (signal?.aborted) {
        break;
      }
      const index = nextIndex++;
      const item = boundedItems[index];

      // Yield execution to the browser event loop to preserve responsive rendering and GC
      await new Promise((resolve) => setTimeout(resolve, 16));

      try {
        const result = await processItem(item, index, signal);
        results[index] = result;
      } catch (err: any) {
        errors.push({ index, error: err });
        errorMessages.push(`Item ${index + 1}: ${err?.message || "Failed"}`);
      } finally {
        completed++;
        updateProgress();
      }
    }
  }

  const workerCount = Math.min(concurrency, total);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  return { results: results.filter(Boolean), errors };
}

/**
 * Creates and triggers download of a ZIP archive containing multiple processed files.
 * Uses JSZip with streaming chunks and revokes the generated Object URL to avoid leaks.
 */
export async function createZipDownload(
  files: { name: string; blob: Blob }[],
  zipFilename: string = "zoqonyx_batch.zip"
): Promise<void> {
  if (!files || files.length === 0) return;

  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });

  const content = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    },
    // Optional internal progress handler
    () => {}
  );

  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke object URL after short delay to free memory
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
