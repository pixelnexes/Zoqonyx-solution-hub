"use client";

import * as React from "react";
import {
  Upload,
  FileText,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileArchive,
  Image as ImageIcon,
  HardDrive,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MAX_FILES_LIMIT,
  MAX_COMBINED_SIZE_BYTES,
  validateFileList,
  formatBytes,
  ValidationOptions,
} from "@/lib/file-standards";

export interface StandardFileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxCombinedSizeBytes?: number;
  acceptedTypes?: string[];
  acceptedExtensions?: string[];
  title?: string;
  subtitle?: string;
  helperText?: string;
  disabled?: boolean;
  rejectDuplicates?: boolean;
  className?: string;
}

export function StandardFileUploader({
  files,
  onFilesChange,
  maxFiles = MAX_FILES_LIMIT,
  maxCombinedSizeBytes = MAX_COMBINED_SIZE_BYTES,
  acceptedTypes,
  acceptedExtensions,
  title = "Drop files here or click to browse",
  subtitle,
  helperText,
  disabled = false,
  rejectDuplicates = true,
  className = "",
}: StandardFileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const totalSizeBytes = React.useMemo(() => {
    return files.reduce((acc, f) => acc + f.size, 0);
  }, [files]);

  const capacityPercent = React.useMemo(() => {
    if (maxCombinedSizeBytes <= 0) return 0;
    return Math.min(100, Math.round((totalSizeBytes / maxCombinedSizeBytes) * 100));
  }, [totalSizeBytes, maxCombinedSizeBytes]);

  const remainingSizeBytes = Math.max(0, maxCombinedSizeBytes - totalSizeBytes);
  const remainingFilesCount = Math.max(0, maxFiles - files.length);

  const defaultSubtitle = React.useMemo(() => {
    if (subtitle) return subtitle;
    const formatList = acceptedExtensions?.join(", ") || "Supported formats";
    return `Up to ${maxFiles} files, maximum ${formatBytes(maxCombinedSizeBytes)} combined capacity (${formatList})`;
  }, [subtitle, maxFiles, maxCombinedSizeBytes, acceptedExtensions]);

  const processIncomingFiles = React.useCallback(
    (incomingList: FileList | File[]) => {
      const incomingArray = Array.from(incomingList);
      if (incomingArray.length === 0) return;

      const validationOpts: ValidationOptions = {
        maxFiles,
        maxCombinedSizeBytes,
        acceptedTypes,
        acceptedExtensions,
        rejectDuplicates,
      };

      const result = validateFileList(incomingArray, files, validationOpts);

      if (result.errors.length > 0) {
        setErrors(result.errors);
      } else {
        setErrors([]);
      }

      if (result.warnings.length > 0) {
        setWarnings(result.warnings);
      } else {
        setWarnings([]);
      }

      if (result.validFiles.length > 0) {
        const nextFiles = maxFiles === 1 ? result.validFiles.slice(0, 1) : [...files, ...result.validFiles];
        onFilesChange(nextFiles);
      }

      // Reset input value to allow re-selecting same file if removed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [files, maxFiles, maxCombinedSizeBytes, acceptedTypes, acceptedExtensions, rejectDuplicates, onFilesChange]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer?.files) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processIncomingFiles(e.target.files);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    if (disabled) return;
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    onFilesChange(updated);
    if (errors.length > 0) setErrors([]);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onFilesChange([]);
    setErrors([]);
    setWarnings([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const acceptAttribute = React.useMemo(() => {
    const list: string[] = [];
    if (acceptedTypes) list.push(...acceptedTypes);
    if (acceptedExtensions) list.push(...acceptedExtensions);
    return list.join(",") || undefined;
  }, [acceptedTypes, acceptedExtensions]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            fileInputRef.current?.click();
          }
        }}
        aria-label="File upload dropzone"
        className={`relative flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-200 select-none ${
          disabled
            ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
            : isDragging
            ? "border-teal-500 bg-teal-50/60 ring-4 ring-teal-500/10 scale-[1.005]"
            : "border-slate-200 hover:border-teal-600/70 bg-card/60 hover:bg-slate-50/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptAttribute}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          aria-hidden="true"
        />

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-200 ${
            isDragging ? "bg-teal-600 text-white scale-110" : "bg-teal-50 text-teal-700"
          }`}
        >
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground text-center">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 text-center max-w-md">
          {defaultSubtitle}
        </p>

        {helperText && (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-teal-700 font-medium mt-2.5 bg-teal-50 px-2.5 py-1 rounded-full">
            <Info className="w-3.5 h-3.5" />
            {helperText}
          </span>
        )}
      </div>

      {/* Error & Warning Banners */}
      {errors.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /> Validation Notice
            </span>
            <button
              type="button"
              onClick={() => setErrors([])}
              className="text-rose-500 hover:text-rose-700 p-0.5 rounded"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-0.5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <Info className="w-4 h-4 text-amber-600 shrink-0" /> Notice
          </div>
          <ul className="list-disc pl-5 space-y-0.5">
            {warnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* File Metrics & Capacity Bar */}
      {files.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>
                  {files.length} / {maxFiles} file{maxFiles > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <HardDrive className="w-4 h-4 text-slate-500" />
                <span>
                  {formatBytes(totalSizeBytes)} / {formatBytes(maxCombinedSizeBytes)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">
                {remainingFilesCount} file{remainingFilesCount !== 1 ? "s" : ""}, {formatBytes(remainingSizeBytes)} left
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={disabled}
                className="text-xs h-7 px-2.5 text-slate-600 hover:text-rose-600 border-slate-300"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-colors duration-300 ${
                capacityPercent > 90
                  ? "bg-rose-500"
                  : capacityPercent > 70
                  ? "bg-amber-500"
                  : "bg-teal-600"
              }`}
              style={{ width: `${Math.max(2, capacityPercent)}%` }}
            />
          </div>

          {/* Scrollable File List */}
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
            {files.map((file, idx) => {
              const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
              return (
                <div
                  key={`${file.name}_${file.size}_${idx}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <p className="font-medium text-slate-900 truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-mono">
                          {ext}
                        </span>
                        <span>{formatBytes(file.size)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    disabled={disabled}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                    title={`Remove ${file.name}`}
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
