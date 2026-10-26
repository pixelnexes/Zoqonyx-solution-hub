import JSZip from "jszip";

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

export async function processBatch<T, R>(
  items: T[],
  processItem: (item: T, index: number, signal?: AbortSignal) => Promise<R>,
  options: BatchOptions<T> = {}
): Promise<{ results: R[]; errors: { index: number; error: Error }[] }> {
  const {
    concurrency = 2,
    maxItems = 50,
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

      // Yield to UI thread
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

export async function createZipDownload(
  files: { name: string; blob: Blob }[],
  zipFilename: string = "zoqonyx_batch.zip"
): Promise<void> {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
