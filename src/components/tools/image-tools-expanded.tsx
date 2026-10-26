"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  FileArchive,
  Image as ImageIcon,
  Copy,
  Shield,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { processBatch, createZipDownload, BatchProgress } from "@/lib/batch-processor";
import { addSessionHistory } from "@/lib/session-history";

// 1. Bulk Image Compressor (Up to 50 Images)
export function BulkImageCompressorTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [quality, setQuality] = React.useState<number>(75);
  const [progress, setProgress] = React.useState<BatchProgress | null>(null);
  const [results, setResults] = React.useState<{ name: string; blob: Blob; origSize: number; newSize: number }[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 50);
      setFiles(selected);
      setResults([]);
      setProgress(null);
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const compressImage = async (file: File): Promise<{ name: string; blob: Blob; origSize: number; newSize: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context failed"));
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  name: file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg",
                  blob,
                  origSize: file.size,
                  newSize: blob.size,
                });
              } else {
                reject(new Error("Compression failed"));
              }
            },
            "image/jpeg",
            quality / 100
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    };

    try {
      const { results: compressed } = await processBatch(files, compressImage, {
        concurrency: 2,
        maxItems: 50,
        signal: controller.signal,
        onProgress: (p) => setProgress(p),
      });

      setResults(compressed);
      addSessionHistory({
        toolSlug: "bulk-image-compressor",
        toolName: "Bulk Image Compressor",
        action: "Batch Compressed",
        summary: `Compressed ${compressed.length} images at ${quality}% quality`,
      });
    } catch (e: any) {
      alert("Batch compression error: " + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAllZip = async () => {
    if (results.length === 0) return;
    await createZipDownload(results, "zoqonyx_compressed_batch.zip");
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
        <input
          type="file"
          id="bulk-comp-upload"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <label htmlFor="bulk-comp-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground">Select up to 50 photos to compress in bulk</p>
          <p className="text-xs text-muted-foreground">Processed safely in-browser with zero freezing</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">{files.length} Photo(s) Selected (Max 50)</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400">Quality: {quality}%</span>
            </div>
          </div>

          <Slider value={[quality]} min={10} max={95} step={1} onValueChange={(v) => setQuality(v[0])} />

          {progress && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Progress ({progress.current}/{progress.total})</span>
                <span className="text-teal-400 font-bold">{progress.percent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-200"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleCompress}
              disabled={isProcessing}
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white gap-2"
            >
              <FileArchive className="w-4 h-4" />
              <span>{isProcessing ? "Processing Safely..." : "Compress All Images"}</span>
            </Button>
            {results.length > 0 && (
              <Button
                onClick={downloadAllZip}
                variant="outline"
                className="gap-2 border-teal-500/40 text-teal-400 hover:bg-teal-500/10"
              >
                <Download className="w-4 h-4" />
                <span>Download All (ZIP)</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Bulk Image Resizer
export function BulkImageResizerTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [scale, setScale] = React.useState<number>(50);
  const [results, setResults] = React.useState<{ name: string; blob: Blob }[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleResize = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const factor = scale / 100;

    const resizeImage = async (file: File): Promise<{ name: string; blob: Blob }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * factor));
          canvas.height = Math.max(1, Math.round(img.height * factor));
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Context failed"));
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                name: file.name.replace(/\.[^/.]+$/, "") + `_${canvas.width}x${canvas.height}.png`,
                blob,
              });
            } else {
              reject(new Error("Blob conversion failed"));
            }
          }, "image/png");
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const { results: resized } = await processBatch(files, resizeImage, { concurrency: 2, maxItems: 50 });
      setResults(resized);
      addSessionHistory({
        toolSlug: "bulk-image-resizer",
        toolName: "Bulk Image Resizer",
        action: "Batch Resized",
        summary: `Resized ${resized.length} images to ${scale}% scale`,
      });
    } catch (e: any) {
      alert("Resize failed: " + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
        <input
          type="file"
          id="bulk-resize-upload"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) setFiles(Array.from(e.target.files).slice(0, 50));
          }}
          className="hidden"
        />
        <label htmlFor="bulk-resize-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground">Select up to 50 images to batch resize</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">{files.length} Photo(s) Queued</span>
            <span className="text-xs font-bold text-teal-400">Scale: {scale}%</span>
          </div>
          <Slider value={[scale]} min={10} max={200} step={5} onValueChange={(v) => setScale(v[0])} />

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleResize}
              disabled={isProcessing}
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white gap-2"
            >
              <span>{isProcessing ? "Resizing in Browser..." : `Resize All to ${scale}%`}</span>
            </Button>
            {results.length > 0 && (
              <Button
                onClick={() => createZipDownload(results, "zoqonyx_resized_batch.zip")}
                variant="outline"
                className="gap-2 border-teal-500/40 text-teal-400"
              >
                <Download className="w-4 h-4" />
                <span>Download All (ZIP)</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Favicon Generator
export function FaviconGeneratorTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [imageSrc, setImageSrc] = React.useState<string>("");
  const [icons, setIcons] = React.useState<{ size: number; blob: Blob; url: string }[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setImageSrc(url);
      setIcons([]);
    }
  };

  const generateFavicons = async () => {
    if (!imageSrc) return;
    setIsGenerating(true);
    const SIZES = [16, 32, 48, 180, 512];
    const generated: { size: number; blob: Blob; url: string }[] = [];

    const img = new Image();
    img.src = imageSrc;
    await new Promise((res) => (img.onload = res));

    for (const size of SIZES) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, size, size);
        await new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              generated.push({
                size,
                blob,
                url: URL.createObjectURL(blob),
              });
            }
            resolve();
          }, "image/png");
        });
      }
    }

    setIcons(generated);
    setIsGenerating(false);
    addSessionHistory({
      toolSlug: "favicon-generator",
      toolName: "Favicon Generator",
      action: "Generated Favicons",
      summary: `Created 5 icon sizes (16px to 512px) + HTML snippet`,
    });
  };

  const downloadAll = async () => {
    const filesToZip = icons.map((ic) => ({
      name: ic.size === 180 ? "apple-touch-icon.png" : `favicon-${ic.size}x${ic.size}.png`,
      blob: ic.blob,
    }));
    await createZipDownload(filesToZip, "zoqonyx_favicons.zip");
  };

  const htmlTags = `<!-- Favicon & Touch Icons -->\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
        <input type="file" id="fav-upload" accept="image/*" onChange={handleFile} className="hidden" />
        <label htmlFor="fav-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground">
            {file ? file.name : "Upload Square Logo or Icon"}
          </p>
          <p className="text-xs text-muted-foreground">PNG, SVG, or JPG recommended</p>
        </label>
      </div>

      {imageSrc && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <Button
            onClick={generateFavicons}
            disabled={isGenerating}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white"
          >
            {isGenerating ? "Generating All Sizes..." : "Generate Favicon Suite"}
          </Button>

          {icons.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {icons.map((ic) => (
                  <div key={ic.size} className="p-3 rounded-xl border border-border text-center space-y-2 bg-muted/20">
                    <img src={ic.url} alt={`icon-${ic.size}`} className="mx-auto w-8 h-8 object-contain" />
                    <p className="text-xs font-mono font-bold">{ic.size}x{ic.size}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">HTML Meta Tags</Label>
                <textarea
                  readOnly
                  value={htmlTags}
                  rows={4}
                  className="w-full p-2.5 text-xs font-mono rounded-lg border border-border bg-muted/40"
                />
              </div>

              <Button onClick={downloadAll} className="w-full gap-2 bg-teal-600 hover:bg-teal-500 text-white">
                <Download className="w-4 h-4" />
                <span>Download Favicon Package (.ZIP)</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 4. Passport Photo Maker
export function PassportPhotoMakerTool() {
  const [imageSrc, setImageSrc] = React.useState<string>("");
  const [standard, setStandard] = React.useState<"us" | "uk" | "schengen">("us");
  const [resultUrl, setResultUrl] = React.useState<string>("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageSrc(URL.createObjectURL(f));
      setResultUrl("");
    }
  };

  const handleGenerateSheet = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      // 4x6 print sheet at 300 DPI = 1200 x 1800 px
      const canvas = document.createElement("canvas");
      canvas.width = 1800;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1800, 1200);

      // Photo size: US 2x2 in = 600x600 px. 2 rows of 3 photos = 6 photos
      const photoW = 500;
      const photoH = standard === "us" ? 500 : 650;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          const x = 80 + col * (photoW + 60);
          const y = 80 + row * (photoH + 50);

          // Draw crop of image
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, photoW, photoH);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(img, x, y, photoW, photoH);
          ctx.restore();

          // Border outline for cutting
          ctx.strokeStyle = "#cccccc";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoW, photoH);
        }
      }

      const url = canvas.toDataURL("image/jpeg", 0.95);
      setResultUrl(url);
      addSessionHistory({
        toolSlug: "passport-photo-maker",
        toolName: "Passport Photo Maker",
        action: "Created Print Sheet",
        summary: `Created 6-photo printable 4x6 sheet (${standard.toUpperCase()} spec)`,
      });
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
        <input type="file" id="pass-upload" accept="image/*" onChange={handleUpload} className="hidden" />
        <label htmlFor="pass-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground">Upload Portrait / Headshot</p>
          <p className="text-xs text-muted-foreground">White background recommended</p>
        </label>
      </div>

      {imageSrc && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Standard Format</Label>
            <select
              value={standard}
              onChange={(e: any) => setStandard(e.target.value)}
              className="p-1.5 text-xs rounded border border-border bg-background"
            >
              <option value="us">United States (2x2 inch)</option>
              <option value="uk">United Kingdom (35x45 mm)</option>
              <option value="schengen">Schengen / Europe (35x45 mm)</option>
            </select>
          </div>

          <Button onClick={handleGenerateSheet} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
            Generate 4x6 Printable Sheet (6 Photos)
          </Button>

          {resultUrl && (
            <div className="space-y-3 pt-2 text-center">
              <img src={resultUrl} alt="Sheet" className="max-w-md mx-auto rounded-lg border border-border" />
              <a
                href={resultUrl}
                download={`passport_sheet_${standard}.jpg`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Print Sheet</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 5. Watermark Adder
export function WatermarkAdderTool() {
  const [imageSrc, setImageSrc] = React.useState<string>("");
  const [text, setText] = React.useState<string>("CONFIDENTIAL");
  const [opacity, setOpacity] = React.useState<number>(50);
  const [fontSize, setFontSize] = React.useState<number>(36);
  const [resultUrl, setResultUrl] = React.useState<string>("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageSrc(URL.createObjectURL(f));
      setResultUrl("");
    }
  };

  const applyWatermark = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // Draw diagonal watermark text
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 0);

      // Border outline for contrast
      ctx.strokeStyle = `rgba(0, 0, 0, ${(opacity / 100) * 0.5})`;
      ctx.lineWidth = 2;
      ctx.strokeText(text, 0, 0);
      ctx.restore();

      const url = canvas.toDataURL("image/png");
      setResultUrl(url);
      addSessionHistory({
        toolSlug: "watermark-adder",
        toolName: "Watermark Adder",
        action: "Stamped Watermark",
        summary: `Added "${text}" watermark to image`,
      });
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
        <input type="file" id="wm-upload" accept="image/*" onChange={handleUpload} className="hidden" />
        <label htmlFor="wm-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground">Upload Image to Watermark</p>
        </label>
      </div>

      {imageSrc && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Watermark Text</Label>
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Watermark text" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Opacity ({opacity}%)</Label>
              <Slider value={[opacity]} min={10} max={90} step={5} onValueChange={(v) => setOpacity(v[0])} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Font Size ({fontSize}px)</Label>
              <Slider value={[fontSize]} min={16} max={96} step={4} onValueChange={(v) => setFontSize(v[0])} />
            </div>
          </div>

          <Button onClick={applyWatermark} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
            Apply Watermark
          </Button>

          {resultUrl && (
            <div className="space-y-3 pt-2 text-center">
              <img src={resultUrl} alt="Watermarked" className="max-h-72 mx-auto rounded-lg border border-border" />
              <a
                href={resultUrl}
                download="watermarked_image.png"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Watermarked Image</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 6. EXIF Data Remover
export function ExifDataRemoverTool() {
  const [cleanedUrl, setCleanedUrl] = React.useState<string>("");
  const [origName, setOrigName] = React.useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setOrigName(f.name);
      const img = new Image();
      img.src = URL.createObjectURL(f);
      img.onload = () => {
        // Drawing into clean HTML5 canvas strips all EXIF, GPS, camera metadata entirely!
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              setCleanedUrl(URL.createObjectURL(blob));
              addSessionHistory({
                toolSlug: "exif-data-remover",
                toolName: "EXIF Data Remover",
                action: "Cleaned EXIF",
                summary: `Stripped GPS & camera tags from ${f.name}`,
              });
            }
          }, "image/jpeg", 0.95);
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
        <input type="file" id="exif-upload" accept="image/*" onChange={handleFile} className="hidden" />
        <label htmlFor="exif-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Shield className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground">Upload Photo to Remove EXIF & GPS Metadata</p>
          <p className="text-xs text-muted-foreground">Strips device serials, coordinates, timestamp</p>
        </label>
      </div>

      {cleanedUrl && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 text-center">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 inline-flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>All Metadata & Location coordinates successfully stripped!</span>
          </div>
          <div>
            <a
              href={cleanedUrl}
              download={`clean_${origName}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Download Sanitized Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// 7. SVG to PNG Converter
