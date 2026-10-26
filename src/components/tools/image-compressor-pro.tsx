"use client";

import * as React from "react";
import {
  Upload,
  Download,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  Split,
  Eye,
  Layers,
  Archive,
  Trash2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";

interface BatchItem {
  id: string;
  name: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  blob: Blob | null;
  url: string | null;
  savings: number;
  status: "pending" | "processing" | "done" | "error";
}

export function ImageCompressorProTool() {
  const [activeTab, setActiveTab] = React.useState<"single" | "batch">("single");
  
  // Single image mode state
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [originalSize, setOriginalSize] = React.useState<number>(0);
  const [compressedSize, setCompressedSize] = React.useState<number>(0);
  const [quality, setQuality] = React.useState<number>(75);
  const [compressedUrl, setCompressedUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("compressed-image");
  const [format, setFormat] = React.useState<"jpeg" | "webp" | "png">("jpeg");
  
  // Target file size mode
  const [compressionMode, setCompressionMode] = React.useState<"quality" | "targetSize">("quality");
  const [targetKb, setTargetKb] = React.useState<number>(150);
  const [isAutoCompressing, setIsAutoCompressing] = React.useState<boolean>(false);

  // Split Slider
  const [sliderPos, setSliderPos] = React.useState<number>(50);
  const [isSliding, setIsSliding] = React.useState<boolean>(false);
  const sliderContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Batch mode state
  const [batchList, setBatchList] = React.useState<BatchItem[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = React.useState<boolean>(false);
  const [batchProgress, setBatchProgress] = React.useState<number>(0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Compress single image with given quality or target size
  const compressSingle = React.useCallback(async (targetQuality: number) => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const mimeType = format === "png" ? "image/png" : `image/${format}`;

    if (compressionMode === "targetSize" && format !== "png") {
      setIsAutoCompressing(true);
      const targetBytes = targetKb * 1024;
      let minQ = 0.05;
      let maxQ = 0.98;
      let bestBlob: Blob | null = null;

      for (let iteration = 0; iteration < 6; iteration++) {
        const midQ = (minQ + maxQ) / 2;
        const b: Blob | null = await new Promise((res) => canvas.toBlob(res, mimeType, midQ));
        if (!b) break;
        bestBlob = b;
        if (b.size > targetBytes) {
          maxQ = midQ;
        } else {
          minQ = midQ;
        }
      }

      setIsAutoCompressing(false);
      if (bestBlob) {
        setCompressedSize(bestBlob.size);
        setCompressedUrl(URL.createObjectURL(bestBlob));
        setQuality(Math.round(((minQ + maxQ) / 2) * 100));
      }
    } else {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setCompressedSize(blob.size);
          setCompressedUrl(URL.createObjectURL(blob));
        },
        mimeType,
        targetQuality / 100
      );
    }
  }, [imageSrc, quality, format, compressionMode, targetKb]);

  React.useEffect(() => {
    if (imageSrc) {
      compressSingle(quality);
    }
  }, [imageSrc, quality, format, compressionMode, targetKb, compressSingle]);

  // Handle Split Slider Drag
  const handleSplitMove = (clientX: number) => {
    const container = sliderContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isSliding) handleSplitMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isSliding && e.touches[0]) handleSplitMove(e.touches[0].clientX);
    };
    const onStop = () => setIsSliding(false);

    if (isSliding) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("mouseup", onStop);
      window.addEventListener("touchend", onStop);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onStop);
      window.removeEventListener("touchend", onStop);
    };
  }, [isSliding]);

  // Batch file upload
  const handleBatchFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: BatchItem[] = files.slice(0, 20).map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      file,
      originalSize: file.size,
      compressedSize: 0,
      blob: null,
      url: null,
      savings: 0,
      status: "pending",
    }));

    setBatchList(newItems);
    runBatchCompression(newItems);
  };

  const runBatchCompression = async (items: BatchItem[]) => {
    setIsBatchProcessing(true);
    setBatchProgress(0);

    const updatedList = [...items];

    for (let i = 0; i < updatedList.length; i++) {
      const item = updatedList[i];
      item.status = "processing";
      setBatchList([...updatedList]);

      try {
        const dataUrl: string = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = (e) => resolve(e.target?.result as string);
          r.readAsDataURL(item.file);
        });

        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const mimeType = format === "png" ? "image/png" : `image/${format}`;
          const blob: Blob | null = await new Promise((res) =>
            canvas.toBlob(res, mimeType, quality / 100)
          );

          if (blob) {
            item.blob = blob;
            item.compressedSize = blob.size;
            item.url = URL.createObjectURL(blob);
            item.savings = Math.max(
              0,
              Math.round(((item.originalSize - blob.size) / item.originalSize) * 100)
            );
            item.status = "done";
          } else {
            item.status = "error";
          }
        }
      } catch {
        item.status = "error";
      }

      setBatchProgress(Math.round(((i + 1) / updatedList.length) * 100));
      setBatchList([...updatedList]);
    }

    setIsBatchProcessing(false);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    batchList.forEach((item) => {
      if (item.blob) {
        const ext = format === "webp" ? "webp" : format === "png" ? "png" : "jpg";
        const base = item.name.replace(/\.[^/.]+$/, "");
        zip.file(`${base}-min.${ext}`, item.blob);
      }
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zoqonyx-compressed-images-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const singleSavings =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between p-1.5 rounded-xl bg-card border border-border shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "single"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Visual Comparison Mode
          </button>
          <button
            onClick={() => setActiveTab("batch")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "batch"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bulk Batch Compressor (Up to 20 files)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground pr-2">
          <Zap className="w-3.5 h-3.5 text-teal-400" />
          <span>100% Client-Side WebGL</span>
        </div>
      </div>

      {activeTab === "single" ? (
        !imageSrc ? (
          <label className="flex flex-col items-center justify-center p-12 sm:p-16 border-2 border-dashed border-border/80 hover:border-teal-500/70 rounded-2xl cursor-pointer bg-card/60 hover:bg-card transition-all group shadow-xs">
            <div className="p-4 rounded-xl bg-teal-500/10 text-teal-400 mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg text-foreground">
              Upload Image to Compress
            </span>
            <span className="text-xs text-muted-foreground mt-1 text-center max-w-sm">
              Select JPG, PNG, or WebP. Fine-tune with Before/After visual comparison or target exact file size.
            </span>
            <input type="file" accept="image/*" onChange={handleSingleFileChange} className="hidden" />
          </label>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Controls Column */}
            <div className="lg:col-span-5 space-y-4">
              {/* Savings Metrics */}
              <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground font-mono uppercase tracking-wider text-[11px]">
                    Compression Metrics
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                    {singleSavings}% Saved
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Original</p>
                    <p className="font-mono text-sm font-bold text-foreground mt-0.5">{formatBytes(originalSize)}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <p className="text-[10px] font-mono text-teal-400 uppercase">Compressed</p>
                    <p className="font-mono text-sm font-bold text-teal-400 mt-0.5">{formatBytes(compressedSize)}</p>
                  </div>
                </div>
              </div>

              {/* Compression Mode Selector */}
              <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-teal-400" />
                    <span>Compression Mode</span>
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <button
                      onClick={() => setCompressionMode("quality")}
                      className={`px-2 py-0.5 rounded ${
                        compressionMode === "quality"
                          ? "bg-teal-600 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Quality Slider
                    </button>
                    <button
                      onClick={() => setCompressionMode("targetSize")}
                      className={`px-2 py-0.5 rounded ${
                        compressionMode === "targetSize"
                          ? "bg-teal-600 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Target KB
                    </button>
                  </div>
                </div>

                {compressionMode === "quality" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Quality Level</span>
                      <span className="font-mono text-teal-400 font-bold">{quality}%</span>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />

                    {/* Presets */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[
                        { label: "Light", q: 85 },
                        { label: "Balanced", q: 75 },
                        { label: "High", q: 55 },
                        { label: "Max", q: 35 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setQuality(preset.q)}
                          className={`py-1 rounded border text-[11px] font-mono transition-all ${
                            quality === preset.q
                              ? "border-teal-500 bg-teal-500/10 text-teal-400 font-bold"
                              : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Target File Size</span>
                      <span className="font-mono text-teal-400 font-bold">{targetKb} KB</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[50, 100, 200, 500].map((kb) => (
                        <button
                          key={kb}
                          onClick={() => setTargetKb(kb)}
                          className={`py-1 rounded border text-[11px] font-mono transition-all ${
                            targetKb === kb
                              ? "border-teal-500 bg-teal-500/10 text-teal-400 font-bold"
                              : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {kb} KB
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min="20"
                      max="1000"
                      step="10"
                      value={targetKb}
                      onChange={(e) => setTargetKb(Number(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                    {isAutoCompressing && (
                      <p className="text-[11px] font-mono text-teal-400 animate-pulse">
                        Calculating optimal compression ratio...
                      </p>
                    )}
                  </div>
                )}

                {/* Output Format */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Format:</span>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    {(['jpeg', 'webp', 'png'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`px-2 py-0.5 rounded uppercase ${
                          format === fmt
                            ? "bg-teal-600 text-white font-bold"
                            : "bg-muted/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {compressedUrl && (
                  <a
                    href={compressedUrl}
                    download={`${fileName}-min.${format === "webp" ? "webp" : format === "png" ? "png" : "jpg"}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ({formatBytes(compressedSize)})</span>
                  </a>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImageSrc(null);
                    setCompressedUrl(null);
                  }}
                  className="text-xs"
                >
                  New Image
                </Button>
              </div>
            </div>

            {/* Split Preview Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Split className="w-3.5 h-3.5 text-teal-400" />
                  <span>Drag Slider: Left = Original • Right = Compressed</span>
                </span>
                <span>{sliderPos}% Split</span>
              </div>

              <div
                ref={sliderContainerRef}
                onMouseDown={() => setIsSliding(true)}
                onTouchStart={() => setIsSliding(true)}
                className="relative w-full aspect-video rounded-xl overflow-hidden border border-border select-none cursor-ew-resize bg-black/40 shadow-inner"
              >
                {/* Original (Underneath) */}
                <img
                  src={imageSrc}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Compressed (Clipped Layer) */}
                {compressedUrl && (
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                  >
                    <img
                      src={compressedUrl}
                      alt="Compressed"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                )}

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-teal-400 shadow-md pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-teal-500 text-black flex items-center justify-center shadow-lg">
                    <Split className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* Batch Processing Mode */
        <div className="space-y-4">
          {batchList.length === 0 ? (
            <label className="flex flex-col items-center justify-center p-12 sm:p-16 border-2 border-dashed border-border/80 hover:border-teal-500/70 rounded-2xl cursor-pointer bg-card/60 hover:bg-card transition-all group shadow-xs">
              <div className="p-4 rounded-xl bg-teal-500/10 text-teal-400 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <span className="font-heading font-bold text-base sm:text-lg text-foreground">
                Upload Multiple Images to Bulk Compress
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center max-w-sm">
                Select up to 20 images at once. Background multi-threaded processing with ZIP bundle export.
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchFiles}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              {/* Progress & Batch Header */}
              <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-foreground">
                    <span>Batch Queue: {batchList.length} files</span>
                    {isBatchProcessing && (
                      <span className="text-teal-400 animate-pulse">(Processing {batchProgress}%)</span>
                    )}
                  </div>
                  <div className="w-48 sm:w-64 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-300"
                      style={{ width: `${batchProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={downloadAllAsZip}
                    disabled={isBatchProcessing || batchList.every((b) => !b.blob)}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Download All (ZIP)</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBatchList([])}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                <div className="max-h-96 overflow-y-auto divide-y divide-border/60 text-xs font-mono">
                  {batchList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                        <span className="truncate font-medium text-foreground">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-muted-foreground">
                        <span>{formatBytes(item.originalSize)}</span>
                        <span>→</span>
                        {item.compressedSize > 0 ? (
                          <span className="text-teal-400 font-bold">
                            {formatBytes(item.compressedSize)} (-{item.savings}%)
                          </span>
                        ) : (
                          <span>...</span>
                        )}

                        {item.url && (
                          <a
                            href={item.url}
                            download={`min-${item.name}`}
                            className="p-1 text-teal-400 hover:text-white transition-colors"
                            title="Download single"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}