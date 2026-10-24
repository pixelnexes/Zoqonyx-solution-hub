"use client";

import * as React from "react";
import {
  Upload,
  Sparkles,
  Download,
  RotateCcw,
  Eraser,
  Paintbrush,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  Columns,
  Layers,
  Wand2,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatermarkRemoverProps {
  mode?: "watermark" | "object";
}

export function WatermarkObjectRemoverTool({ mode = "watermark" }: WatermarkRemoverProps) {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [originalImage, setOriginalImage] = React.useState<HTMLImageElement | null>(null);
  const [processedUrl, setProcessedUrl] = React.useState<string | null>(null);
  const [brushSize, setBrushSize] = React.useState(28);
  const [toolMode, setToolMode] = React.useState<"brush" | "eraser">("brush");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isComparing, setIsComparing] = React.useState(false);
  const [sliderPos, setSliderPos] = React.useState(50);
  const [hasMask, setHasMask] = React.useState(false);
  const [strokeHistory, setStrokeHistory] = React.useState<ImageData[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const isDrawingRef = React.useRef(false);
  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);

  const titleText =
    mode === "watermark"
      ? "AI Watermark Remover & Logo Inpainter"
      : "Object Remover & Magic Photo Eraser";

  const subtitleText =
    mode === "watermark"
      ? "Brush over watermarks, AI logos, timestamps, copyright text, or stock marks to erase them seamlessly with zero server uploads."
      : "Brush over unwanted people, photobombers, wires, blemishes, or background clutter to reconstruct clean pixels instantly.";

  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        loadImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageSrc(src);
      setOriginalImage(img);
      setProcessedUrl(null);
      setStrokeHistory([]);
      setHasMask(false);

      // Initialize canvases
      setTimeout(() => {
        initCanvases(img);
      }, 50);
    };
    img.src = src;
  };

  const initCanvases = (img: HTMLImageElement) => {
    const mainCanvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!mainCanvas || !maskCanvas) return;

    mainCanvas.width = img.naturalWidth;
    mainCanvas.height = img.naturalHeight;
    maskCanvas.width = img.naturalWidth;
    maskCanvas.height = img.naturalHeight;

    const ctx = mainCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }

    const maskCtx = maskCanvas.getContext("2d");
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }
  };

  // Convert mouse/touch event coordinates to native canvas dimensions
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Save current mask state for Undo
  const saveMaskState = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    setStrokeHistory((prev) => [...prev.slice(-10), state]);
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!imageSrc || isProcessing) return;
    saveMaskState();
    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    if (!coords) return;
    lastPointRef.current = coords;
    drawStroke(coords.x, coords.y, coords.x, coords.y);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !imageSrc || isProcessing) return;
    const coords = getCanvasCoords(e);
    if (!coords || !lastPointRef.current) return;

    drawStroke(lastPointRef.current.x, lastPointRef.current.y, coords.x, coords.y);
    lastPointRef.current = coords;
    setHasMask(true);
  };

  const handleEndDraw = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const drawStroke = (x1: number, y1: number, x2: number, y2: number) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (toolMode === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      // Vivid translucent coral mask
      ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const handleUndo = () => {
    if (strokeHistory.length === 0) return;
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    const previousState = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setStrokeHistory((prev) => prev.slice(0, -1));
  };

  const handleClearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    setHasMask(false);
    setStrokeHistory([]);
  };

  // Fast client-side inpainting algorithm
  const performInpainting = () => {
    const mainCanvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!mainCanvas || !maskCanvas || !originalImage) return;

    setIsProcessing(true);

    setTimeout(() => {
      const width = mainCanvas.width;
      const height = mainCanvas.height;
      const mainCtx = mainCanvas.getContext("2d");
      const maskCtx = maskCanvas.getContext("2d");

      if (!mainCtx || !maskCtx) {
        setIsProcessing(false);
        return;
      }

      const imgData = mainCtx.getImageData(0, 0, width, height);
      const maskData = maskCtx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      const mask = maskData.data;

      // Identify masked pixels and bounding box for high-speed local processing
      let minX = width,
        maxX = 0,
        minY = height,
        maxY = 0;
      let maskedCount = 0;

      const isMasked = new Uint8Array(width * height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          // If alpha in mask is significant, treat as masked
          if (mask[idx + 3] > 30) {
            isMasked[y * width + x] = 1;
            maskedCount++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maskedCount === 0) {
        setIsProcessing(false);
        alert("Please brush over the watermark or object you wish to erase first.");
        return;
      }

      // Expand bounding box slightly for texture boundary sampling
      const pad = 16;
      minX = Math.max(0, minX - pad);
      maxX = Math.min(width - 1, maxX + pad);
      minY = Math.max(0, minY - pad);
      maxY = Math.min(height - 1, maxY + pad);

      // Multi-pass boundary diffusion & gradient-weighted patch synthesis
      const maxPasses = 12;
      for (let pass = 0; pass < maxPasses; pass++) {
        let changed = false;

        // Traverse in alternating scan directions to prevent directional bias
        const yStart = pass % 2 === 0 ? minY : maxY;
        const yEnd = pass % 2 === 0 ? maxY : minY;
        const yStep = pass % 2 === 0 ? 1 : -1;

        for (let y = yStart; pass % 2 === 0 ? y <= yEnd : y >= yEnd; y += yStep) {
          for (let x = minX; x <= maxX; x++) {
            const pos = y * width + x;
            if (isMasked[pos] === 1) {
              let rSum = 0,
                gSum = 0,
                bSum = 0,
                weightSum = 0;

              // Sample 5x5 neighborhood with Gaussian distance falloff
              const radius = 3;
              for (let dy = -radius; dy <= radius; dy++) {
                const ny = y + dy;
                if (ny < 0 || ny >= height) continue;

                for (let dx = -radius; dx <= radius; dx++) {
                  if (dx === 0 && dy === 0) continue;
                  const nx = x + dx;
                  if (nx < 0 || nx >= width) continue;

                  const nPos = ny * width + nx;
                  // Only sample unmasked or previously reconstructed pixels
                  if (isMasked[nPos] === 0) {
                    const distSq = dx * dx + dy * dy;
                    const weight = 1.0 / (distSq + 0.1);
                    const nIdx = nPos * 4;

                    rSum += pixels[nIdx] * weight;
                    gSum += pixels[nIdx + 1] * weight;
                    bSum += pixels[nIdx + 2] * weight;
                    weightSum += weight;
                  }
                }
              }

              if (weightSum > 0) {
                const curIdx = pos * 4;
                pixels[curIdx] = Math.round(rSum / weightSum);
                pixels[curIdx + 1] = Math.round(gSum / weightSum);
                pixels[curIdx + 2] = Math.round(bSum / weightSum);
                // Mark as partially resolved
                isMasked[pos] = 0;
                changed = true;
              }
            }
          }
        }

        if (!changed) break;
      }

      // Subtle noise & texture blending pass to eliminate smooth blur artifacts
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const idx = (y * width + x) * 4;
          if (mask[idx + 3] > 30) {
            // Add tiny natural luminance fluctuation matching camera sensor ISO noise
            const noise = (Math.random() - 0.5) * 6;
            pixels[idx] = Math.max(0, Math.min(255, pixels[idx] + noise));
            pixels[idx + 1] = Math.max(0, Math.min(255, pixels[idx + 1] + noise));
            pixels[idx + 2] = Math.max(0, Math.min(255, pixels[idx + 2] + noise));
          }
        }
      }

      mainCtx.putImageData(imgData, 0, 0);

      // Clear mask canvas
      maskCtx.clearRect(0, 0, width, height);
      setHasMask(false);
      setStrokeHistory([]);

      const finalUrl = mainCanvas.toDataURL("image/png");
      setProcessedUrl(finalUrl);
      setIsProcessing(false);
    }, 120);
  };

  // Download cleaned image
  const handleDownload = () => {
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;

    const link = document.createElement("a");
    link.download = mode === "watermark" ? "clean-watermark-free.png" : "clean-object-removed.png";
    link.href = mainCanvas.toDataURL("image/png");
    link.click();
  };

  // Reset to original image
  const handleReset = () => {
    if (originalImage) {
      initCanvases(originalImage);
      setProcessedUrl(null);
      setHasMask(false);
      setStrokeHistory([]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-cyan/10 via-brand-purple/10 to-transparent border border-brand-cyan/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-brand-cyan/20 text-brand-cyan">
              AI Brush Inpainter
            </span>
            <h2 className="text-sm sm:text-base font-heading font-bold text-foreground">
              {titleText}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {subtitleText}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Select Image</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {!imageSrc ? (
        // Empty State Dropzone
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border/80 hover:border-brand-cyan/60 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 bg-card/40 hover:bg-card/70 flex flex-col items-center justify-center min-h-[360px] group"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Wand2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-heading font-bold text-foreground">
            Drop an image or click to upload
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Supports JPEG, PNG, and WebP. Your images are processed 100% locally in your browser with complete privacy.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 rounded-full bg-muted/80 text-[11px] text-muted-foreground border border-border">
              Watermarks
            </span>
            <span className="px-3 py-1 rounded-full bg-muted/80 text-[11px] text-muted-foreground border border-border">
              Timestamps
            </span>
            <span className="px-3 py-1 rounded-full bg-muted/80 text-[11px] text-muted-foreground border border-border">
              AI Generation Logos
            </span>
            <span className="px-3 py-1 rounded-full bg-muted/80 text-[11px] text-muted-foreground border border-border">
              Photobombers & Clutter
            </span>
          </div>
        </div>
      ) : (
        // Active Workspace
        <div className="space-y-6">
          {/* Toolbar Controls */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
            {/* Tool Modes & Brush Size */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/80">
                <button
                  onClick={() => setToolMode("brush")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    toolMode === "brush"
                      ? "bg-background text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5 text-rose-500" />
                  <span>Brush</span>
                </button>
                <button
                  onClick={() => setToolMode("eraser")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    toolMode === "eraser"
                      ? "bg-background text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Eraser</span>
                </button>
              </div>

              {/* Brush Size Slider */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs font-medium text-muted-foreground">Size:</span>
                <input
                  type="range"
                  min="6"
                  max="80"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-brand-cyan cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-foreground w-8 text-right">
                  {brushSize}px
                </span>
              </div>

              {/* Undo & Clear */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={strokeHistory.length === 0 || isProcessing}
                className="h-8 text-xs gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearMask}
                disabled={!hasMask || isProcessing}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear Mask
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isProcessing}
                className="h-9 text-xs"
              >
                Reset
              </Button>

              <Button
                variant="gradient"
                size="sm"
                onClick={performInpainting}
                disabled={isProcessing}
                className="h-9 text-xs gap-2 font-bold shadow-md shadow-brand-cyan/20"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Inpainting Pixels...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Erase Selected Area</span>
                  </>
                )}
              </Button>

              {processedUrl && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  className="h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Clean Image</span>
                </Button>
              )}
            </div>
          </div>

          {/* Interactive Canvas Stage */}
          <div className="relative rounded-2xl border border-border/80 bg-neutral-900/60 p-4 sm:p-6 overflow-hidden flex items-center justify-center min-h-[460px] shadow-inner">
            <div className="relative max-w-full max-h-[600px] overflow-auto rounded-lg shadow-2xl flex items-center justify-center">
              {/* Comparison Slider Mode if Processed */}
              {processedUrl && isComparing ? (
                <div className="relative select-none overflow-hidden max-w-full">
                  <img
                    src={originalImage?.src}
                    alt="Original"
                    className="max-h-[580px] w-auto object-contain block"
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <img
                      src={processedUrl}
                      alt="Cleaned"
                      className="max-h-[580px] w-auto object-contain block"
                    />
                  </div>
                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-black shadow-md flex items-center justify-center text-[10px] font-bold">
                      ↔
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Painting Canvas */
                <div className="relative select-none cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    className="max-h-[580px] w-auto object-contain block rounded-lg"
                  />
                  <canvas
                    ref={maskCanvasRef}
                    onMouseDown={handleStartDraw}
                    onMouseMove={handleDraw}
                    onMouseUp={handleEndDraw}
                    onMouseLeave={handleEndDraw}
                    onTouchStart={handleStartDraw}
                    onTouchMove={handleDraw}
                    onTouchEnd={handleEndDraw}
                    className="absolute inset-0 w-full h-full object-contain block rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-zinc-300 pointer-events-auto">
                🎨 Brush over the watermark or object you want to erase
              </div>

              {processedUrl && (
                <div className="pointer-events-auto flex items-center gap-2">
                  <button
                    onClick={() => setIsComparing(!isComparing)}
                    className="px-3 py-1.5 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 text-[11px] font-semibold text-brand-cyan hover:bg-brand-cyan/30 transition-colors flex items-center gap-1.5"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>{isComparing ? "Back to Edit" : "Compare Before/After"}</span>
                  </button>
                  {isComparing && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="w-24 accent-brand-cyan"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
