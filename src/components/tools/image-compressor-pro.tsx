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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageCompressorProTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [originalSize, setOriginalSize] = React.useState<number>(0);
  const [compressedSize, setCompressedSize] = React.useState<number>(0);
  const [quality, setQuality] = React.useState<number>(75);
  const [compressedUrl, setCompressedUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("compressed-image");
  const [format, setFormat] = React.useState<"jpeg" | "webp">("jpeg");
  
  // Interactive Split Slider (0 to 100 percent)
  const [sliderPos, setSliderPos] = React.useState<number>(50);
  const [isSliding, setIsSliding] = React.useState<boolean>(false);
  const sliderContainerRef = React.useRef<HTMLDivElement | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const compressImage = React.useCallback(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${format}`;
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setCompressedSize(blob.size);
          const url = URL.createObjectURL(blob);
          setCompressedUrl(url);
        },
        mimeType,
        quality / 100
      );
    };
  }, [imageSrc, quality, format]);

  React.useEffect(() => {
    if (imageSrc) {
      compressImage();
    }
  }, [imageSrc, quality, format, compressImage]);

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

  const savings =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="space-y-8">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-14 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-3xl cursor-pointer bg-card/60 hover:bg-card transition-all group shadow-sm">
          <div className="p-4 rounded-2xl bg-brand-cyan/10 text-brand-cyan mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">Upload Image to Compress</span>
          <span className="text-xs text-muted-foreground mt-1 text-center max-w-sm">
            Drag &amp; drop or click to upload. Compare visual quality in real-time with our Before/After split slider.
          </span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Compression Metrics Card */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center justify-between">
                <span>Compression Savings</span>
                <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {savings}% Saved
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Original</p>
                  <p className="font-mono text-base font-bold text-foreground mt-0.5">{formatBytes(originalSize)}</p>
                </div>
                <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30">
                  <p className="text-[11px] font-semibold text-brand-cyan uppercase tracking-wider">Compressed</p>
                  <p className="font-mono text-base font-bold text-brand-cyan mt-0.5">{formatBytes(compressedSize)}</p>
                </div>
              </div>
            </div>

            {/* Quality Controls */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-cyan" />
                  <span>Quality Level</span>
                </span>
                <span className="font-mono text-brand-cyan font-bold text-sm">{quality}%</span>
              </div>

              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />

              {/* Compression Preset Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { label: "Light", q: 85 },
                  { label: "Balanced", q: 75 },
                  { label: "High", q: 55 },
                  { label: "Maximum", q: 35 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setQuality(preset.q)}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
                      quality === preset.q
                        ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                        : "border-border/80 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format & Download */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <h3 className="font-heading font-bold text-sm text-foreground">Output Format</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormat("jpeg")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    format === "jpeg"
                      ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                      : "border-border/80 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  JPEG (Broadest Compatibility)
                </button>
                <button
                  onClick={() => setFormat("webp")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    format === "webp"
                      ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                      : "border-border/80 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  WebP (Up to 40% Smaller)
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs px-3.5 py-2.5 rounded-xl border border-border/80 hover:bg-muted cursor-pointer font-semibold transition-colors shrink-0">
                  <span>Upload Different</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {compressedUrl && (
                  <a
                    href={compressedUrl}
                    download={`${fileName}-zoqonyx.${format === "webp" ? "webp" : "jpg"}`}
                    className="w-full"
                  >
                    <Button variant="gradient" className="gap-2 w-full font-bold shadow-md shadow-brand-cyan/20">
                      <Download className="w-4 h-4" />
                      <span>Download ({formatBytes(compressedSize)})</span>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Draggable Before/After Split Comparison Slider */}
          <div className="lg:col-span-7 sticky top-24 space-y-4">
            <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <span className="text-foreground flex items-center gap-1.5">
                  <Split className="w-4 h-4 text-brand-cyan" />
                  <span>Interactive Before / After Split Slider</span>
                </span>
                <span className="text-muted-foreground font-mono">
                  Slide left / right to inspect
                </span>
              </div>

              {/* Split Comparison Viewport */}
              <div
                ref={sliderContainerRef}
                onMouseDown={() => setIsSliding(true)}
                onTouchStart={() => setIsSliding(true)}
                className="relative min-h-[380px] max-h-[520px] rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-700/60 flex items-center justify-center cursor-ew-resize select-none"
              >
                {/* 1. Original Image (Full Background) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Original"
                  className="max-h-[480px] max-w-full object-contain pointer-events-none"
                />

                {/* 2. Compressed Image (Clipped Overlay) */}
                {compressedUrl && (
                  <div
                    className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
                    style={{
                      clipPath: `inset(0 0 0 ${sliderPos}%)`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={compressedUrl}
                      alt="Compressed Preview"
                      className="max-h-[480px] max-w-full object-contain"
                    />
                  </div>
                )}

                {/* 3. Draggable Vertical Divider Bar */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-brand-cyan shadow-lg pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-cyan text-brand-navy shadow-xl flex items-center justify-center border-2 border-white pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform">
                    <Split className="w-4 h-4" />
                  </div>
                </div>

                {/* Badges */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-bold text-white border border-white/20">
                  Original
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-brand-cyan/80 backdrop-blur-sm text-[11px] font-bold text-brand-navy border border-brand-cyan/40">
                  Compressed ({quality}%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
                <span>🖱️ Drag the cyan handle to inspect pixel-perfect compression fidelity.</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Client-Side Privacy
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
