"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex: string) {
  let clean = hex.replace("#", "");
  if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
  const num = parseInt(clean, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function ContrastCheckerTool() {
  const [fg, setFg] = React.useState("#ffffff");
  const [bg, setBg] = React.useState("#0b0f19");

  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);

  const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const score = parseFloat(ratio.toFixed(2));

  const aaNormal = score >= 4.5;
  const aaLarge = score >= 3.0;
  const aaaNormal = score >= 7.0;
  const aaaLarge = score >= 4.5;

  const swap = () => {
    const temp = fg;
    setFg(bg);
    setBg(temp);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Foreground / Text Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="w-10 h-10 rounded border border-border bg-transparent cursor-pointer p-0"
              />
              <Input
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Background Color</Label>
              <Button variant="ghost" size="sm" onClick={swap} className="h-6 text-[11px] gap-1 text-muted-foreground">
                <ArrowLeftRight className="w-3 h-3" /> Swap
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-10 h-10 rounded border border-border bg-transparent cursor-pointer p-0"
              />
              <Input
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div
          className="p-8 rounded-xl border border-border/40 shadow-md space-y-3 transition-colors"
          style={{ backgroundColor: bg, color: fg }}
        >
          <h3 className="text-2xl font-black">WCAG Accessibility Contrast Preview</h3>
          <p className="text-sm opacity-90">
            Good contrast ensures your typography is legible for individuals with visual impairments or color vision deficiencies.
          </p>
          <div className="pt-2">
            <span
              className="inline-block px-4 py-2 rounded-lg text-xs font-bold shadow-sm"
              style={{ backgroundColor: fg, color: bg }}
            >
              Interactive Component
            </span>
          </div>
        </div>

        {/* Ratio & Criteria Scoreboard */}
        <div className="p-5 rounded-xl border border-border bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Contrast Ratio</span>
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <span className="text-4xl font-black text-teal-400">{score}</span>
              <span className="text-lg text-muted-foreground font-semibold">: 1</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-lg border border-border bg-card text-center">
              <span className="text-[10px] text-muted-foreground block font-bold">AA Normal Text</span>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-xs">
                {aaNormal ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
                <span className={aaNormal ? "text-emerald-400" : "text-rose-400"}>{aaNormal ? "Pass" : "Fail"}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card text-center">
              <span className="text-[10px] text-muted-foreground block font-bold">AA Large (18pt+)</span>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-xs">
                {aaLarge ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
                <span className={aaLarge ? "text-emerald-400" : "text-rose-400"}>{aaLarge ? "Pass" : "Fail"}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card text-center">
              <span className="text-[10px] text-muted-foreground block font-bold">AAA Normal Text</span>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-xs">
                {aaaNormal ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
                <span className={aaaNormal ? "text-emerald-400" : "text-rose-400"}>{aaaNormal ? "Pass" : "Fail"}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card text-center">
              <span className="text-[10px] text-muted-foreground block font-bold">AAA Large (18pt+)</span>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-xs">
                {aaaLarge ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
                <span className={aaaLarge ? "text-emerald-400" : "text-rose-400"}>{aaaLarge ? "Pass" : "Fail"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
