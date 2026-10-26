"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, Download, Sparkles, ZoomIn, Eye, CheckCircle2 } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

export function ImageUpscalerTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [scale, setScale] = React.useState<2 | 4>(2);
  const [sharpness, setSharpness] = React.useState<number>(50);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [upscaledUrl, setUpscaledUrl] = React.useState<string | null>(null);
  const [upscaledBlob, setUpscaledBlob] = React.useState<Blob | null>(null);
  const [dimensions, setDimensions] = React.useState<{ w: number; h: number; newW: number; newH: number } | null>(null);
  const [sliderPos, setSliderPos] = React.useState<number>(50);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setImageUrl(url);
      setUpscaledUrl(null);
      setUpscaledBlob(null);

      const img = new Image();
      img.onload = () => {
        setDimensions({
          w: img.width,
          h: img.height,
          newW: img.width * scale,
          newH: img.height * scale,
        });
      };
      img.src = url;
    }
  };

  React.useEffect(() => {
    if (dimensions) {
      setDimensions((prev) => (prev ? { ...prev, newW: prev.w * scale, newH: prev.h * scale } : null));
    }
  }, [scale]);

  const applyUnsharpMask = (ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) => {
    if (amount <= 0) return;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);
    const factor = (amount / 100) * 1.5;

    // 3x3 Laplacian sharpening filter
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;

        for (let c = 0; c < 3; c++) {
          const center = copy[i + c];
          const top = copy[((y - 1) * width + x) * 4 + c];
          const bottom = copy[((y + 1) * width + x) * 4 + c];
          const left = copy[(y * width + (x - 1)) * 4 + c];
          const right = copy[(y * width + (x + 1)) * 4 + c];

          const diff = 4 * center - (top + bottom + left + right);
          data[i + c] = Math.min(255, Math.max(0, center + diff * factor));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const handleUpscale = async () => {
    if (!imageUrl || !dimensions) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const targetW = dimensions.w * scale;
      const targetH = dimensions.h * scale;

      // Multi-step progressive upscaling for smoother bicubic result
      let currentCanvas = document.createElement("canvas");
      currentCanvas.width = dimensions.w;
      currentCanvas.height = dimensions.h;
      let ctx = currentCanvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      let curW = dimensions.w;
      let curH = dimensions.h;

      while (curW * 2 <= targetW) {
        const nextW = curW * 2;
        const nextH = curH * 2;
        const nextCanvas = document.createElement("canvas");
        nextCanvas.width = nextW;
        nextCanvas.height = nextH;
        const nextCtx = nextCanvas.getContext("2d")!;
        nextCtx.imageSmoothingEnabled = true;
        nextCtx.imageSmoothingQuality = "high";
        nextCtx.drawImage(currentCanvas, 0, 0, nextW, nextH);

        currentCanvas = nextCanvas;
        curW = nextW;
        curH = nextH;
      }

      if (curW !== targetW) {
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = targetW;
        finalCanvas.height = targetH;
        const finalCtx = finalCanvas.getContext("2d")!;
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = "high";
        finalCtx.drawImage(currentCanvas, 0, 0, targetW, targetH);
        currentCanvas = finalCanvas;
      }

      ctx = currentCanvas.getContext("2d")!;
      applyUnsharpMask(ctx, targetW, targetH, sharpness);

      currentCanvas.toBlob((blob) => {
        if (!blob) {
          alert("Failed to render upscaled image");
          setIsProcessing(false);
          return;
        }
        const upUrl = URL.createObjectURL(blob);
        setUpscaledUrl(upUrl);
        setUpscaledBlob(blob);
        setIsProcessing(false);

        addSessionHistory({
          toolSlug: "image-upscaler",
          toolName: "Image Upscaler",
          action: "Upscaled",
          summary: `Enlarged image ${scale}x from ${dimensions.w}x${dimensions.h} to ${targetW}x${targetH}`,
        });
      }, "image/png");
    } catch (err: any) {
      alert("Error upscaling: " + err?.message);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!upscaledUrl || !file) return;
    const a = document.createElement("a");
    a.href = upscaledUrl;
    a.download = file.name.replace(/\.[^/.]+$/, "") + `_${scale}x_upscaled.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card hover:border-teal-500/50 transition-colors">
        <input
          type="file"
          id="upscale-upload"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
          className="hidden"
        />
        <label htmlFor="upscale-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <ZoomIn className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {file ? file.name : "Select an image to upscale (2x / 4x)"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client-side super-resolution with bicubic interpolation & edge sharpening
            </p>
          </div>
        </label>
      </div>

      {file && dimensions && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Upscale Multiplier</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={scale === 2 ? "default" : "outline"}
                  onClick={() => setScale(2)}
                  className={scale === 2 ? "bg-teal-600 text-white" : ""}
                >
                  2x Super-Resolution
                </Button>
                <Button
                  type="button"
                  variant={scale === 4 ? "default" : "outline"}
                  onClick={() => setScale(4)}
                  className={scale === 4 ? "bg-teal-600 text-white" : ""}
                >
                  4x Ultra-Resolution
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label className="font-semibold">Edge Sharpness Boost</Label>
                <span className="font-mono text-teal-400 font-semibold">{sharpness}%</span>
              </div>
              <Slider
                value={[sharpness]}
                min={0}
                max={100}
                step={5}
                onValueChange={(val) => setSharpness(val[0])}
              />
              <p className="text-[11px] text-muted-foreground">
                Enhances fine line contrast to counteract enlargement softening.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <span>Original: <strong>{dimensions.w} × {dimensions.h} px</strong></span>
              <span className="mx-2">➔</span>
              <span className="text-teal-400 font-semibold">New: {dimensions.newW} × {dimensions.newH} px</span>
            </div>
            <Button
              onClick={handleUpscale}
              disabled={isProcessing}
              className="bg-teal-600 hover:bg-teal-500 text-white gap-2 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? "Enhancing & Upscaling..." : `Upscale to ${dimensions.newW}×${dimensions.newH}`}</span>
            </Button>
          </div>
        </div>
      )}

      {upscaledUrl && dimensions && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <p className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Upscaled Image Ready ({dimensions.newW} × {dimensions.newH} px)
              </p>
              <p className="text-xs text-muted-foreground">
                Drag slider below to compare original vs enhanced resolution
              </p>
            </div>
            <Button onClick={handleDownload} className="bg-teal-600 hover:bg-teal-500 text-white gap-2 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PNG</span>
            </Button>
          </div>

          {/* Interactive Comparison Slider */}
          <div className="relative h-80 rounded-lg overflow-hidden border border-border select-none bg-muted/20">
            {/* Upscaled Background */}
            <img
              src={upscaledUrl}
              alt="Enhanced"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Original Overlay clipped by sliderPos */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={imageUrl!}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ width: "100%", maxWidth: "none" }}
              />
            </div>

            {/* Slider bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-teal-400 cursor-ew-resize z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg">
                ↔
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />

            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider">
              Original ({dimensions.w}px)
            </span>
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase tracking-wider">
              {scale}x Enhanced ({dimensions.newW}px)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
