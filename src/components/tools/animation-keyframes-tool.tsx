"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2, Play, Sparkles } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

const PRESETS: Record<string, string> = {
  bounce: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25px); }
}`,
  pulse: `@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
}`,
  shake: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
}`,
  spin: `@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
  flip: `@keyframes flip {
  0% { transform: perspective(400px) rotateY(0); }
  100% { transform: perspective(400px) rotateY(360deg); }
}`,
  fadeIn: `@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}`,
};

export function AnimationKeyframesTool() {
  const [preset, setPreset] = React.useState<string>("bounce");
  const [duration, setDuration] = React.useState<number>(1.2);
  const [timing, setTiming] = React.useState<string>("ease-in-out");
  const [infinite, setInfinite] = React.useState<boolean>(true);
  const [copied, setCopied] = React.useState(false);

  const keyframeCode = PRESETS[preset] || PRESETS.bounce;
  const animationRule = `animation: ${preset} ${duration}s ${timing} ${infinite ? "infinite" : "1"};`;
  const fullCss = `${keyframeCode}\n\n.animated-element {\n  ${animationRule}\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addSessionHistory({
      toolSlug: "animation-keyframes-generator",
      toolName: "Animation Keyframes Generator",
      action: "Generated",
      summary: `Generated ${preset} CSS keyframe animation`,
    });
  };

  return (
    <div className="space-y-6">
      <style>{keyframeCode}</style>

      <div className="p-6 rounded-xl border border-border bg-card space-y-6">
        {/* Live Preview Box */}
        <div className="h-56 rounded-xl border border-border bg-muted/20 flex items-center justify-center relative overflow-hidden">
          <div
            className="w-20 h-20 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-lg"
            style={{
              animation: `${preset} ${duration}s ${timing} ${infinite ? "infinite" : "1"}`,
            }}
          >
            Preview
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Animation Style</Label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-border bg-background"
            >
              <option value="bounce">Bounce</option>
              <option value="pulse">Pulse</option>
              <option value="shake">Shake</option>
              <option value="spin">Spin</option>
              <option value="flip">3D Flip</option>
              <option value="fadeIn">Fade In & Up</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Timing Function</Label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-border bg-background"
            >
              <option value="ease">Ease</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
              <option value="linear">Linear</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-semibold">Duration</Label>
              <span className="font-mono text-teal-400 font-semibold">{duration}s</span>
            </div>
            <Slider
              value={[duration * 10]}
              min={2}
              max={50}
              step={1}
              onValueChange={(val) => setDuration(val[0] / 10)}
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <Button
              type="button"
              variant={infinite ? "default" : "outline"}
              onClick={() => setInfinite(!infinite)}
              className={`h-9 text-xs ${infinite ? "bg-teal-600 text-white" : ""}`}
            >
              Loop: {infinite ? "Infinite" : "Once"}
            </Button>
          </div>
        </div>

        {/* Code Output */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Generated CSS Output</span>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy CSS"}</span>
            </Button>
          </div>
          <pre className="p-4 rounded-lg bg-muted/40 border border-border text-xs font-mono overflow-x-auto text-foreground">
            {fullCss}
          </pre>
        </div>
      </div>
    </div>
  );
}