export function SvgToPngConverterTool() {
  const [svgInput, setSvgInput] = React.useState<string>("");
  const [scale, setScale] = React.useState<number>(2);
  const [pngUrl, setPngUrl] = React.useState<string>("");

  const handleConvert = () => {
    if (!svgInput) return;
    const blob = new Blob([svgInput], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = (img.width || 500) * scale;
      canvas.height = (img.height || 500) * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/png");
        setPngUrl(data);
        addSessionHistory({
          toolSlug: "svg-to-png-converter",
          toolName: "SVG to PNG Converter",
          action: "Rasterized",
          summary: `Rendered SVG to ${canvas.width}x${canvas.height} PNG`,
        });
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Paste SVG Code</Label>
          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            rows={8}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Resolution Multiplier</Label>
          <div className="flex gap-2">
            {[1, 2, 4].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={scale === s ? "default" : "outline"}
                onClick={() => setScale(s)}
                className={scale === s ? "bg-teal-600 text-white" : ""}
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleConvert}
          disabled={!svgInput}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white"
        >
          Render to High-Res PNG
        </Button>

        {pngUrl && (
          <div className="space-y-3 pt-2 text-center">
            <img src={pngUrl} alt="Rendered PNG" className="max-h-60 mx-auto rounded border border-border" />
            <a
              href={pngUrl}
              download="rendered_vector.png"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG Image</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}