/**
 * Standard File Processing Specifications for Zoqonyx Solution Hub
 * Global limits: 100 files max, 1 GB (1024 MB) combined upload limit.
 */

export const MAX_FILES_LIMIT = 100;
export const MAX_COMBINED_SIZE_BYTES = 1024 * 1024 * 1024; // 1,073,741,824 bytes (1 GB / 1024 MB)
export const MAX_SINGLE_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1 GB

export interface FileValidationResult {
  validFiles: File[];
  rejectedFiles: { file: File; reason: string }[];
  totalSizeBytes: number;
  totalSizeFormatted: string;
  isCountExceeded: boolean;
  isSizeExceeded: boolean;
  duplicateCount: number;
  errors: string[];
  warnings: string[];
}

export interface ValidationOptions {
  maxFiles?: number;
  maxCombinedSizeBytes?: number;
  maxSingleFileSizeBytes?: number;
  acceptedTypes?: string[]; // e.g. ['image/png', 'image/jpeg', 'application/pdf']
  acceptedExtensions?: string[]; // e.g. ['.png', '.jpg', '.jpeg', '.webp', '.pdf']
  rejectDuplicates?: boolean;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Checks if a file matches accepted MIME types or extensions.
 */
export function isFileTypeAccepted(
  file: File,
  acceptedTypes?: string[],
  acceptedExtensions?: string[]
): boolean {
  if (!acceptedTypes?.length && !acceptedExtensions?.length) {
    return true;
  }

  const fileType = (file.type || "").toLowerCase();
  const fileName = (file.name || "").toLowerCase();

  if (acceptedTypes && acceptedTypes.length > 0) {
    for (const pattern of acceptedTypes) {
      const lowerPattern = pattern.toLowerCase();
      if (lowerPattern.endsWith("/*")) {
        const prefix = lowerPattern.slice(0, -2);
        if (fileType.startsWith(prefix)) return true;
      } else if (fileType === lowerPattern) {
        return true;
      }
    }
  }

  if (acceptedExtensions && acceptedExtensions.length > 0) {
    for (const ext of acceptedExtensions) {
      const lowerExt = ext.toLowerCase().startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
      if (fileName.endsWith(lowerExt)) return true;
    }
  }

  return false;
}

/**
 * Validates an incoming list of files against standardized limits:
 * - Max files: up to 100
 * - Combined capacity: up to 1 GB
 * - Duplicate handling
 * - Accepted formats
 */
export function validateFileList(
  incomingFiles: File[],
  existingFiles: File[] = [],
  options: ValidationOptions = {}
): FileValidationResult {
  const maxFiles = options.maxFiles ?? MAX_FILES_LIMIT;
  const maxCombinedSize = options.maxCombinedSizeBytes ?? MAX_COMBINED_SIZE_BYTES;
  const maxSingleSize = options.maxSingleFileSizeBytes ?? MAX_SINGLE_FILE_SIZE_BYTES;

  const validFiles: File[] = [];
  const rejectedFiles: { file: File; reason: string }[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Track existing signatures for duplicate detection
  const seenSignatures = new Set<string>();
  existingFiles.forEach((f) => {
    seenSignatures.add(`${f.name}_${f.size}_${f.lastModified}`);
  });

  let duplicateCount = 0;
  let runningCombinedSize = existingFiles.reduce((acc, f) => acc + f.size, 0);

  // Check if adding all incoming files would immediately exceed total count
  const projectedTotalCount = existingFiles.length + incomingFiles.length;
  let isCountExceeded = false;
  if (projectedTotalCount > maxFiles) {
    isCountExceeded = true;
    errors.push(
      `File limit exceeded: Maximum allowed is ${maxFiles} files per operation. Attempted to upload ${projectedTotalCount} files.`
    );
  }

  for (const file of incomingFiles) {
    // 1. Check if single file exceeds single max size
    if (file.size > maxSingleSize) {
      rejectedFiles.push({
        file,
        reason: `File size (${formatBytes(file.size)}) exceeds maximum single file limit of ${formatBytes(maxSingleSize)}.`,
      });
      continue;
    }

    // 2. Check type/extension
    if (!isFileTypeAccepted(file, options.acceptedTypes, options.acceptedExtensions)) {
      const allowedDesc = options.acceptedExtensions?.join(", ") || options.acceptedTypes?.join(", ") || "supported types";
      rejectedFiles.push({
        file,
        reason: `Unsupported format (${file.type || "unknown"}). Allowed formats: ${allowedDesc}.`,
      });
      continue;
    }

    // 3. Duplicate check
    const signature = `${file.name}_${file.size}_${file.lastModified}`;
    if (seenSignatures.has(signature)) {
      duplicateCount++;
      if (options.rejectDuplicates) {
        rejectedFiles.push({
          file,
          reason: `Duplicate file "${file.name}" detected and skipped.`,
        });
        continue;
      }
    }
    seenSignatures.add(signature);

    // 4. Combined count limit
    if (existingFiles.length + validFiles.length >= maxFiles) {
      rejectedFiles.push({
        file,
        reason: `Maximum batch limit of ${maxFiles} files reached.`,
      });
      continue;
    }

    // 5. Combined size limit
    if (runningCombinedSize + file.size > maxCombinedSize) {
      rejectedFiles.push({
        file,
        reason: `Upload exceeds combined capacity limit of ${formatBytes(maxCombinedSize)}. Current batch: ${formatBytes(runningCombinedSize)}.`,
      });
      continue;
    }

    // File passed all checks
    runningCombinedSize += file.size;
    validFiles.push(file);
  }

  const isSizeExceeded = runningCombinedSize > maxCombinedSize;
  if (isSizeExceeded) {
    errors.push(`Combined upload size exceeds the maximum limit of ${formatBytes(maxCombinedSize)}.`);
  }

  if (duplicateCount > 0 && !options.rejectDuplicates) {
    warnings.push(`${duplicateCount} duplicate file(s) detected in the batch.`);
  }

  if (rejectedFiles.length > 0) {
    rejectedFiles.forEach((r) => {
      if (!errors.includes(r.reason)) {
        errors.push(r.reason);
      }
    });
  }

  return {
    validFiles,
    rejectedFiles,
    totalSizeBytes: runningCombinedSize,
    totalSizeFormatted: formatBytes(runningCombinedSize),
    isCountExceeded,
    isSizeExceeded,
    duplicateCount,
    errors,
    warnings,
  };
}
