"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Layers,
  Copy,
  CheckCircle2,
  Sparkles,
  Palette,
  Maximize2,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

// 1. Neumorphism Generator
export function NeumorphismGeneratorTool() {
  const [size, setSize] = React.useState<number>(200);
  const [radius, setRadius] = React.useState<number>(30);
  const [distance, setDistance] = React.useState<number>(15);
  const [blur, setBlur] = React.useState<number>(30);
  const [bgColor, setBgColor] = React.useState<string>("#1e293b");
  const [inset, setInset] = React.useState(false);

  const lightShadow = inset
    ? `inset -${distance}px -${distance}px ${blur}px rgba(255,255,255,0.08)`
    : `-${distance}px -${distance}px ${blur}px rgba(255,255,255,0.08)`;
  const darkShadow = inset
    ? `inset ${distance}px ${distance}px ${blur}px rgba(0,0,0,0.4)`
    : `${distance}px ${distance}px ${blur}px rgba(0,0,0,0.4)`;

  const boxShadow = `${darkShadow}, ${lightShadow}`;

  const css = `border-radius: ${radius}px;\nbackground: ${bgColor};\nbox-shadow: ${boxShadow};`;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-6">
        {/* Live Preview Canvas */}
        <div
          className="flex items-center justify-center p-12 rounded-2xl border border-border min-h-[300px]"
          style={{ backgroundColor: bgColor }}
        >
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: `${radius}px`,
              backgroundColor: bgColor,
              boxShadow: boxShadow,
            }}
            className="flex items-center justify-center text-xs font-semibold text-foreground/60 transition-all duration-150"
          >
            Neumorphic Shape
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Border Radius ({radius}px)</Label>
            <Slider value={[radius]} min={0} max={100} step={2} onValueChange={(v) => setRadius(v[0])} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Distance ({distance}px)</Label>
            <Slider value={[distance]} min={5} max={40} step={1} onValueChange={(v) => setDistance(v[0])} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Blur ({blur}px)</Label>
            <Slider value={[blur]} min={10} max={60} step={2} onValueChange={(v) => setBlur(v[0])} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Background Theme</Label>
            <div className="flex gap-2">
              {["#1e293b", "#0f172a", "#e2e8f0", "#f1f5f9"].map((c) => (
                <button
                  key={c}
                  onClick={() => setBgColor(c)}
                  className="w-8 h-8 rounded-lg border border-border shadow"
                  style={{ backgroundColor: c }}
                />
              ))}
              <Button
                size="sm"
                variant={inset ? "default" : "outline"}
                onClick={() => setInset(!inset)}
                className="text-xs ml-auto"
              >
                {inset ? "Inset Shadow" : "Flat Shadow"}
              </Button>
            </div>
          </div>
        </div>

        {/* CSS Code */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">CSS Code</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(css)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <pre className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs overflow-x-auto text-teal-400">
            {css}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 2. Clip Path Generator
export function ClipPathGeneratorTool() {
  const [shape, setShape] = React.useState<string>("hexagon");

  const SHAPES: Record<string, string> = {
    triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
    hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    octagon: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    rhombus: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    message: "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)",
    circle: "circle(50% at 50% 50%)",
  };

  const clipPathValue = SHAPES[shape] || SHAPES.hexagon;
  const css = `clip-path: ${clipPathValue};`;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-6">
        <div className="flex items-center justify-center p-12 rounded-2xl bg-muted/30 border border-border min-h-[260px]">
          <div
            style={{ clipPath: clipPathValue }}
            className="w-48 h-48 bg-gradient-to-tr from-teal-500 to-emerald-400 transition-all duration-300 shadow-2xl flex items-center justify-center text-slate-900 font-bold"
          >
            Shape
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Select Shape Preset</Label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(SHAPES).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={shape === s ? "default" : "outline"}
                onClick={() => setShape(s)}
                className={shape === s ? "bg-teal-600 text-white capitalize" : "capitalize text-xs"}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">CSS Property</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(css)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs text-teal-400">
            {css}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Text Shadow Generator
export function TextShadowGeneratorTool() {
  const [text, setText] = React.useState<string>("ZOQONYX");
  const [offsetX, setOffsetX] = React.useState<number>(4);
  const [offsetY, setOffsetY] = React.useState<number>(4);
  const [blur, setBlur] = React.useState<number>(8);
  const [color, setColor] = React.useState<string>("#14b8a6");

  const textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
  const css = `text-shadow: ${textShadow};`;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-6">
        <div className="flex items-center justify-center p-12 rounded-2xl bg-slate-950 border border-border min-h-[200px]">
          <span
            style={{ textShadow }}
            className="text-5xl sm:text-6xl font-black text-white tracking-widest transition-all"
          >
            {text}
          </span>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Display Text</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">X Offset ({offsetX}px)</Label>
            <Slider value={[offsetX]} min={-25} max={25} step={1} onValueChange={(v) => setOffsetX(v[0])} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Y Offset ({offsetY}px)</Label>
            <Slider value={[offsetY]} min={-25} max={25} step={1} onValueChange={(v) => setOffsetY(v[0])} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Blur Radius ({blur}px)</Label>
            <Slider value={[blur]} min={0} max={40} step={1} onValueChange={(v) => setBlur(v[0])} />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">CSS Property</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(css)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs text-teal-400">
            {css}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Color Palette Generator
export function ColorPaletteGeneratorTool() {
  const [palette, setPalette] = React.useState<string[]>([
    "#0f172a",
    "#1e293b",
    "#14b8a6",
    "#06b6d4",
    "#f43f5e",
  ]);

  const generateRandom = () => {
    const letters = "0123456789ABCDEF";
    const colors: string[] = [];
    for (let i = 0; i < 5; i++) {
      let col = "#";
      for (let j = 0; j < 6; j++) {
        col += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(col);
    }
    setPalette(colors);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 rounded-2xl overflow-hidden border border-border p-2 bg-muted/20">
          {palette.map((col, idx) => (
            <div
              key={idx}
              className="h-36 rounded-xl flex flex-col justify-end p-3 transition-transform hover:scale-[1.02] cursor-pointer shadow-md"
              style={{ backgroundColor: col }}
              onClick={() => navigator.clipboard.writeText(col)}
              title="Click to copy HEX"
            >
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/60 text-white w-fit backdrop-blur-sm">
                {col}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={generateRandom} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white gap-2">
            <RefreshCw className="w-4 h-4" /> Generate New Palette
          </Button>
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(palette.join(", "))}
            className="text-xs gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copy All HEX Codes
          </Button>
        </div>
      </div>
    </div>
  );
}

// 5. Aspect Ratio Calculator
export function AspectRatioCalculatorTool() {
  const [ratio, setRatio] = React.useState<"16:9" | "4:3" | "1:1" | "21:9">("16:9");
  const [width, setWidth] = React.useState<number>(1920);
  const [height, setHeight] = React.useState<number>(1080);

  const RATIOS: Record<string, { w: number; h: number }> = {
    "16:9": { w: 16, h: 9 },
    "4:3": { w: 4, h: 3 },
    "1:1": { w: 1, h: 1 },
    "21:9": { w: 21, h: 9 },
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    const r = RATIOS[ratio];
    setHeight(Math.round((w * r.h) / r.w));
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    const r = RATIOS[ratio];
    setWidth(Math.round((h * r.w) / r.h));
  };

  const handleRatioSelect = (newRatio: "16:9" | "4:3" | "1:1" | "21:9") => {
    setRatio(newRatio);
    const r = RATIOS[newRatio];
    setHeight(Math.round((width * r.h) / r.w));
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Aspect Ratio Presets</Label>
          <div className="flex flex-wrap gap-2">
            {(["16:9", "4:3", "1:1", "21:9"] as const).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={ratio === r ? "default" : "outline"}
                onClick={() => handleRatioSelect(r)}
                className={ratio === r ? "bg-teal-600 text-white" : "text-xs"}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Width (px)</Label>
            <Input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Height (px)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between text-xs">
          <span>CSS Declaration:</span>
          <code className="text-teal-400 font-mono font-bold">aspect-ratio: {ratio.replace(":", " / ")};</code>
        </div>
      </div>
    </div>
  );
}