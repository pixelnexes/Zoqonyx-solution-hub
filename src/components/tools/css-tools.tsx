"use client";

import * as React from "react";
import { Copy, Check, RefreshCw, Layers, Sparkles, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- 1. Border Radius Generator ---
export function BorderRadiusGeneratorTool() {
  const [tl, setTl] = React.useState(30);
  const [tr, setTr] = React.useState(70);
  const [br, setBr] = React.useState(70);
  const [bl, setBl] = React.useState(30);
  const [copied, setCopied] = React.useState(false);

  const radiusValue = `${tl}% ${100 - tl}% ${br}% ${100 - br}% / ${100 - tr}% ${tr}% ${100 - bl}% ${bl}%`;
  const cssCode = `border-radius: ${radiusValue};`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Visual Canvas Box */}
      <div className="p-12 rounded-2xl bg-card border border-border/80 flex items-center justify-center min-h-[340px]">
        <div
          className="w-56 h-56 brand-gradient-bg shadow-2xl transition-all duration-300 flex items-center justify-center text-white font-heading font-bold text-sm tracking-wide"
          style={{ borderRadius: radiusValue }}
        >
          Zoqonyx Shape
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Top-Left Corner</span>
            <span className="font-mono text-brand-cyan">{tl}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={tl}
            onChange={(e) => setTl(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Top-Right Corner</span>
            <span className="font-mono text-brand-cyan">{tr}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={tr}
            onChange={(e) => setTr(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Bottom-Right Corner</span>
            <span className="font-mono text-brand-cyan">{br}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={br}
            onChange={(e) => setBr(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Bottom-Left Corner</span>
            <span className="font-mono text-brand-cyan">{bl}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={bl}
            onChange={(e) => setBl(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Code Export */}
      <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-4">
        <code className="text-xs sm:text-sm font-mono text-foreground font-semibold truncate">
          {cssCode}
        </code>
        <Button onClick={copyCode} variant="gradient" size="sm" className="gap-1.5 shrink-0">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy CSS"}</span>
        </Button>
      </div>
    </div>
  );
}

// --- 2. Box Shadow Generator ---
export function BoxShadowGeneratorTool() {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(15);
  const [blur, setBlur] = React.useState(30);
  const [spread, setSpread] = React.useState(-5);
  const [opacity, setOpacity] = React.useState(25);
  const [color, setColor] = React.useState("#06B6D4");
  const [inset, setInset] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Convert hex + opacity to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${(alpha / 100).toFixed(2)})`;
  };

  const shadowString = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
  const cssCode = `box-shadow: ${shadowString};`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Shadow Preview */}
      <div className="p-16 rounded-2xl bg-card border border-border/80 flex items-center justify-center min-h-[300px]">
        <div
          className="w-48 h-48 rounded-2xl bg-background border border-border flex items-center justify-center font-heading font-bold text-sm text-foreground transition-all duration-200"
          style={{ boxShadow: shadowString }}
        >
          Shadow Preview
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>X Offset</span>
            <span className="font-mono text-brand-cyan">{x}px</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Y Offset</span>
            <span className="font-mono text-brand-cyan">{y}px</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Blur Radius</span>
            <span className="font-mono text-brand-cyan">{blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Spread Radius</span>
            <span className="font-mono text-brand-cyan">{spread}px</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={spread}
            onChange={(e) => setSpread(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Shadow Opacity</span>
            <span className="font-mono text-brand-cyan">{opacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded border-0 cursor-pointer"
            />
            <span className="text-xs font-semibold uppercase">{color}</span>
          </div>
          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={inset}
              onChange={(e) => setInset(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            <span>Inset</span>
          </label>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-4">
        <code className="text-xs sm:text-sm font-mono text-foreground font-semibold truncate">
          {cssCode}
        </code>
        <Button onClick={copyCode} variant="gradient" size="sm" className="gap-1.5 shrink-0">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy CSS"}</span>
        </Button>
      </div>
    </div>
  );
}

// --- 3. CSS Gradient Generator ---
export function CssGradientGeneratorTool() {
  const [type, setType] = React.useState<"linear" | "radial">("linear");
  const [angle, setAngle] = React.useState(135);
  const [color1, setColor1] = React.useState("#06B6D4");
  const [color2, setColor2] = React.useState("#7C3AED");
  const [copied, setCopied] = React.useState(false);

  const gradientString =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`
      : `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`;

  const cssCode = `background: ${gradientString};`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div
        className="h-64 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center"
        style={{ background: gradientString }}
      >
        <span className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md text-white font-heading font-bold text-sm tracking-wide">
          Interactive Gradient Preview
        </span>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={type === "linear" ? "gradient" : "outline"}
              size="sm"
              onClick={() => setType("linear")}
            >
              Linear
            </Button>
            <Button
              variant={type === "radial" ? "gradient" : "outline"}
              size="sm"
              onClick={() => setType("radial")}
            >
              Radial
            </Button>
          </div>

          {type === "linear" && (
            <div className="flex items-center gap-3 w-48">
              <span className="text-xs font-semibold text-muted-foreground">Angle: {angle}°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-10 h-10 rounded border-0 cursor-pointer"
            />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Start Color</p>
              <p className="font-mono text-sm font-bold uppercase">{color1}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-10 h-10 rounded border-0 cursor-pointer"
            />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">End Color</p>
              <p className="font-mono text-sm font-bold uppercase">{color2}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-4">
        <code className="text-xs sm:text-sm font-mono text-foreground font-semibold truncate">
          {cssCode}
        </code>
        <Button onClick={copyCode} variant="gradient" size="sm" className="gap-1.5 shrink-0">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy CSS"}</span>
        </Button>
      </div>
    </div>
  );
}

// --- 4. Button Generator ---
export function ButtonGeneratorTool() {
  const [text, setText] = React.useState("Click Me Now");
  const [paddingX, setPaddingX] = React.useState(24);
  const [paddingY, setPaddingY] = React.useState(12);
  const [borderRadius, setBorderRadius] = React.useState(8);
  const [fontSize, setFontSize] = React.useState(14);
  const [bg, setBg] = React.useState("#1E3A8A");
  const [textColor, setTextColor] = React.useState("#FFFFFF");
  const [copied, setCopied] = React.useState(false);

  const cssCode = `padding: ${paddingY}px ${paddingX}px;
border-radius: ${borderRadius}px;
font-size: ${fontSize}px;
background-color: ${bg};
color: ${textColor};
border: none;
cursor: pointer;
font-weight: 600;
transition: all 0.2s ease;`;

  const copyCss = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="p-16 rounded-2xl bg-card border border-border/80 flex items-center justify-center min-h-[220px]">
        <button
          style={{
            padding: `${paddingY}px ${paddingX}px`,
            borderRadius: `${borderRadius}px`,
            fontSize: `${fontSize}px`,
            backgroundColor: bg,
            color: textColor,
          }}
          className="font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          {text}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Button Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Horizontal Padding</span>
            <span className="font-mono text-brand-cyan">{paddingX}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="60"
            value={paddingX}
            onChange={(e) => setPaddingX(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Vertical Padding</span>
            <span className="font-mono text-brand-cyan">{paddingY}px</span>
          </div>
          <input
            type="range"
            min="4"
            max="30"
            value={paddingY}
            onChange={(e) => setPaddingY(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Border Radius</span>
            <span className="font-mono text-brand-cyan">{borderRadius}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3 pt-3">
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            className="w-8 h-8 rounded border-0 cursor-pointer"
          />
          <span className="text-xs font-semibold">Background Color</span>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-8 h-8 rounded border-0 cursor-pointer"
          />
          <span className="text-xs font-semibold">Text Color</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-4">
        <code className="text-xs font-mono text-foreground font-semibold truncate">
          {cssCode.replace(/\n/g, " ")}
        </code>
        <Button onClick={copyCss} variant="gradient" size="sm" className="gap-1.5 shrink-0">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy CSS"}</span>
        </Button>
      </div>
    </div>
  );
}

// --- 5. Flexbox Playground ---
export function FlexboxPlaygroundTool() {
  const [direction, setDirection] = React.useState<"row" | "column" | "row-reverse" | "column-reverse">("row");
  const [justify, setJustify] = React.useState("center");
  const [align, setAlign] = React.useState("center");
  const [gap, setGap] = React.useState(16);
  const [items, setItems] = React.useState([1, 2, 3, 4]);
  const [copied, setCopied] = React.useState(false);

  const cssCode = `display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
gap: ${gap}px;`;

  const copyCss = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Playground Canvas */}
      <div
        className="p-6 rounded-2xl bg-card border border-border/80 min-h-[300px] flex transition-all duration-200"
        style={{
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          gap: `${gap}px`,
        }}
      >
        {items.map((it) => (
          <div
            key={it}
            className="w-16 h-16 rounded-xl brand-gradient-bg text-white font-heading font-black text-lg flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-150"
          >
            {it}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as typeof direction)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium"
          >
            <option value="row">row</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column">column</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Justify Content</label>
          <select
            value={justify}
            onChange={(e) => setJustify(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium"
          >
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
            <option value="space-evenly">space-evenly</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Align Items</label>
          <select
            value={align}
            onChange={(e) => setAlign(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium"
          >
            <option value="stretch">stretch</option>
            <option value="center">center</option>
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
          </select>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Gap ({gap}px)</span>
          </div>
          <input
            type="range"
            min="0"
            max="48"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer pt-2"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setItems((prev) => [...prev, prev.length + 1])}
          >
            + Add Item
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setItems((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))}
          >
            - Remove Item
          </Button>
        </div>

        <Button onClick={copyCss} variant="gradient" size="sm" className="gap-1.5">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Flexbox CSS"}</span>
        </Button>
      </div>
    </div>
  );
}

// --- 6. Glassmorphism Generator ---
export function GlassmorphismGeneratorTool() {
  const [blur, setBlur] = React.useState(16);
  const [opacity, setOpacity] = React.useState(20);
  const [borderOpacity, setBorderOpacity] = React.useState(30);
  const [copied, setCopied] = React.useState(false);

  const cssCode = `background: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});
border-radius: 16px;`;

  const copyCss = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Background with floating orbs for glass demo */}
      <div className="relative h-72 rounded-2xl overflow-hidden brand-gradient-bg flex items-center justify-center p-6">
        <div className="absolute top-4 left-8 w-24 h-24 rounded-full bg-amber-400 blur-lg opacity-80 animate-pulse" />
        <div className="absolute bottom-6 right-10 w-32 h-32 rounded-full bg-emerald-400 blur-xl opacity-70" />

        {/* Glass Card */}
        <div
          className="relative z-10 p-8 max-w-sm w-full shadow-2xl text-white space-y-3"
          style={{
            background: `rgba(255, 255, 255, ${opacity / 100})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
            borderRadius: "16px",
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-200" />
            <h4 className="font-heading font-bold text-lg">Frosted Glass</h4>
          </div>
          <p className="text-xs text-white/90 leading-relaxed">
            Modern UI glassmorphic card with dynamic backdrop-filter blur and subtle borders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Backdrop Blur</span>
            <span className="font-mono text-brand-cyan">{blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Glass Opacity</span>
            <span className="font-mono text-brand-cyan">{opacity}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="80"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Border Opacity</span>
            <span className="font-mono text-brand-cyan">{borderOpacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={borderOpacity}
            onChange={(e) => setBorderOpacity(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-4">
        <code className="text-xs font-mono text-foreground font-semibold truncate">
          {cssCode.replace(/\n/g, " ")}
        </code>
        <Button onClick={copyCss} variant="gradient" size="sm" className="gap-1.5 shrink-0">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Glass CSS"}</span>
        </Button>
      </div>
    </div>
  );
}

// --- 7. CSS Grid Generator ---
export function CssGridGeneratorTool() {
  const [cols, setCols] = React.useState(3);
  const [rows, setRows] = React.useState(3);
  const [gap, setGap] = React.useState(16);
  const [copied, setCopied] = React.useState(false);

  const cssCode = `display: grid;
grid-template-columns: repeat(${cols}, minmax(0, 1fr));
grid-template-rows: repeat(${rows}, minmax(0, 1fr));
gap: ${gap}px;`;

  const totalCells = cols * rows;

  const copy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Visual Grid Canvas */}
      <div
        className="p-6 rounded-2xl bg-card border border-border/80 min-h-[320px] transition-all"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-brand-purple/10 flex items-center justify-center p-4 font-mono font-bold text-sm text-foreground shadow-sm transition-transform hover:scale-105"
          >
            Cell {idx + 1}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Columns: {cols}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer pt-2"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Rows: {rows}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer pt-2"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Gap: {gap}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer pt-2"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-4">
        <code className="text-xs font-mono text-foreground font-semibold truncate">
          {cssCode.replace(/\n/g, " ")}
        </code>
        <Button onClick={copy} variant="gradient" size="sm" className="gap-1.5 shrink-0">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Grid CSS"}</span>
        </Button>
      </div>
    </div>
  );
}

