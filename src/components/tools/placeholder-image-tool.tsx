"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

export function PlaceholderImageTool() {
  const [width, setWidth] = React.useState<number>(800);
  const [height, setHeight] = React.useState<number>(450);
  const [bg, setBg] = React.useState<string>("#1e293b");
  const [fg, setFg] = React.useState<string>("#94a3b8");
  const [text, setText] = React.useState<string>("");
  const [format, setFormat] = React.useState<"png" | "svg">("png");
  const [copied, setCopied] = React.useState(false);

  const displayText = text.trim() || `${width} × ${height}`;

  const getSvgString = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.max(14, Math.round(width / 20))}" font-weight="bold" fill="${fg}" dominant-baseline="middle" text-anchor="middle">${displayText}</text>
</svg>`;
  };

  const handleDownload = () => {
    if (format === "svg") {
      const svg = getSvgString();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `placeholder_${width}x${height}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = fg;
      ctx.font = `bold ${Math.max(16, Math.round(width / 20))}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayText, width / 2, height / 2);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `placeholder_${width}x${height}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, "image/png");
    }

    addSessionHistory({
      toolSlug: "placeholder-image-generator",
      toolName: "Placeholder Image Generator",
      action: "Generated",
      summary: `Generated ${width}x${height} placeholder image`,
    });
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(getSvgString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PRESETS = [
    { label: "OG Card", w: 1200, h: 630 },
    { label: "Standard HD", w: 1280, h: 720 },
    { label: "Square 1:1", w: 800, h: 800 },
    { label: "Medium Banner", w: 800, h: 450 },
    { label: "Ad Rectangle", w: 300, h: 250 },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-6">
        {/* Preset Pills */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Common Presets</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setWidth(p.w);
                  setHeight(p.h);
                }}
                className={`text-xs ${width === p.w && height === p.h ? "border-teal-500 text-teal-400 bg-teal-500/10" : ""}`}
              >
                {p.label} ({p.w}×{p.h})
              </Button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Width (px)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(10, parseInt(e.target.value) || 10))}
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Height (px)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.max(10, parseInt(e.target.value) || 10))}
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-8 h-8 rounded border border-border p-0 cursor-pointer"
              />
              <Input
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Text Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="w-8 h-8 rounded border border-border p-0 cursor-pointer"
              />
              <Input
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Custom Label Text (Optional)</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Default: ${width} × ${height}`}
            className="text-xs"
          />
        </div>

        {/* Live Preview Container */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Live Preview</span>
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex items-center justify-center min-h-60 overflow-hidden">
            <div
              className="rounded-lg border border-border shadow-md flex items-center justify-center font-bold p-4 text-center transition-all"
              style={{
                backgroundColor: bg,
                color: fg,
                width: "100%",
                maxWidth: "480px",
                aspectRatio: `${width} / ${height}`,
              }}
            >
              <span className="truncate">{displayText}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={format === "png" ? "default" : "outline"}
              onClick={() => setFormat("png")}
              className={`text-xs ${format === "png" ? "bg-teal-600 text-white" : ""}`}
            >
              PNG Format
            </Button>
            <Button
              type="button"
              variant={format === "svg" ? "default" : "outline"}
              onClick={() => setFormat("svg")}
              className={`text-xs ${format === "svg" ? "bg-teal-600 text-white" : ""}`}
            >
              SVG Vector
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleCopySvg} className="text-xs gap-1.5 flex-1 sm:flex-none">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied SVG" : "Copy SVG Code"}</span>
            </Button>
            <Button onClick={handleDownload} className="bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5 flex-1 sm:flex-none">
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
