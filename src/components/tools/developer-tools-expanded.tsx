"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Code2,
  Copy,
  CheckCircle2,
  Terminal,
  Clock,
  Database,
  Braces,
  Calendar,
  Layers,
  Sparkles,
  Download,
  AlertTriangle,
} from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

// 1. JWT Decoder
export function JwtDecoderTool() {
  const [token, setToken] = React.useState<string>("");
  const [header, setHeader] = React.useState<any>(null);
  const [payload, setPayload] = React.useState<any>(null);
  const [status, setStatus] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  const handleDecode = (val: string) => {
    setToken(val);
    if (!val.trim()) {
      setHeader(null);
      setPayload(null);
      setStatus("");
      return;
    }
    try {
      const parts = val.trim().split(".");
      if (parts.length !== 3) {
        setStatus("Invalid JWT structure (must contain 3 parts separated by dots)");
        setHeader(null);
        setPayload(null);
        return;
      }

      const decodePart = (str: string) => {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(json);
      };

      const h = decodePart(parts[0]);
      const p = decodePart(parts[1]);
      setHeader(h);
      setPayload(p);
      setStatus("Valid Token Decoded");

      addSessionHistory({
        toolSlug: "jwt-decoder",
        toolName: "JWT Decoder",
        action: "Decoded JWT",
        summary: `Inspected JWT claims (algo: ${h.alg || "none"})`,
      });
    } catch (e: any) {
      setStatus("Decoding error: " + e.message);
      setHeader(null);
      setPayload(null);
    }
  };

  const isExpired = payload?.exp ? Date.now() >= payload.exp * 1000 : false;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Paste Encoded JWT Token</Label>
          <textarea
            value={token}
            onChange={(e) => handleDecode(e.target.value)}
            rows={4}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30 break-all"
          />
        </div>

        {status && (
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={status.includes("Valid") ? "text-teal-400" : "text-destructive"}>
              {status}
            </span>
            {payload?.exp && (
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isExpired
                    ? "bg-destructive/10 text-destructive border border-destructive/20"
                    : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                }`}
              >
                {isExpired ? "Token Expired" : "Token Active"}
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-rose-400">Header (Algorithm & Token Type)</Label>
            <pre className="p-3 text-xs font-mono rounded-lg border border-border bg-muted/40 min-h-[140px] overflow-auto">
              {header ? JSON.stringify(header, null, 2) : "// Awaiting input..."}
            </pre>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-purple-400">Payload (Claims & Data)</Label>
            <pre className="p-3 text-xs font-mono rounded-lg border border-border bg-muted/40 min-h-[140px] overflow-auto">
              {payload ? JSON.stringify(payload, null, 2) : "// Awaiting input..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Regular Expression Tester
export function RegexTesterTool() {
  const [pattern, setPattern] = React.useState<string>("(\\w+)@(\\w+\\.\\w+)");
  const [flags, setFlags] = React.useState<string>("g");
  const [testString, setTestString] = React.useState<string>(
    "Contact us at hello@zoqonyx.com or support@zoqonyx.com anytime!"
  );

  const getMatches = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches: string[] = [];
      let match;
      if (!flags.includes("g")) {
        const m = regex.exec(testString);
        return m ? [m[0]] : [];
      }
      while ((match = regex.exec(testString)) !== null) {
        matches.push(match[0]);
        if (regex.lastIndex === match.index) regex.lastIndex++;
      }
      return matches;
    } catch {
      return [];
    }
  };

  const matches = getMatches();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold">Regex Pattern</Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground font-mono text-sm">/</span>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="pl-6 font-mono text-xs"
                placeholder="[a-z0-9]+"
              />
              <span className="absolute right-3 text-muted-foreground font-mono text-sm">/</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Flags (g, i, m)</Label>
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="font-mono text-xs"
              placeholder="g"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Test String</Label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={4}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Matches Found ({matches.length})</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-lg border border-border bg-muted/20">
            {matches.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">No matches found for current pattern.</span>
            ) : (
              matches.map((m, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-teal-500/15 text-teal-400 border border-teal-500/30 text-xs font-mono"
                >
                  {m}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. HTML Beautifier & Minifier
export function HtmlBeautifierMinifierTool() {
  const [input, setInput] = React.useState<string>(
    "<div class=\"container\"><header><h1>Zoqonyx</h1></header><main><p>High quality free tools.</p></main></div>"
  );
  const [output, setOutput] = React.useState<string>("");

  const beautify = () => {
    let tab = "  ";
    let result = "";
    let indent = 0;
    input.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) {
        indent -= 1;
      }
      result += tab.repeat(Math.max(0, indent)) + "<" + element + ">\n";
      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br")) {
        indent += 1;
      }
    });
    const cleaned = result.trim().replace(/^<</, "<").replace(/>>$/, ">");
    setOutput(cleaned);
  };

  const minify = () => {
    const minified = input.replace(/\s+/g, " ").replace(/> </g, "><").trim();
    setOutput(minified);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Input HTML</Label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={beautify} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white">
            Beautify HTML
          </Button>
          <Button onClick={minify} variant="outline" className="flex-1">
            Minify HTML
          </Button>
        </div>

        {output && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Output</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 4. CSS Beautifier & Minifier
export function CssBeautifierMinifierTool() {
  const [input, setInput] = React.useState<string>(
    ".btn{background:#14B8A6;color:#ffffff;padding:12px 24px;border-radius:8px;font-weight:600}"
  );
  const [output, setOutput] = React.useState<string>("");

  const beautify = () => {
    let formatted = input
      .replace(/\s*{\s*/g, " {\n  ")
      .replace(/;\s*/g, ";\n  ")
      .replace(/\s*}\s*/g, "\n}\n\n")
      .replace(/  }/g, "}")
      .trim();
    setOutput(formatted);
  };

  const minify = () => {
    let minified = input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{:;,])\s*/g, "$1")
      .replace(/;}/g, "}")
      .trim();
    setOutput(minified);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Input CSS</Label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={beautify} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white">
            Beautify CSS
          </Button>
          <Button onClick={minify} variant="outline" className="flex-1">
            Minify CSS
          </Button>
        </div>

        {output && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Output</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 5. JavaScript Beautifier & Minifier
export function JsBeautifierMinifierTool() {
  const [input, setInput] = React.useState<string>(
    "function calc(a,b){const res=a*b+10;return res;}"
  );
  const [output, setOutput] = React.useState<string>("");

  const beautify = () => {
    let formatted = input
      .replace(/\{/g, " {\n  ")
      .replace(/;/g, ";\n  ")
      .replace(/\}/g, "\n}\n")
      .replace(/  \}/g, "}")
      .trim();
    setOutput(formatted);
  };

  const minify = () => {
    let minified = input.replace(/\s+/g, " ").replace(/\s*([=+\-*/{}();,:])\s*/g, "$1").trim();
    setOutput(minified);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Input JavaScript</Label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={beautify} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white">
            Beautify JS
          </Button>
          <Button onClick={minify} variant="outline" className="flex-1">
            Minify JS
          </Button>
        </div>

        {output && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Output</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 6. SQL Formatter
export function SqlFormatterTool() {
  const [input, setInput] = React.useState<string>(
    "select id, name, email, created_at from users where active = 1 and status = 'verified' order by created_at desc limit 25;"
  );
  const [output, setOutput] = React.useState<string>("");

  const formatSql = () => {
    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING",
      "LIMIT", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "INSERT INTO",
      "VALUES", "UPDATE", "SET", "DELETE FROM"
    ];
    let res = input;
    keywords.forEach((kw) => {
      const reg = new RegExp(`\\b${kw}\\b`, "gi");
      res = res.replace(reg, kw);
    });

    res = res
      .replace(/\bFROM\b/g, "\nFROM")
      .replace(/\bWHERE\b/g, "\nWHERE")
      .replace(/\bAND\b/g, "\n  AND")
      .replace(/\bOR\b/g, "\n  OR")
      .replace(/\bORDER BY\b/g, "\nORDER BY")
      .replace(/\bGROUP BY\b/g, "\nGROUP BY")
      .replace(/\bLIMIT\b/g, "\nLIMIT")
      .replace(/\bJOIN\b/g, "\nJOIN")
      .trim();

    setOutput(res);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">SQL Query</Label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <Button onClick={formatSql} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
          Format SQL Query
        </Button>

        {output && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Standard Formatted SQL</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 7. XML Formatter
export function XmlFormatterTool() {
  const [input, setInput] = React.useState<string>(
    "<catalog><book id=\"bk101\"><author>Gambardella</author><title>XML Developer's Guide</title><price>44.95</price></book></catalog>"
  );
  const [output, setOutput] = React.useState<string>("");

  const formatXml = () => {
    let formatted = "";
    let indent = 0;
    const tab = "  ";
    input.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) indent--;
      formatted += tab.repeat(Math.max(0, indent)) + "<" + node + ">\n";
      if (node.match(/^<?\w[^>]*[^\/]$/)) indent++;
    });
    setOutput(formatted.trim().replace(/^<</, "<").replace(/>>$/, ">"));
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">XML Input</Label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <Button onClick={formatXml} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
          Format XML
        </Button>

        {output && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Indented XML Output</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 8. Code to Image
export function CodeToImageTool() {
  const [code, setCode] = React.useState<string>(
    "// High performance client-side tools\nexport function solve() {\n  return 'Zoqonyx Solutions';\n}"
  );
  const [title, setTitle] = React.useState<string>("app.ts");
  const cardRef = React.useRef<HTMLDivElement>(null);

  const downloadImage = () => {
    // Generate clean canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 700);
    grad.addColorStop(0, "#0B0F19");
    grad.addColorStop(1, "#111827");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 700);

    // Window card
    ctx.fillStyle = "#1E293B";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(100, 80, 1000, 540, 16);
    ctx.fill();
    ctx.stroke();

    // Mac dots
    ctx.fillStyle = "#EF4444";
    ctx.beginPath();
    ctx.arc(130, 115, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(150, 115, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.arc(170, 115, 6, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.fillStyle = "#94A3B8";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(title, 600, 120);

    // Code lines
    ctx.textAlign = "left";
    ctx.fillStyle = "#14B8A6";
    ctx.font = "20px monospace";
    const lines = code.split("\n");
    lines.forEach((line, i) => {
      ctx.fillText(line, 140, 180 + i * 32);
    });

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "code_snippet.png";
    a.click();

    addSessionHistory({
      toolSlug: "code-to-image",
      toolName: "Code to Image",
      action: "Exported Card",
      summary: `Exported ${lines.length} lines of code to screenshot`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">File Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Code</Label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={6}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        {/* Live Preview Card */}
        <div
          ref={cardRef}
          className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-border shadow-2xl"
        >
          <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-4 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-400 font-sans">{title}</span>
              <div className="w-12" />
            </div>
            <pre className="text-teal-400 overflow-x-auto py-2 leading-relaxed">{code}</pre>
          </div>
        </div>

        <Button onClick={downloadImage} className="w-full bg-teal-600 hover:bg-teal-500 text-white gap-2">
          <Download className="w-4 h-4" /> Download High-Res Screenshot (PNG)
        </Button>
      </div>
    </div>
  );
}

// 9. Timestamp Converter
export function TimestampConverterTool() {
  const [epoch, setEpoch] = React.useState<number>(Math.floor(Date.now() / 1000));
  const [humanDate, setHumanDate] = React.useState<string>("");

  const updateFromEpoch = (val: number) => {
    setEpoch(val);
    const d = new Date(val * 1000);
    setHumanDate(d.toISOString());
  };

  const updateFromDate = (val: string) => {
    setHumanDate(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setEpoch(Math.floor(d.getTime() / 1000));
    }
  };

  const setNow = () => {
    const now = Math.floor(Date.now() / 1000);
    updateFromEpoch(now);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Unix Epoch Timestamp</span>
          <Button size="sm" variant="outline" onClick={setNow} className="text-xs gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-400" /> Set to Now
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Epoch (Seconds)</Label>
          <Input
            type="number"
            value={epoch}
            onChange={(e) => updateFromEpoch(parseInt(e.target.value, 10) || 0)}
            className="font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">UTC Time</span>
            <p className="text-xs font-mono font-medium">{new Date(epoch * 1000).toUTCString()}</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Local Browser Time</span>
            <p className="text-xs font-mono font-medium">{new Date(epoch * 1000).toString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. CSS to Tailwind Converter
export function CssToTailwindTool() {
  const [css, setCss] = React.useState<string>("display: flex;\njustify-content: center;\nalign-items: center;\npadding: 16px;\nbackground-color: #000000;");
  const [tailwind, setTailwind] = React.useState<string>("");

  const convert = () => {
    const lines = css.split(";").map((s) => s.trim()).filter(Boolean);
    const classes: string[] = [];

    lines.forEach((line) => {
      const [prop, val] = line.split(":").map((s) => s?.trim());
      if (!prop || !val) return;

      if (prop === "display") {
        if (val === "flex") classes.push("flex");
        if (val === "grid") classes.push("grid");
        if (val === "none") classes.push("hidden");
        if (val === "block") classes.push("block");
        if (val === "inline-block") classes.push("inline-block");
      } else if (prop === "justify-content") {
        if (val === "center") classes.push("justify-center");
        if (val === "space-between") classes.push("justify-between");
        if (val === "flex-start") classes.push("justify-start");
        if (val === "flex-end") classes.push("justify-end");
      } else if (prop === "align-items") {
        if (val === "center") classes.push("items-center");
        if (val === "flex-start") classes.push("items-start");
        if (val === "flex-end") classes.push("items-end");
      } else if (prop === "padding") {
        if (val === "16px") classes.push("p-4");
        else if (val === "8px") classes.push("p-2");
        else if (val === "24px") classes.push("p-6");
        else classes.push(`p-[${val}]`);
      } else if (prop === "margin") {
        if (val === "16px") classes.push("m-4");
        else if (val === "auto") classes.push("mx-auto");
        else classes.push(`m-[${val}]`);
      } else if (prop === "border-radius") {
        if (val === "8px") classes.push("rounded-lg");
        else if (val === "9999px" || val === "50%") classes.push("rounded-full");
        else classes.push(`rounded-[${val}]`);
      } else {
        classes.push(`[${prop}:${val}]`);
      }
    });

    setTailwind(classes.join(" "));
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">CSS Properties</Label>
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            rows={5}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <Button onClick={convert} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
          Convert to Tailwind CSS Classes
        </Button>

        {tailwind && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Generated Utility Classes</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(tailwind)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <div className="p-3 text-xs font-mono rounded-lg border border-border bg-muted/40 text-teal-400 break-all">
              className="{tailwind}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 11. HTML Entity Encoder / Decoder
export function HtmlEntityEncoderDecoderTool() {
  const [input, setInput] = React.useState<string>("<h1>Zoqonyx & \"Friends\" © 2026</h1>");
  const [output, setOutput] = React.useState<string>("");

  const encode = () => {
    const encoded = input.replace(/[\u00A0-\u9999<>\&"']/gim, (i) => `&#${i.charCodeAt(0)};`);
    setOutput(encoded);
  };

  const decode = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    setOutput(doc.body.textContent || "");
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Input Text</Label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={encode} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white">
            Encode Entities
          </Button>
          <Button onClick={decode} variant="outline" className="flex-1">
            Decode Entities
          </Button>
        </div>

        {output && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Output</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={4}
              className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 12. Cron Expression Generator & Explainer
export function CronExpressionGeneratorTool() {
  const [cron, setCron] = React.useState<string>("0 0 * * *");
  const [explanation, setExplanation] = React.useState<string>("At 12:00 AM (midnight), every day");

  const PRESETS = [
    { label: "Every Minute", val: "* * * * *", desc: "Every minute" },
    { label: "Every Hour", val: "0 * * * *", desc: "At minute 0 of every hour" },
    { label: "Every Day Midnight", val: "0 0 * * *", desc: "At 12:00 AM every single day" },
    { label: "Every Sunday", val: "0 0 * * 0", desc: "At 12:00 AM every Sunday" },
    { label: "Every 15 Minutes", val: "*/15 * * * *", desc: "Every 15 minutes" },
  ];

  const handleSelect = (val: string, desc: string) => {
    setCron(val);
    setExplanation(desc);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Cron Expression (5 parts)</Label>
          <Input
            value={cron}
            onChange={(e) => {
              setCron(e.target.value);
              setExplanation("Custom expression: " + e.target.value);
            }}
            className="font-mono text-base font-bold text-teal-400"
          />
        </div>

        <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">Schedule Plain English Meaning</span>
          <p className="text-sm font-semibold text-foreground">{explanation}</p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Common Presets</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.val}
                size="sm"
                variant={cron === p.val ? "default" : "outline"}
                onClick={() => handleSelect(p.val, p.desc)}
                className={cron === p.val ? "bg-teal-600 text-white" : "text-xs"}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 13. JSON to CSV Converter
export function JsonToCsvTool() {
  const [jsonInput, setJsonInput] = React.useState<string>(
    JSON.stringify(
      [
        { id: 1, name: "Alice", email: "alice@example.com", role: "Developer" },
        { id: 2, name: "Bob", email: "bob@example.com", role: "Designer" },
        { id: 3, name: "Charlie", email: "charlie@example.com", role: "Manager" },
      ],
      null,
      2
    )
  );
  const [csvOutput, setCsvOutput] = React.useState<string>("");

  const convertToCsv = () => {
    try {
      const arr = JSON.parse(jsonInput);
      if (!Array.isArray(arr) || arr.length === 0) {
        alert("Please provide a valid JSON array of objects");
        return;
      }
      const headers = Object.keys(arr[0]);
      const rows = arr.map((obj) =>
        headers.map((header) => JSON.stringify(obj[header] ?? "")).join(",")
      );
      const csv = [headers.join(","), ...rows].join("\n");
      setCsvOutput(csv);
      addSessionHistory({
        toolSlug: "json-to-csv",
        toolName: "JSON to CSV",
        action: "Exported CSV",
        summary: `Converted ${arr.length} rows to CSV format`,
      });
    } catch (e: any) {
      alert("Invalid JSON: " + e?.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">JSON Array of Objects</Label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={8}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <Button onClick={convertToCsv} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
          Convert to CSV
        </Button>

        {csvOutput && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Generated CSV</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(csvOutput)}
                className="text-xs gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <textarea
              readOnly
              value={csvOutput}
              rows={6}
              className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}