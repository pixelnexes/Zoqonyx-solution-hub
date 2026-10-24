"use client";

import * as React from "react";
import { Copy, Check, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// --- 1. Case Converter ---
export function CaseConverterTool() {
  const [text, setText] = React.useState("The quick brown fox jumps over the lazy dog");
  const [copied, setCopied] = React.useState<string | null>(null);

  const conversions = [
    { label: "UPPERCASE", value: text.toUpperCase() },
    { label: "lowercase", value: text.toLowerCase() },
    {
      label: "Title Case",
      value: text
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    },
    {
      label: "Sentence case",
      value: text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    },
    {
      label: "camelCase",
      value: text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
    },
    {
      label: "PascalCase",
      value: text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
        .replace(/\s+/g, ""),
    },
    {
      label: "snake_case",
      value: text
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "_"),
    },
    {
      label: "kebab-case",
      value: text
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-"),
    },
  ];

  const copyVal = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Input Text</label>
        <Textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {conversions.map((conv) => (
          <div key={conv.label} className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-cyan">{conv.label}</span>
              <button
                onClick={() => copyVal(conv.value, conv.label)}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1"
              >
                {copied === conv.label ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied === conv.label ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-foreground bg-muted/40 p-2.5 rounded-lg break-all">
              {conv.value || <span className="text-muted-foreground italic">empty</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 2. JSON Formatter & Validator Pro ---
export function JsonFormatterTool() {
  const [input, setInput] = React.useState(
    '{\n  "platform": "Zoqonyx Solution Hub",\n  "status": "online",\n  "privacy": "100% Client-Side",\n  "metrics": {\n    "toolsCount": 35,\n    "averageLatencyMs": 0,\n    "isFreeForever": true\n  },\n  "categories": [\n    "Image Tools",\n    "CSS & Design",\n    "Text & Code",\n    "Developer & SEO",\n    "Calculators"\n  ]\n}'
  );
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [indent, setIndent] = React.useState(2);
  const [copied, setCopied] = React.useState(false);

  const formatJson = React.useCallback(
    (spaces: number) => {
      setError(null);
      try {
        if (!input.trim()) {
          setOutput("");
          return;
        }
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, spaces));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Invalid JSON syntax");
        setOutput("");
      }
    },
    [input]
  );

  const minifyJson = () => {
    setError(null);
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid JSON syntax");
    }
  };

  const loadSample = () => {
    setInput(
      JSON.stringify(
        {
          appName: "Zoqonyx Solution Hub",
          version: "2.0.0",
          author: "Newix Tech Solutions",
          developer: "Zawwar Ahmed",
          features: ["Hardware Accelerated", "Zero Cloud Storage", "Print Ready Exports"],
          config: {
            theme: "system",
            hardwareAcceleration: true,
            maxConcurrentThreads: 4,
          },
        },
        null,
        2
      )
    );
  };

  React.useEffect(() => {
    formatJson(indent);
  }, [input, indent, formatJson]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rawBytes = new Blob([input]).size;
  const outBytes = new Blob([output]).size;
  const savingsPct = rawBytes > 0 && outBytes > 0 ? Math.round(((rawBytes - outBytes) / rawBytes) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={indent === 2 ? "gradient" : "outline"}
            onClick={() => setIndent(2)}
          >
            2 Spaces
          </Button>
          <Button
            size="sm"
            variant={indent === 4 ? "gradient" : "outline"}
            onClick={() => setIndent(4)}
          >
            4 Spaces
          </Button>
          <Button size="sm" variant="outline" onClick={minifyJson}>
            Minify (1 Line)
          </Button>
          <Button size="sm" variant="ghost" onClick={loadSample} className="text-xs text-brand-cyan">
            Load Sample
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setInput("")} className="text-xs text-muted-foreground hover:text-rose-500">
            Clear
          </Button>
        </div>

        {output && (
          <Button onClick={copyOutput} variant="gradient" size="sm" className="gap-1.5 shadow-sm">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Output"}</span>
          </Button>
        )}
      </div>

      {/* Validation Status & Quick Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-card border border-border/80">
        {error ? (
          <div className="text-destructive text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>JSON Error: {error}</span>
          </div>
        ) : (
          <div className="text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Valid JSON Syntax</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span>Input: {rawBytes} B</span>
          <span>•</span>
          <span>Output: {outBytes} B</span>
          {savingsPct > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              (-{savingsPct}%)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Input Raw JSON</label>
          <Textarea
            rows={15}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON string here..."
            className="font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Formatted Output</label>
          <Textarea
            readOnly
            rows={15}
            value={output}
            placeholder="Formatted output will appear here..."
            className="bg-muted/30 font-mono text-xs leading-relaxed text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

// --- 3. Base64 Encode & Decode ---
export function Base64EncodeDecodeTool() {
  const [text, setText] = React.useState("Hello, Zoqonyx Solution Hub!");
  const [mode, setMode] = React.useState<"encode" | "decode">("encode");
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setError(null);
    try {
      if (!text) {
        setResult("");
        return;
      }
      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(text)));
        setResult(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(text.trim())));
        setResult(decoded);
      }
    } catch {
      setError("Invalid format for decoding Base64.");
      setResult("");
    }
  }, [text, mode]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={mode === "encode" ? "gradient" : "outline"}
          onClick={() => setMode("encode")}
        >
          Encode to Base64
        </Button>
        <Button
          size="sm"
          variant={mode === "decode" ? "gradient" : "outline"}
          onClick={() => setMode("decode")}
        >
          Decode from Base64
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">
          {mode === "encode" ? "Text to Encode" : "Base64 String to Decode"}
        </label>
        <Textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-cyan">
            {mode === "encode" ? "Base64 Output" : "Decoded Text Output"}
          </span>
          {result && (
            <Button onClick={copyResult} variant="outline" size="sm" className="gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Output"}</span>
            </Button>
          )}
        </div>
        <textarea
          readOnly
          rows={5}
          value={result}
          className="w-full p-3 rounded-lg border border-border/70 bg-muted/40 font-mono text-xs focus:outline-none"
        />
      </div>
    </div>
  );
}

// --- 4. Markdown <-> HTML Converter ---
export function MarkdownHtmlConverterTool() {
  const [markdown, setMarkdown] = React.useState(
    `# Zoqonyx Solution Hub\n\n- **100% Free**\n- Client-Side Speed\n- Zero Installation\n\nVisit [Zoqonyx](https://zoqonyx.com)`
  );
  const [copied, setCopied] = React.useState(false);

  // Simple markdown to HTML parser
  const parseMarkdownToHtml = (md: string) => {
    return md
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^\- (.*$)/gim, "<li>$1</li>")
      .replace(/\n\n/gim, "<p></p>")
      .replace(/\n/gim, "<br />");
  };

  const htmlOutput = parseMarkdownToHtml(markdown);

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={copyHtml} variant="gradient" size="sm" className="gap-1.5">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied HTML" : "Copy Raw HTML"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Markdown Input</label>
          <Textarea
            rows={12}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">HTML Preview</label>
          <div
            className="p-4 rounded-xl border border-border bg-card min-h-[290px] prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>
      </div>
    </div>
  );
}

// --- 5. UUID Generator ---
export function UuidGeneratorTool() {
  const [uuids, setUuids] = React.useState<string[]>([]);
  const [count, setCount] = React.useState(5);
  const [uppercase, setUppercase] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const generateUuids = React.useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let u = crypto.randomUUID();
      if (uppercase) u = u.toUpperCase();
      list.push(u);
    }
    setUuids(list);
  }, [count, uppercase]);

  React.useEffect(() => {
    generateUuids();
  }, [generateUuids]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Count</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="h-9 px-2.5 rounded-lg border border-border bg-background text-sm font-medium"
            >
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            <span>UPPERCASE</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={generateUuids} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </Button>
          <Button onClick={copyAll} variant="gradient" size="sm" className="gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied All" : "Copy All"}</span>
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
        {uuids.map((u, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 font-mono text-xs text-foreground group"
          >
            <span>{u}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(u);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-brand-cyan hover:underline"
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 6. Password Generator ---
export function PasswordGeneratorTool() {
  const [password, setPassword] = React.useState("");
  const [length, setLength] = React.useState(16);
  const [includeUpper, setIncludeUpper] = React.useState(true);
  const [includeLower, setIncludeLower] = React.useState(true);
  const [includeNumbers, setIncludeNumbers] = React.useState(true);
  const [includeSymbols, setIncludeSymbols] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const generate = React.useCallback(() => {
    let charset = "";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-brand-cyan select-all break-all">
          {password}
        </span>
        <div className="flex items-center gap-2">
          <Button onClick={generate} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate</span>
          </Button>
          <Button onClick={copy} variant="gradient" size="sm" className="gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Password"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1 col-span-full">
          <div className="flex justify-between text-xs font-semibold">
            <span>Length: {length} characters</span>
            <span className="text-emerald-500 font-semibold">
              {length >= 16 ? "Very Strong" : length >= 12 ? "Strong" : "Moderate"}
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer pt-1"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={includeUpper}
            onChange={(e) => setIncludeUpper(e.target.checked)}
            className="rounded accent-cyan-500"
          />
          <span>Uppercase (A-Z)</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={includeLower}
            onChange={(e) => setIncludeLower(e.target.checked)}
            className="rounded accent-cyan-500"
          />
          <span>Lowercase (a-z)</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="rounded accent-cyan-500"
          />
          <span>Numbers (0-9)</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="rounded accent-cyan-500"
          />
          <span>Symbols (!@#$)</span>
        </label>
      </div>
    </div>
  );
}

// --- 7. Word & Character Counter ---
export function WordCounterTool() {
  const [text, setText] = React.useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeMin = Math.ceil(words / 200);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border/80 text-center">
          <p className="text-2xl font-heading font-black text-brand-cyan">{words}</p>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">Words</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/80 text-center">
          <p className="text-2xl font-heading font-black text-brand-purple">{chars}</p>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">Characters</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/80 text-center">
          <p className="text-2xl font-heading font-black text-foreground">{charsNoSpaces}</p>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">No Spaces</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/80 text-center">
          <p className="text-2xl font-heading font-black text-foreground">{sentences}</p>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">Sentences</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/80 text-center">
          <p className="text-2xl font-heading font-black text-foreground">{paragraphs}</p>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">Paragraphs</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/80 text-center">
          <p className="text-2xl font-heading font-black text-emerald-500">~{readingTimeMin} min</p>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">Reading Time</p>
        </div>
      </div>

      <Textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here to calculate real-time word metrics..."
      />
    </div>
  );
}

// --- 8. Hash Generator ---
export function HashGeneratorTool() {
  const [text, setText] = React.useState("Zoqonyx");
  const [hashes, setHashes] = React.useState<Record<string, string>>({});
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function computeHashes() {
      if (!text) {
        setHashes({});
        return;
      }
      const enc = new TextEncoder();
      const data = enc.encode(text);

      const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      const results: Record<string, string> = {};

      for (const algo of algos) {
        const hashBuf = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuf));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        results[algo] = hashHex;
      }

      setHashes(results);
    }
    computeHashes();
  }, [text]);

  const copyHash = (h: string, algo: string) => {
    navigator.clipboard.writeText(h);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Input Text or String</label>
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className="space-y-4">
        {Object.entries(hashes).map(([algo, hash]) => (
          <div key={algo} className="p-4 rounded-xl bg-card border border-border/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-cyan">{algo}</span>
              <button
                onClick={() => copyHash(hash, algo)}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1"
              >
                {copied === algo ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === algo ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-mono text-xs text-foreground bg-muted/40 p-2.5 rounded-lg break-all select-all">
              {hash}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 9. URL Encoder & Decoder ---
export function UrlEncoderDecoderTool() {
  const [input, setInput] = React.useState("https://zoqonyx.com/search?q=free online tools&sort=popular#top");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<"encode" | "decode">("encode");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput("Error: Invalid URI component for decoding");
    }
  }, [input, mode]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={mode === "encode" ? "gradient" : "outline"}
          onClick={() => setMode("encode")}
        >
          URL Encode
        </Button>
        <Button
          size="sm"
          variant={mode === "decode" ? "gradient" : "outline"}
          onClick={() => setMode("decode")}
        >
          URL Decode
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Input</label>
        <Textarea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-cyan">Output Result</span>
          <Button onClick={copy} variant="outline" size="sm" className="gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <textarea
          readOnly
          rows={4}
          value={output}
          className="w-full p-3 rounded-lg border border-border/70 bg-muted/40 font-mono text-xs focus:outline-none"
        />
      </div>
    </div>
  );
}

// --- 10. Lorem Ipsum Generator ---
export function LoremIpsumGeneratorTool() {
  const [count, setCount] = React.useState(3);
  const [type, setType] = React.useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [startWithLorem, setStartWithLorem] = React.useState(true);
  const [result, setResult] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const LOREM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum",
  ];

  const generate = React.useCallback(() => {
    const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

    const generateSentence = (min = 6, max = 14) => {
      const len = Math.floor(Math.random() * (max - min + 1)) + min;
      const words = Array.from({ length: len }, getRandomWord);
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return words.join(" ") + ".";
    };

    const generateParagraph = (sentences = 5) => {
      return Array.from({ length: sentences }, () => generateSentence()).join(" ");
    };

    let text = "";
    if (type === "words") {
      text = Array.from({ length: count }, getRandomWord).join(" ");
    } else if (type === "sentences") {
      text = Array.from({ length: count }, () => generateSentence()).join(" ");
    } else {
      text = Array.from({ length: count }, () => generateParagraph()).join("\n\n");
    }

    if (startWithLorem && !text.toLowerCase().startsWith("lorem ipsum")) {
      text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
    }

    setResult(text);
  }, [count, type, startWithLorem]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Quantity</label>
            <Input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 h-9 text-xs"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            <span>Start with Lorem Ipsum</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={generate} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate</span>
          </Button>
          <Button onClick={copy} variant="gradient" size="sm" className="gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Lorem"}</span>
          </Button>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
        <textarea
          readOnly
          rows={10}
          value={result}
          className="w-full p-4 rounded-xl border border-border/70 bg-muted/30 font-sans text-sm text-foreground focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
}

// --- 11. Diff Checker Pro ---
export function DiffCheckerTool() {
  const [original, setOriginal] = React.useState(
    "function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}"
  );
  const [modified, setModified] = React.useState(
    "function calculateTotal(items, discount = 0) {\n  // Hardware-accelerated reduction with optional discount\n  const subtotal = items.reduce((acc, item) => acc + item.price, 0);\n  return subtotal * (1 - discount);\n}"
  );
  const [viewMode, setViewMode] = React.useState<"split" | "unified">("split");

  const origLines = original.split("\n");
  const modLines = modified.split("\n");
  const maxLines = Math.max(origLines.length, modLines.length);

  let diffCount = 0;
  for (let i = 0; i < maxLines; i++) {
    if ((origLines[i] ?? "") !== (modLines[i] ?? "")) {
      diffCount++;
    }
  }

  const swap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const loadProseSample = () => {
    setOriginal(
      "Zoqonyx Solution Hub is a free online tools platform.\nIt offers client-side image editing and CSS generators.\nVersion 1.0 released in 2026."
    );
    setModified(
      "Zoqonyx Solution Hub is an open, 100% free online tools platform.\nIt delivers hardware-accelerated image editing, pro QR codes, and CSS generators.\nVersion 2.0 released with zero server storage."
    );
  };

  const loadCodeSample = () => {
    setOriginal(
      "function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}"
    );
    setModified(
      "function calculateTotal(items, discount = 0) {\n  // Hardware-accelerated reduction with optional discount\n  const subtotal = items.reduce((acc, item) => acc + item.price, 0);\n  return subtotal * (1 - discount);\n}"
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === "split" ? "gradient" : "outline"}
            onClick={() => setViewMode("split")}
          >
            Side-by-Side
          </Button>
          <Button
            size="sm"
            variant={viewMode === "unified" ? "gradient" : "outline"}
            onClick={() => setViewMode("unified")}
          >
            Unified View
          </Button>
          <Button size="sm" variant="outline" onClick={swap} className="text-xs">
            Swap
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={loadCodeSample} className="text-xs text-brand-cyan">
            Code Sample
          </Button>
          <Button size="sm" variant="ghost" onClick={loadProseSample} className="text-xs text-muted-foreground hover:text-foreground">
            Prose Sample
          </Button>
        </div>
      </div>

      {/* Input Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Original (Old) Text</span>
            <span className="font-mono">{origLines.length} lines</span>
          </div>
          <Textarea
            rows={8}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Modified (New) Text</span>
            <span className="font-mono">{modLines.length} lines</span>
          </div>
          <Textarea
            rows={8}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="font-mono text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Comparison Display */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {viewMode === "split" ? "Side-by-Side Line Comparison" : "Unified Difference View"}
          </h4>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              {diffCount} lines changed
            </span>
            <span>•</span>
            <span className="text-muted-foreground">
              {maxLines - diffCount} unchanged
            </span>
          </div>
        </div>

        {viewMode === "split" ? (
          <div className="rounded-xl border border-border/70 overflow-hidden font-mono text-xs divide-y divide-border/40">
            {Array.from({ length: maxLines }).map((_, idx) => {
              const origLine = origLines[idx] ?? "";
              const modLine = modLines[idx] ?? "";
              const isDiff = origLine !== modLine;

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-2 divide-x divide-border/40 ${
                    isDiff ? "bg-amber-500/10" : "bg-card"
                  }`}
                >
                  <div
                    className={`p-2.5 break-all ${
                      isDiff ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground/60 mr-2 select-none">
                      {idx + 1}
                    </span>
                    {origLine || <span className="opacity-30 italic">empty</span>}
                  </div>

                  <div
                    className={`p-2.5 break-all ${
                      isDiff ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground/60 mr-2 select-none">
                      {idx + 1}
                    </span>
                    {modLine || <span className="opacity-30 italic">empty</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Unified View */
          <div className="rounded-xl border border-border/70 overflow-hidden font-mono text-xs divide-y divide-border/40">
            {Array.from({ length: maxLines }).map((_, idx) => {
              const origLine = origLines[idx] ?? "";
              const modLine = modLines[idx] ?? "";
              const isDiff = origLine !== modLine;

              if (!isDiff) {
                return (
                  <div key={idx} className="p-2.5 bg-card text-muted-foreground flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground/50 w-6 text-right select-none">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground/40 font-bold select-none"> </span>
                    <span className="break-all">{origLine}</span>
                  </div>
                );
              }

              return (
                <React.Fragment key={idx}>
                  {origLine && (
                    <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-3">
                      <span className="text-[10px] text-rose-500/50 w-6 text-right select-none">
                        {idx + 1}
                      </span>
                      <span className="font-bold select-none">-</span>
                      <span className="break-all">{origLine}</span>
                    </div>
                  )}
                  {modLine && (
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
                      <span className="text-[10px] text-emerald-500/50 w-6 text-right select-none">
                        {idx + 1}
                      </span>
                      <span className="font-bold select-none">+</span>
                      <span className="break-all">{modLine}</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

