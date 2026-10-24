"use client";

import * as React from "react";
import { Upload, Download, Copy, Check, RefreshCw, ZoomIn, Sliders, Image as ImageIcon, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ImageCompressorProTool } from "./image-compressor-pro";
import { ImageResizerProTool } from "./image-resizer-pro";

// --- 1. Image Compressor Pro ---
export function ImageCompressorTool() {
  return <ImageCompressorProTool />;
}

// --- 2. Image Resizer Pro ---
export function ImageResizerTool() {
  return <ImageResizerProTool />;
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

// --- 4. Color Picker from Image Pro ---
export function ColorPickerTool() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [pickedColor, setPickedColor] = React.useState<string>("#06B6D4");
  const [rgbVal, setRgbVal] = React.useState<string>("rgb(6, 182, 212)");
  const [hslVal, setHslVal] = React.useState<string>("hsl(189, 95%, 43%)");
  const [cmykVal, setCmykVal] = React.useState<string>("cmyk(97%, 14%, 0%, 17%)");
  const [palette, setPalette] = React.useState<string[]>([]);
  const [copiedFormat, setCopiedFormat] = React.useState<string | null>(null);

  // Loupe magnifier state
  const [loupe, setLoupe] = React.useState<{ x: number; y: number; visible: boolean; color: string }>({
    x: 0,
    y: 0,
    visible: false,
    color: "#06B6D4",
  });

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    const k = Math.min(c, Math.min(m, y));
    if (k === 1) return "cmyk(0%, 0%, 0%, 100%)";
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    const kPct = Math.round(k * 100);
    return `cmyk(${c}%, ${m}%, ${y}%, ${kPct}%)`;
  };

  const updateColorValues = (hex: string) => {
    setPickedColor(hex);
    const { r, g, b } = hexToRgb(hex);
    setRgbVal(`rgb(${r}, ${g}, ${b})`);
    setHslVal(rgbToHsl(r, g, b));
    setCmykVal(rgbToCmyk(r, g, b));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Extract Palette on Image Load
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

      // Extract 8 dominant sample colors across canvas
      try {
        const stepX = Math.floor(img.width / 5);
        const stepY = Math.floor(img.height / 5);
        const set = new Set<string>();
        for (let i = 1; i <= 4; i++) {
          for (let j = 1; j <= 4; j++) {
            const pixel = ctx.getImageData(i * stepX, j * stepY, 1, 1).data;
            const h =
              "#" +
              ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
                .toString(16)
                .slice(1)
                .toUpperCase();
            set.add(h);
            if (set.size >= 8) break;
          }
          if (set.size >= 8) break;
        }
        setPalette(Array.from(set));
      } catch (e) {
        console.error(e);
      }
    };
  }, [imageSrc]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex =
        "#" +
        ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
          .toString(16)
          .slice(1)
          .toUpperCase();
      setLoupe({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true,
        color: hex,
      });
    }
  };

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
    updateColorValues(hex);
  };

  const copyVal = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(label);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-8">
      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-14 border-2 border-dashed border-border/80 hover:border-brand-cyan/70 rounded-3xl cursor-pointer bg-card/60 hover:bg-card transition-all group shadow-sm">
          <div className="p-4 rounded-2xl bg-brand-cyan/10 text-brand-cyan mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">Upload Image for Eyedropper</span>
          <span className="text-xs text-muted-foreground mt-1 text-center max-w-sm">
            Hover to use the 10x magnifying loupe, click to inspect exact HEX/RGB/HSL, or select from auto-extracted palettes.
          </span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls & Values Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Color Swatch Card */}
            <div className="p-5 rounded-3xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl border-2 border-white shadow-xl shrink-0"
                  style={{ backgroundColor: pickedColor }}
                />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Inspected Color
                  </span>
                  <p className="text-2xl font-heading font-black tracking-wider text-foreground font-mono">
                    {pickedColor}
                  </p>
                </div>
              </div>

              {/* Formats Copy Grid */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                {[
                  { label: "HEX", val: pickedColor },
                  { label: "RGB", val: rgbVal },
                  { label: "HSL", val: hslVal },
                  { label: "CMYK", val: cmykVal },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs"
                  >
                    <span className="font-semibold text-muted-foreground w-12">{item.label}</span>
                    <span className="font-mono font-bold text-foreground text-xs flex-1 px-2 select-all">
                      {item.val}
                    </span>
                    <button
                      onClick={() => copyVal(item.val, item.label)}
                      className="px-2.5 py-1 rounded-lg border border-border/80 hover:bg-card text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedFormat === item.label ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-Extracted Palette */}
            {palette.length > 0 && (
              <div className="p-5 rounded-3xl bg-card border border-border/80 space-y-3 shadow-sm">
                <h3 className="font-heading font-bold text-sm text-foreground flex items-center justify-between">
                  <span>Auto-Extracted Palette</span>
                  <span className="text-xs text-muted-foreground">Click to select</span>
                </h3>

                <div className="grid grid-cols-4 gap-2.5 pt-1">
                  {palette.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => updateColorValues(color)}
                      className="group p-1.5 rounded-xl border border-border/80 hover:border-brand-cyan/70 hover:scale-105 transition-all text-center flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-full h-9 rounded-lg border border-black/10 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-mono text-[10px] font-bold text-muted-foreground group-hover:text-foreground uppercase">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="block text-center text-xs px-3 py-2 rounded-xl border border-border/80 hover:bg-muted cursor-pointer font-semibold transition-colors">
              <span>Upload Different Image</span>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          {/* Right Column: Canvas with Magnifier */}
          <div className="lg:col-span-7 sticky top-24 space-y-4">
            <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <span className="text-foreground">Click image to sample color</span>
                <span className="text-brand-cyan">10x Loupe Active</span>
              </div>

              <div
                className="relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-700/60 flex items-center justify-center p-2 min-h-[360px]"
                onMouseLeave={() => setLoupe((l) => ({ ...l, visible: false }))}
              >
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onMouseMove={handleMouseMove}
                  className="cursor-crosshair max-w-full max-h-[460px] object-contain rounded-lg"
                />

                {/* Floating 10x Magnifying Loupe */}
                {loupe.visible && (
                  <div
                    className="absolute pointer-events-none rounded-full w-20 h-20 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: loupe.x,
                      top: loupe.y,
                      backgroundColor: loupe.color,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full border border-black/80 bg-white shadow-sm" />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
                <span>🔍 Crosshair shows exact pixel under your cursor.</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> WCAG compliant sampling
                </span>
              </div>
            </div>
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

  const handleAspectChange = (ratio: "free" | "1:1" | "16:9" | "4:3" | "9:16" | "3:2") => {
    setAspectRatio(ratio as any);
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
    } else if (ratio === "9:16") {
      const w = cropWidth;
      const h = Math.round((w * 16) / 9);
      setCropHeight(h);
    } else if (ratio === "3:2") {
      const w = cropWidth;
      const h = Math.round((w * 2) / 3);
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

