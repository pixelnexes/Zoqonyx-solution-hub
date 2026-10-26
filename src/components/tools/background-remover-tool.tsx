"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, Download, Sparkles, RefreshCw, Layers, CheckCircle2 } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";
import { processBatch, createZipDownload, type BatchProgress } from "@/lib/batch-processor";

interface ProcessedImage {
  id: string;
  name: string;
  originalUrl: string;
  processedUrl: string;
  blob: Blob;
}

export function BackgroundRemoverTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [tolerance, setTolerance] = React.useState<number>(30);
  const [feather, setFeather] = React.useState<number>(2);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processedImages, setProcessedImages] = React.useState<ProcessedImage[]>([]);
  const [activeIdx, setActiveIdx] = React.useState<number>(0);
  const [bgColorSample, setBgColorSample] = React.useState<{ r: number; g: number; b: number } | null>(null);
  const [progress, setProgress] = React.useState<BatchProgress | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 20);
      setFiles(selected);
      setProcessedImages([]);
      setActiveIdx(0);
      setBgColorSample(null);
    }
  };

  const removeBackgroundFromCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    targetColor: { r: number; g: number; b: number } | null,
    tol: number,
    smooth: number
  ) => {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // If no color sampled, auto-sample corner average
    let r0 = targetColor ? targetColor.r : 0;
    let g0 = targetColor ? targetColor.g : 0;
    let b0 = targetColor ? targetColor.b : 0;

    if (!targetColor) {
      // average 4 corners (top-left, top-right, bottom-left, bottom-right)
      const corners = [0, (width - 1) * 4, (width * (height - 1)) * 4, (width * height - 1) * 4];
      let cr = 0, cg = 0, cb = 0;
      corners.forEach((idx) => {
        cr += data[idx];
        cg += data[idx + 1];
        cb += data[idx + 2];
      });
      r0 = Math.round(cr / 4);
      g0 = Math.round(cg / 4);
      b0 = Math.round(cb / 4);
    }

    const threshold = (tol / 100) * 441.67; // max distance between (255,255,255) and (0,0,0) is sqrt(3*255^2) ≈ 441.67
    const featherDist = smooth * 15;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const dist = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2);

      if (dist < threshold) {
        data[i + 3] = 0; // Transparent
      } else if (dist < threshold + featherDist && featherDist > 0) {
        const factor = (dist - threshold) / featherDist;
        data[i + 3] = Math.round(data[i + 3] * factor);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const processSingleFile = async (file: File): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        removeBackgroundFromCanvas(ctx, canvas.width, canvas.height, bgColorSample, tolerance, feather);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to export blob"));
            return;
          }
          const pUrl = URL.createObjectURL(blob);
          resolve({
            id: Math.random().toString(36).substring(7),
            name: file.name.replace(/\.[^/.]+$/, "") + "_transparent.png",
            originalUrl: url,
            processedUrl: pUrl,
            blob,
          });
        }, "image/png");
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  };

  const handleProcessAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const { results } = await processBatch(
        files,
        async (file, idx) => {
          return await processSingleFile(file);
        },
        {
          concurrency: 2,
          maxItems: 20,
          onProgress: setProgress,
        }
      );

      setProcessedImages(results);
      setActiveIdx(0);
      addSessionHistory({
        toolSlug: "background-remover",
        toolName: "Background Remover",
        action: "Removed Background",
        summary: `Processed ${results.length} image(s) to transparent PNG`,
      });
    } catch (err: any) {
      alert("Error processing images: " + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (img: ProcessedImage) => {
    const a = document.createElement("a");
    a.href = img.processedUrl;
    a.download = img.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    if (processedImages.length === 0) return;
    await createZipDownload(
      processedImages.map((p) => ({ name: p.name, blob: p.blob })),
      "zoqonyx_transparent_images.zip"
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card hover:border-teal-500/50 transition-colors">
        <input
          type="file"
          id="bg-upload"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <label htmlFor="bg-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Upload 1 to 20 Images</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client-side background remover with transparent PNG export (Max 20 files)
            </p>
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label className="font-medium">Color Sensitivity (Tolerance)</Label>
                <span className="font-mono text-teal-400 font-semibold">{tolerance}%</span>
              </div>
              <Slider
                value={[tolerance]}
                min={5}
                max={90}
                step={1}
                onValueChange={(val) => setTolerance(val[0])}
              />
              <p className="text-[11px] text-muted-foreground">
                Higher values remove broader color shades surrounding the subject.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label className="font-medium">Edge Feathering & Smoothing</Label>
                <span className="font-mono text-teal-400 font-semibold">{feather}px</span>
              </div>
              <Slider
                value={[feather]}
                min={0}
                max={8}
                step={1}
                onValueChange={(val) => setFeather(val[0])}
              />
              <p className="text-[11px] text-muted-foreground">
                Softens silhouette contours to eliminate jagged boundaries.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground font-medium">
              {files.length} image(s) queued
            </span>
            <Button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="bg-teal-600 hover:bg-teal-500 text-white gap-2 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? `Processing (${progress?.current || 0}/${files.length})...` : "Remove Backgrounds Now"}</span>
            </Button>
          </div>
        </div>
      )}

      {processedImages.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <p className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                {processedImages.length} Image(s) Processed Successfully
              </p>
              <p className="text-xs text-muted-foreground">Click any image to view before & after</p>
            </div>
            {processedImages.length > 1 && (
              <Button onClick={downloadAllZip} variant="outline" size="sm" className="gap-2 text-xs">
                <Download className="w-4 h-4 text-teal-400" />
                <span>Download All as ZIP</span>
              </Button>
            )}
          </div>

          {/* Active Preview */}
          {processedImages[activeIdx] && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Original</span>
                  <div className="h-64 rounded-lg border border-border flex items-center justify-center p-2 bg-muted/20 overflow-hidden">
                    <img
                      src={processedImages[activeIdx].originalUrl}
                      alt="Original"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-teal-400 uppercase">Transparent Output</span>
                  <div
                    className="h-64 rounded-lg border border-border flex items-center justify-center p-2 overflow-hidden"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    }}
                  >
                    <img
                      src={processedImages[activeIdx].processedUrl}
                      alt="Transparent PNG"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                  {processedImages[activeIdx].name}
                </span>
                <Button
                  onClick={() => downloadSingle(processedImages[activeIdx])}
                  className="bg-teal-600 hover:bg-teal-500 text-white gap-1.5 text-xs h-8"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </Button>
              </div>
            </div>
          )}

          {/* Thumbnails if multiple */}
          {processedImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-3 border-t border-border">
              {processedImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all p-1 ${
                    activeIdx === idx ? "border-teal-500 ring-2 ring-teal-500/20" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img.processedUrl} alt={img.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
