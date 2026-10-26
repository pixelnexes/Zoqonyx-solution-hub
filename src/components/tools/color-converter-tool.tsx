"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2, Palette, RefreshCw } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

export function ColorConverterTool() {
  const [hex, setHex] = React.useState("#14b8a6");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Conversions
  const hexToRgb = (h: string) => {
    let clean = h.replace("#", "");
    if (clean.length === 3) {
      clean = clean.split("").map((c) => c + c).join("");
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    return { c, m, y, k };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  const values = [
    { label: "HEX", val: hex.toUpperCase() },
    { label: "RGB", val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "RGBA", val: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { label: "HSL", val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "HSLA", val: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` },
    { label: "CMYK", val: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { label: "HSV", val: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    addSessionHistory({
      toolSlug: "color-converter",
      toolName: "Color Converter",
      action: "Converted",
      summary: `Copied ${key}: ${text}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="w-24 h-24 rounded-xl border border-border shadow-inner shrink-0"
            style={{ backgroundColor: hex }}
          />
          <div className="space-y-2 flex-1 w-full">
            <Label className="text-xs font-semibold">Pick or Enter HEX Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0"
              />
              <Input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#14b8a6"
                className="font-mono text-sm max-w-xs"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {values.map((v) => (
            <div
              key={v.label}
              className="p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{v.label}</span>
                <p className="font-mono text-xs font-semibold text-foreground">{v.val}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(v.val, v.label)}
                className="h-7 w-7 text-xs"
              >
                {copiedKey === v.label ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
