"use client";

import * as React from "react";
import {
  Upload,
  Download,
  Lock,
  Unlock,
  Maximize2,
  RefreshCw,
  Sparkles,
  Sliders,
  Share2,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SocialPreset {
  name: string;
  width: number;
  height: number;
  icon?: string;
}

const SOCIAL_PRESETS: SocialPreset[] = [
  { name: "Instagram Square", width: 1080, height: 1080 },
  { name: "Instagram Story / Reel", width: 1080, height: 1920 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
  { name: "Facebook Cover", width: 820, height: 312 },
  { name: "Twitter / X Header", width: 1500, height: 500 },
  { name: "LinkedIn Banner", width: 1584, height: 396 },
];

export function ImageResizerProTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [origWidth, setOrigWidth] = React.useState<number>(0);
  const [origHeight, setOrigHeight] = React.useState<number>(0);
  const [targetWidth, setTargetWidth] = React.useState<number>(0);
  const [targetHeight, setTargetHeight] = React.useState<number>(0);
  const [scalePercent, setScalePercent] = React.useState<number>(100);
  const [lockAspect, setLockAspect] = React.useState<boolean>(true);
  const [exportFormat, setExportFormat] = React.useState<"png" | "jpeg" | "webp">("png");
  const [resizedUrl, setResizedUrl] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [fileName, setFileName] = React.useState("resized-image");

  // Interactive mouse drag on container
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeHandle, setActiveHandle] = React.useState<string | null>(null);
  const dragStartRef = React.useRef<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setScalePercent(100);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Handle Dimension Changes
  const handleWidthChange = (val: number) => {
    const w = Math.max(1, Math.round(val));
    setTargetWidth(w);
    if (origWidth > 0) {
      setScalePercent(Math.round((w / origWidth) * 100));
      if (lockAspect) {
        setTargetHeight(Math.max(1, Math.round((w / origWidth) * origHeight)));
      }
    }
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(1, Math.round(val));
    setTargetHeight(h);
    if (origHeight > 0) {
      if (lockAspect) {
        const w = Math.max(1, Math.round((h / origHeight) * origWidth));
        setTargetWidth(w);
        setScalePercent(Math.round((w / origWidth) * 100));
      }
    }
  };

  const handlePercentChange = (pct: number) => {
    setScalePercent(pct);
    if (origWidth > 0 && origHeight > 0) {
      setTargetWidth(Math.round((origWidth * pct) / 100));
      setTargetHeight(Math.round((origHeight * pct) / 100));
    }
  };

  const applySocialPreset = (preset: SocialPreset) => {
    setLockAspect(false);
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    if (origWidth > 0) {
      setScalePercent(Math.round((preset.width / origWidth) * 100));
    }
  };

  // Render Resized Output onto Canvas
  const processResize = React.useCallback(() => {
    if (!imageSrc || targetWidth <= 0 || targetHeight <= 0) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // High-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mime = `image/${exportFormat}`;
      const url = canvas.toDataURL(mime, 0.92);
      setResizedUrl(url);
      setIsProcessing(false);
    };
    img.src = imageSrc;
  }, [imageSrc, targetWidth, targetHeight, exportFormat]);

  React.useEffect(() => {
    if (imageSrc && targetWidth > 0 && targetHeight > 0) {
      const timeout = setTimeout(() => {
        processResize();
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [imageSrc, targetWidth, targetHeight, exportFormat, processResize]);

  // Mouse Drag Handle Listeners
  const startDrag = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setActiveHandle(handle);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: targetWidth,
      h: targetHeight,
    };
  };

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeHandle) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      // Sensitivity factor based on image scale
      const factor = 1.8;
      let newW = dragStartRef.current.w;
      let newH = dragStartRef.current.h;

      if (activeHandle.includes("e")) newW += dx * factor;
      if (activeHandle.includes("w")) newW -= dx * factor;
      if (activeHandle.includes("s")) newH += dy * factor;
      if (activeHandle.includes("n")) newH -= dy * factor;

      newW = Math.max(20, Math.round(newW));
      newH = Math.max(20, Math.round(newH));

      if (lockAspect && origWidth > 0 && origHeight > 0) {
        if (activeHandle === "e" || activeHandle === "w") {
          newH = Math.round((newW / origWidth) * origHeight);
        } else if (activeHandle === "n" || activeHandle === "s") {
          newW = Math.round((newH / origHeight) * origWidth);
        } else {
          // Corner drag
          newH = Math.round((newW / origWidth) * origHeight);
        }
      }

      setTargetWidth(newW);
      setTargetHeight(newH);
      if (origWidth > 0) {
        setScalePercent(Math.round((newW / origWidth) * 100));
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      setActiveHandle(null);
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, activeHandle, lockAspect, origWidth, origHeight]);

  return (
    <div className="space-y-8">
      {!imageSrc ? (
        <div className="space-y-6">
          <label className="flex flex-col items-center justify-center p-14 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-3xl cursor-pointer bg-card/60 hover:bg-card transition-all group shadow-sm">
            <div className="p-4 rounded-2xl bg-brand-cyan/10 text-brand-cyan mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground">Upload Image to Resize</span>
            <span className="text-xs text-muted-foreground mt-1 text-center max-w-sm">
              Drag &amp; drop or click to upload. Scale visually with mouse handles or enter exact pixel dimensions.
            </span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          {/* Social Presets Showcase */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Supported 1-Click Social Media Presets
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SOCIAL_PRESETS.map((p) => (
                <div
                  key={p.name}
                  className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1"
                >
                  <p className="text-xs font-semibold text-foreground">{p.name}</p>
                  <p className="text-[11px] font-mono text-brand-cyan">{p.width} x {p.height} px</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Dimensions Control */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-cyan" />
                  <span>Custom Dimensions</span>
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Original: {origWidth} × {origHeight} px
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Width (Pixels)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={targetWidth || ""}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="font-mono text-sm font-bold pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Height (Pixels)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={targetHeight || ""}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="font-mono text-sm font-bold pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">px</span>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Lock Toggle */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    lockAspect
                      ? "border-brand-cyan/60 bg-brand-cyan/10 text-brand-cyan"
                      : "border-border/80 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspect ? "Aspect Ratio Locked" : "Freeform Dimensions"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetWidth(origWidth);
                    setTargetHeight(origHeight);
                    setScalePercent(100);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Original</span>
                </button>
              </div>

              {/* Percentage Scaling Slider */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Percentage Scaling</span>
                  <span className="font-mono text-brand-cyan font-bold">{scalePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={scalePercent}
                  onChange={(e) => handlePercentChange(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[25, 50, 75, 100, 150, 200].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentChange(pct)}
                      className={`text-xs px-2.5 py-1 rounded-md border font-semibold transition-all ${
                        scalePercent === pct
                          ? "bg-brand-cyan text-brand-navy border-transparent"
                          : "border-border/80 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media 1-Click Presets */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-sm">
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4 text-brand-purple" />
                <span>Social Media 1-Click Presets</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Instantly resize to exact platform specifications for optimal display.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {SOCIAL_PRESETS.map((p) => {
                  const isCurrent = targetWidth === p.width && targetHeight === p.height;
                  return (
                    <button
                      key={p.name}
                      onClick={() => applySocialPreset(p)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isCurrent
                          ? "border-brand-cyan bg-brand-cyan/10"
                          : "border-border/80 hover:bg-muted/70"
                      }`}
                    >
                      <span className="font-semibold text-xs text-foreground line-clamp-1">{p.name}</span>
                      <span className="font-mono text-[11px] text-brand-cyan font-bold mt-1">
                        {p.width} × {p.height}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export Settings */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
              <h3 className="font-heading font-bold text-sm text-foreground">Export Format</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "png", label: "PNG (Lossless)" },
                  { id: "jpeg", label: "JPG (Standard)" },
                  { id: "webp", label: "WebP (Ultra Small)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setExportFormat(f.id as "png" | "jpeg" | "webp")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      exportFormat === f.id
                        ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                        : "border-border/80 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs px-3.5 py-2 rounded-xl border border-border/80 hover:bg-muted cursor-pointer font-semibold transition-colors shrink-0">
                  <span>Upload Different</span>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>

                {resizedUrl && (
                  <a
                    href={resizedUrl}
                    download={`${fileName}-${targetWidth}x${targetHeight}.${exportFormat}`}
                    className="w-full"
                  >
                    <Button variant="gradient" className="gap-2 w-full font-bold shadow-md shadow-brand-cyan/20">
                      <Download className="w-4 h-4" />
                      <span>Download ({targetWidth} × {targetHeight} px)</span>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Canvas Resizing Preview */}
          <div className="lg:col-span-6 sticky top-24 space-y-4">
            <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <span className="text-foreground flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-brand-cyan" />
                  <span>Interactive Mouse Drag Viewport</span>
                </span>
                <span className="text-brand-cyan font-mono font-bold">
                  {targetWidth} × {targetHeight} px
                </span>
              </div>

              {/* Viewport Box with Handles */}
              <div
                ref={containerRef}
                className="relative min-h-[380px] max-h-[500px] rounded-2xl bg-slate-900/40 border border-slate-700/50 flex items-center justify-center p-6 overflow-hidden select-none"
              >
                {/* Visual Bounding Box with Drag Handles */}
                <div
                  className="relative group border-2 border-brand-cyan/80 rounded-lg shadow-2xl transition-all"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resizedUrl || imageSrc}
                    alt="Interactive Resize Preview"
                    className="max-h-[340px] max-w-full object-contain pointer-events-none rounded"
                  />

                  {/* Top-Left Corner Handle */}
                  <div
                    onMouseDown={(e) => startDrag("nw", e)}
                    className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-brand-cyan border-2 border-white shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                    title="Drag to resize"
                  />
                  {/* Top-Right Corner Handle */}
                  <div
                    onMouseDown={(e) => startDrag("ne", e)}
                    className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-brand-cyan border-2 border-white shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                    title="Drag to resize"
                  />
                  {/* Bottom-Left Corner Handle */}
                  <div
                    onMouseDown={(e) => startDrag("sw", e)}
                    className="absolute -bottom-2.5 -left-2.5 w-5 h-5 rounded-full bg-brand-cyan border-2 border-white shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                    title="Drag to resize"
                  />
                  {/* Bottom-Right Corner Handle */}
                  <div
                    onMouseDown={(e) => startDrag("se", e)}
                    className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-brand-cyan border-2 border-white shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                    title="Drag to resize"
                  />

                  {/* Right Edge Handle */}
                  <div
                    onMouseDown={(e) => startDrag("e", e)}
                    className="absolute top-1/2 -right-2 w-3.5 h-7 -translate-y-1/2 rounded bg-brand-cyan border border-white shadow-md cursor-ew-resize hover:scale-110 transition-transform"
                    title="Drag width"
                  />
                  {/* Bottom Edge Handle */}
                  <div
                    onMouseDown={(e) => startDrag("s", e)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-3.5 rounded bg-brand-cyan border border-white shadow-md cursor-ns-resize hover:scale-110 transition-transform"
                    title="Drag height"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
                <span>🖱️ Click &amp; drag corner dots to resize visually with mouse.</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High-definition bicubic sampling
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
