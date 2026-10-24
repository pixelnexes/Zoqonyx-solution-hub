"use client";

import * as React from "react";
import { Upload, Download, Copy, Check, RefreshCw, ZoomIn, Sliders, Image as ImageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- 1. Image Compressor ---
export function ImageCompressorTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [originalSize, setOriginalSize] = React.useState<number>(0);
  const [compressedSize, setCompressedSize] = React.useState<number>(0);
  const [quality, setQuality] = React.useState<number>(75);
  const [compressedUrl, setCompressedUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>("compressed-image");

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

      const mimeType = "image/jpeg";
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
  }, [imageSrc, quality]);

  React.useEffect(() => {
    if (imageSrc) {
      compressImage();
    }
  }, [imageSrc, quality, compressImage]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savings =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-2xl cursor-pointer bg-card/60 hover:bg-card transition-all group">
          <Upload className="w-10 h-10 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-heading font-semibold text-base text-foreground">Click to upload an image</span>
          <span className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, WebP, AVIF up to 50MB</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Original</span>
                <span>{formatBytes(originalSize)}</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="Original Preview" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            {/* Compressed Card */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span className="text-brand-cyan">Compressed ({quality}%)</span>
                <span className="font-bold text-foreground">
                  {formatBytes(compressedSize)} {savings > 0 && `(-${savings}%)`}
                </span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center">
                {compressedUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={compressedUrl} alt="Compressed Preview" className="max-h-full max-w-full object-contain" />
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-1/2 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Compression Quality</span>
                  <span className="text-brand-cyan font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs px-3 py-2 rounded-lg border border-border/80 hover:bg-muted cursor-pointer transition-colors text-center shrink-0">
                  <span>Upload Different</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {compressedUrl && (
                  <a
                    href={compressedUrl}
                    download={`${fileName}-zoqonyx.jpg`}
                    className="w-full sm:w-auto"
                  >
                    <Button variant="gradient" className="gap-2 w-full">
                      <Download className="w-4 h-4" />
                      <span>Download ({formatBytes(compressedSize)})</span>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 2. Image Resizer ---
export function ImageResizerTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [origWidth, setOrigWidth] = React.useState<number>(0);
  const [origHeight, setOrigHeight] = React.useState<number>(0);
  const [targetWidth, setTargetWidth] = React.useState<number>(0);
  const [targetHeight, setTargetHeight] = React.useState<number>(0);
  const [lockAspect, setLockAspect] = React.useState(true);
  const [resizedUrl, setResizedUrl] = React.useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspect && origWidth > 0) {
      setTargetHeight(Math.round((w / origWidth) * origHeight));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspect && origHeight > 0) {
      setTargetWidth(Math.round((h / origHeight) * origWidth));
    }
  };

  const applyResize = () => {
    if (!imageSrc || targetWidth <= 0 || targetHeight <= 0) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      setResizedUrl(canvas.toDataURL("image/png"));
    };
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-2xl cursor-pointer bg-card/60 transition-all group">
          <Upload className="w-10 h-10 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-heading font-semibold text-base text-foreground">Upload Image to Resize</span>
          <span className="text-xs text-muted-foreground mt-1">Set pixel dimensions or custom scale</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Width (px) - Original: {origWidth}px
                </label>
                <Input
                  type="number"
                  value={targetWidth || ""}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Height (px) - Original: {origHeight}px
                </label>
                <Input
                  type="number"
                  value={targetHeight || ""}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  id="lockAspect"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="rounded accent-cyan-500"
                />
                <label htmlFor="lockAspect" className="text-xs font-semibold text-foreground cursor-pointer">
                  Lock Aspect Ratio
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={applyResize} variant="gradient" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Process Resize</span>
              </Button>
              {resizedUrl && (
                <a href={resizedUrl} download="resized-zoqonyx.png">
                  <Button variant="default" className="gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download Resized Image</span>
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-center justify-center max-h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resizedUrl || imageSrc} alt="Preview" className="max-h-[350px] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

// --- 3. Image Format Converter ---
export function ImageFormatConverterTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [targetFormat, setTargetFormat] = React.useState<string>("image/webp");
  const [convertedUrl, setConvertedUrl] = React.useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
      setConvertedUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = () => {
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
      setConvertedUrl(canvas.toDataURL(targetFormat, 0.92));
    };
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-2xl cursor-pointer bg-card/60 transition-all group">
          <Upload className="w-10 h-10 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-heading font-semibold text-base text-foreground">Upload Image to Convert</span>
          <span className="text-xs text-muted-foreground mt-1">Convert to WebP, PNG, JPG, or AVIF</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Select Output Format</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="block w-48 h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium"
              >
                <option value="image/webp">WebP (Modern & Small)</option>
                <option value="image/png">PNG (Lossless & Alpha)</option>
                <option value="image/jpeg">JPEG (Universal)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleConvert} variant="gradient">
                Convert Format
              </Button>
              {convertedUrl && (
                <a
                  href={convertedUrl}
                  download={`converted.${targetFormat.split("/")[1]}`}
                >
                  <Button variant="default" className="gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 flex items-center justify-center max-h-[350px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={convertedUrl || imageSrc} alt="Preview" className="max-h-[300px] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. Color Picker from Image ---
export function ColorPickerTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [pickedColor, setPickedColor] = React.useState<string>("#06B6D4");
  const [copied, setCopied] = React.useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [imageSrc]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex =
      "#" +
      ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1)
        .toUpperCase();
    setPickedColor(hex);
  };

  const copyHex = () => {
    navigator.clipboard.writeText(pickedColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-2xl cursor-pointer bg-card/60 transition-all group">
          <Upload className="w-10 h-10 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-heading font-semibold text-base text-foreground">Upload Image to Pick Colors</span>
          <span className="text-xs text-muted-foreground mt-1">Click anywhere on the image to inspect HEX, RGB, HSL</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          {/* Eyedropper Inspector Card */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl border border-border shadow-md"
                style={{ backgroundColor: pickedColor }}
              />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Selected Color</p>
                <p className="text-xl font-heading font-black tracking-wider text-foreground font-mono">
                  {pickedColor}
                </p>
              </div>
            </div>

            <Button onClick={copyHex} variant="outline" className="gap-2">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy HEX"}</span>
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/80 overflow-auto max-h-[500px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-crosshair max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- 5. Image Rotator & Flipper ---
export function ImageRotatorTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [rotation, setRotation] = React.useState<number>(0);
  const [flipH, setFlipH] = React.useState<boolean>(false);
  const [flipV, setFlipV] = React.useState<boolean>(false);
  const [exportedUrl, setExportedUrl] = React.useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setExportedUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const exportRotated = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const is90or270 = rotation % 180 !== 0;
      canvas.width = is90or270 ? img.height : img.width;
      canvas.height = is90or270 ? img.width : img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      setExportedUrl(canvas.toDataURL("image/png"));
    };
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-2xl cursor-pointer bg-card/60 transition-all group">
          <Upload className="w-10 h-10 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-heading font-semibold text-base text-foreground">Upload Image to Rotate or Flip</span>
          <span className="text-xs text-muted-foreground mt-1">90°, 180°, 270° rotation and horizontal/vertical mirroring</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((r) => (r + 90) % 360)}
              >
                Rotate 90°
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFlipH((f) => !f)}
              >
                Flip Horizontal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFlipV((f) => !f)}
              >
                Flip Vertical
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={exportRotated} variant="gradient" size="sm">
                Apply & Render
              </Button>
              {exportedUrl && (
                <a href={exportedUrl} download="rotated-image.png">
                  <Button variant="default" size="sm" className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/80 flex items-center justify-center min-h-[300px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Rotate Preview"
              style={{
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                transition: "transform 0.2s ease",
              }}
              className="max-h-[320px] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- 6. Image to Base64 ---
export function ImageToBase64Tool() {
  const [base64, setBase64] = React.useState<string>("");
  const [fileName, setFileName] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copyString = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-2xl cursor-pointer bg-card/60 transition-all group">
        <Upload className="w-8 h-8 text-brand-cyan mb-2 group-hover:scale-110 transition-transform" />
        <span className="font-heading font-semibold text-sm text-foreground">
          {fileName ? `Loaded: ${fileName}` : "Upload image to get Base64 string"}
        </span>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {base64 && (
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Base64 Data URI</span>
            <Button onClick={copyString} variant="gradient" size="sm" className="gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Base64"}</span>
            </Button>
          </div>

          <textarea
            readOnly
            value={base64}
            rows={6}
            className="w-full p-3 rounded-lg border border-border/70 bg-muted/40 font-mono text-xs text-muted-foreground focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

// --- 7. Image Cropper ---
export function ImageCropperTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = React.useState<"free" | "1:1" | "16:9" | "4:3">("free");
  const [cropWidth, setCropWidth] = React.useState<number>(300);
  const [cropHeight, setCropHeight] = React.useState<number>(300);
  const [cropX, setCropX] = React.useState<number>(0);
  const [cropY, setCropY] = React.useState<number>(0);
  const [croppedUrl, setCroppedUrl] = React.useState<string | null>(null);
  const [imgDims, setImgDims] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgDims({ w: img.width, h: img.height });
        const initialSize = Math.min(img.width, img.height, 400);
        setCropWidth(initialSize);
        setCropHeight(initialSize);
        setCropX(Math.floor((img.width - initialSize) / 2));
        setCropY(Math.floor((img.height - initialSize) / 2));
      };
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = React.useCallback(() => {
    if (!imageSrc || cropWidth <= 0 || cropHeight <= 0) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      setCroppedUrl(canvas.toDataURL("image/png"));
    };
  }, [imageSrc, cropWidth, cropHeight, cropX, cropY]);

  React.useEffect(() => {
    if (imageSrc) {
      applyCrop();
    }
  }, [imageSrc, cropWidth, cropHeight, cropX, cropY, applyCrop]);

  const handleAspectChange = (ratio: "free" | "1:1" | "16:9" | "4:3") => {
    setAspectRatio(ratio);
    if (ratio === "1:1") {
      const size = Math.min(cropWidth, imgDims.h);
      setCropWidth(size);
      setCropHeight(size);
    } else if (ratio === "16:9") {
      const w = cropWidth;
      const h = Math.round((w * 9) / 16);
      setCropHeight(h);
    } else if (ratio === "4:3") {
      const w = cropWidth;
      const h = Math.round((w * 3) / 4);
      setCropHeight(h);
    }
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-2xl cursor-pointer bg-card/60 transition-all group">
          <Upload className="w-10 h-10 text-brand-cyan mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-heading font-semibold text-base text-foreground">Upload Image to Crop</span>
          <span className="text-xs text-muted-foreground mt-1">Preset ratios 1:1, 16:9, 4:3, or custom crop coordinates</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground mr-1">Aspect Ratio:</span>
                {(["free", "1:1", "16:9", "4:3"] as const).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={aspectRatio === r ? "gradient" : "outline"}
                    onClick={() => handleAspectChange(r)}
                    className="capitalize text-xs h-8"
                  >
                    {r}
                  </Button>
                ))}
              </div>

              {croppedUrl && (
                <a href={croppedUrl} download="cropped-zoqonyx.png">
                  <Button variant="default" size="sm" className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Crop ({cropWidth}×{cropHeight}px)</span>
                  </Button>
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Crop Width (Max: {imgDims.w}px)
                </label>
                <Input
                  type="number"
                  value={cropWidth}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCropWidth(val);
                    if (aspectRatio === "1:1") setCropHeight(val);
                    else if (aspectRatio === "16:9") setCropHeight(Math.round((val * 9) / 16));
                    else if (aspectRatio === "4:3") setCropHeight(Math.round((val * 3) / 4));
                  }}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Crop Height (Max: {imgDims.h}px)
                </label>
                <Input
                  type="number"
                  value={cropHeight}
                  disabled={aspectRatio !== "free"}
                  onChange={(e) => setCropHeight(Number(e.target.value))}
                  className="h-8 text-xs font-mono disabled:opacity-75"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Offset X (Start)
                </label>
                <Input
                  type="number"
                  value={cropX}
                  onChange={(e) => setCropX(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Offset Y (Start)
                </label>
                <Input
                  type="number"
                  value={cropY}
                  onChange={(e) => setCropY(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border/80 text-center space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">Original with Crop Reference</span>
              <div className="max-h-[300px] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="Original" className="max-h-[260px] object-contain rounded-lg opacity-90" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-brand-cyan/40 text-center space-y-2">
              <span className="text-xs font-semibold text-brand-cyan">Cropped Output Preview</span>
              <div className="max-h-[300px] flex items-center justify-center overflow-hidden">
                {croppedUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={croppedUrl} alt="Cropped" className="max-h-[260px] object-contain rounded-lg shadow-md" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

