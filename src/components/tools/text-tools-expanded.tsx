"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Type,
  Copy,
  CheckCircle2,
  Trash2,
  Volume2,
  Mic,
  MicOff,
  ArrowUpDown,
  RefreshCw,
  Sparkles,
  Table as TableIcon,
  AlignLeft,
  BookOpen,
} from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

// 1. Character & Word Counter
export function CharacterCounterTool() {
  const [text, setText] = React.useState<string>(
    "Zoqonyx provides 100% free, competitor-grade online tools directly in your browser."
  );

  const charCount = text.length;
  const charNoSpaces = text.replace(/\s+/g, "").length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const speakingTimeMinutes = Math.ceil(wordCount / 130);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-teal-400">{charCount}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold">Characters</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-teal-400">{wordCount}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold">Words</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-teal-400">{sentenceCount}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold">Sentences</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-teal-400">{readingTimeMinutes} min</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold">Reading Time</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Type or Paste Text</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
          <span>Characters (no spaces): <strong className="text-foreground">{charNoSpaces}</strong></span>
          <span>Paragraphs: <strong className="text-foreground">{paragraphCount}</strong></span>
          <span>Speaking time: <strong className="text-foreground">~{speakingTimeMinutes} min</strong></span>
        </div>
      </div>
    </div>
  );
}

// 2. Find and Replace
export function FindAndReplaceTool() {
  const [text, setText] = React.useState<string>(
    "The quick brown fox jumps over the lazy dog. Every fox is clever."
  );
  const [search, setSearch] = React.useState<string>("fox");
  const [replace, setReplace] = React.useState<string>("cat");
  const [caseSensitive, setCaseSensitive] = React.useState(false);

  const handleReplace = () => {
    if (!search) return;
    const flags = caseSensitive ? "g" : "gi";
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    const updated = text.replace(regex, replace);
    setText(updated);
    addSessionHistory({
      toolSlug: "find-and-replace",
      toolName: "Find and Replace",
      action: "Replaced",
      summary: `Replaced "${search}" with "${replace}"`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Source Text</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Find text</Label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Replace with</Label>
            <Input value={replace} onChange={(e) => setReplace(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-border text-teal-600 focus:ring-teal-500"
            />
            <span>Case Sensitive Matching</span>
          </label>
          <Button onClick={handleReplace} className="bg-teal-600 hover:bg-teal-500 text-white">
            Replace All Occurrences
          </Button>
        </div>
      </div>
    </div>
  );
}

// 3. Remove Extra Spaces
export function RemoveExtraSpacesTool() {
  const [text, setText] = React.useState<string>(
    "   This    text      has     irregular \n\n\n  spacing    and  blank  lines.   "
  );

  const cleanSpaces = () => {
    const cleaned = text
      .split("\n")
      .map((line) => line.trim().replace(/\s+/g, " "))
      .filter((line) => line.length > 0)
      .join("\n");
    setText(cleaned);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Text with Excess Whitespace</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
          />
        </div>

        <Button onClick={cleanSpaces} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
          Remove Multiple Spaces & Blank Lines
        </Button>
      </div>
    </div>
  );
}

// 4. Reverse Text Tool
export function ReverseTextTool() {
  const [text, setText] = React.useState<string>("Hello World from Zoqonyx");
  const [mode, setMode] = React.useState<"chars" | "words" | "lines">("chars");

  const getReversed = () => {
    if (mode === "chars") return text.split("").reverse().join("");
    if (mode === "words") return text.split(" ").reverse().join(" ");
    if (mode === "lines") return text.split("\n").reverse().join("\n");
    return text;
  };

  const reversed = getReversed();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Original Text</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="flex gap-2">
          {(["chars", "words", "lines"] as const).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? "default" : "outline"}
              onClick={() => setMode(m)}
              className={mode === m ? "bg-teal-600 text-white capitalize" : "capitalize text-xs"}
            >
              Reverse {m}
            </Button>
          ))}
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Reversed Result</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(reversed)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <textarea
            readOnly
            value={reversed}
            rows={4}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/40 font-mono text-teal-400"
          />
        </div>
      </div>
    </div>
  );
}

// 5. Slug Generator
export function SlugGeneratorTool() {
  const [headline, setHeadline] = React.useState<string>(
    "How to Build High-Performance Online Tools in 2026! (Top 10 Secrets)"
  );
  const [separator, setSeparator] = React.useState<"-" | "_">("-");

  const generateSlug = (str: string, sep: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, sep)
      .replace(/^-+|-+$/g, "");
  };

  const slug = generateSlug(headline, separator);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Article Title or Headline</Label>
          <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-xs font-semibold">Delimiter</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={separator === "-" ? "default" : "outline"}
              onClick={() => setSeparator("-")}
              className={separator === "-" ? "bg-teal-600 text-white" : ""}
            >
              Hyphen (-)
            </Button>
            <Button
              size="sm"
              variant={separator === "_" ? "default" : "outline"}
              onClick={() => setSeparator("_")}
              className={separator === "_" ? "bg-teal-600 text-white" : ""}
            >
              Underscore (_)
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Clean SEO Slug</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(slug)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-sm text-teal-400 break-all">
            {slug}
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Markdown Table Generator
export function MarkdownTableGeneratorTool() {
  const [rows, setRows] = React.useState<number>(3);
  const [cols, setCols] = React.useState<number>(3);
  const [tableData, setTableData] = React.useState<string[][]>([
    ["Feature", "Zoqonyx", "Others"],
    ["100% Free", "Yes (No Ads)", "Paid"],
    ["No Login", "Instant", "Required"],
  ]);

  const updateCell = (r: number, c: number, val: string) => {
    const copy = tableData.map((row) => [...row]);
    copy[r][c] = val;
    setTableData(copy);
  };

  const toMarkdown = () => {
    if (tableData.length === 0) return "";
    const headers = "| " + tableData[0].join(" | ") + " |";
    const divider = "| " + tableData[0].map(() => "---").join(" | ") + " |";
    const body = tableData
      .slice(1)
      .map((row) => "| " + row.join(" | ") + " |")
      .join("\n");
    return `${headers}\n${divider}\n${body}`;
  };

  const md = toMarkdown();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Table Editor</Label>
          <span className="text-xs text-muted-foreground">{tableData.length} Rows x {tableData[0]?.length} Cols</span>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-xs">
            <tbody>
              {tableData.map((row, r) => (
                <tr key={r} className={r === 0 ? "bg-muted/50 font-bold border-b border-border" : "border-b border-border/50"}>
                  {row.map((cell, c) => (
                    <td key={c} className="p-1 border-r border-border/40">
                      <input
                        value={cell}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        className="w-full p-1.5 bg-transparent outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Markdown Code</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(md)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <pre className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs overflow-x-auto">
            {md}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 7. Text to Speech
export function TextToSpeechTool() {
  const [text, setText] = React.useState<string>(
    "Welcome to Zoqonyx Solution Hub. Fast, private, and 100% free browser tools."
  );
  const [rate, setRate] = React.useState<number>(1);
  const [pitch, setPitch] = React.useState<number>(1);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);

    addSessionHistory({
      toolSlug: "text-to-speech",
      toolName: "Text to Speech",
      action: "Played Audio",
      summary: `Synthesized voice playback (${text.length} chars)`,
    });
  };

  const stop = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Enter Text to Speak</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Speed Rate ({rate}x)</Label>
            <Slider value={[rate]} min={0.5} max={2} step={0.1} onValueChange={(v) => setRate(v[0])} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Pitch ({pitch})</Label>
            <Slider value={[pitch]} min={0.5} max={1.5} step={0.1} onValueChange={(v) => setPitch(v[0])} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={speak}
            disabled={!text || isSpeaking}
            className="flex-1 bg-teal-600 hover:bg-teal-500 text-white gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? "Speaking..." : "Play Voice"}</span>
          </Button>
          <Button onClick={stop} variant="outline" className="flex-1">
            Stop Audio
          </Button>
        </div>
      </div>
    </div>
  );
}

// 8. Speech to Text
export function SpeechToTextTool() {
  const [transcript, setTranscript] = React.useState<string>("");
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  const toggleListen = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let current = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript((prev) => prev + " " + current);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Live Dictation / Speech Recognition</Label>
          <Button
            onClick={toggleListen}
            className={isListening ? "bg-rose-600 hover:bg-rose-500 text-white gap-2 animate-pulse" : "bg-teal-600 hover:bg-teal-500 text-white gap-2"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? "Stop Recording" : "Start Listening"}</span>
          </Button>
        </div>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Click Start Listening and speak into your microphone..."
          rows={6}
          className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
        />

        {transcript && (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(transcript)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTranscript("")}
              className="text-xs text-destructive"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// 9. List Sorter
export function ListSorterTool() {
  const [list, setList] = React.useState<string>(
    "Orange\nApple\nBanana\nMango\nPineapple\nGrape"
  );

  const sortAZ = () => setList(list.split("\n").sort((a, b) => a.localeCompare(b)).join("\n"));
  const sortZA = () => setList(list.split("\n").sort((a, b) => b.localeCompare(a)).join("\n"));
  const sortLen = () => setList(list.split("\n").sort((a, b) => a.length - b.length).join("\n"));
  const shuffle = () => setList(list.split("\n").sort(() => Math.random() - 0.5).join("\n"));

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Input List (one item per line)</Label>
          <textarea
            value={list}
            onChange={(e) => setList(e.target.value)}
            rows={8}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button onClick={sortAZ} variant="outline" size="sm" className="text-xs">
            A to Z
          </Button>
          <Button onClick={sortZA} variant="outline" size="sm" className="text-xs">
            Z to A
          </Button>
          <Button onClick={sortLen} variant="outline" size="sm" className="text-xs">
            By Length
          </Button>
          <Button onClick={shuffle} variant="outline" size="sm" className="text-xs">
            Random Shuffle
          </Button>
        </div>
      </div>
    </div>
  );
}

// 10. Duplicate Line Remover
export function DuplicateLineRemoverTool() {
  const [text, setText] = React.useState<string>(
    "alpha\nbeta\ngamma\nalpha\ndelta\nbeta"
  );
  const [removedCount, setRemovedCount] = React.useState<number>(0);

  const removeDuplicates = () => {
    const lines = text.split("\n");
    const unique = Array.from(new Set(lines));
    setRemovedCount(lines.length - unique.length);
    setText(unique.join("\n"));
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Lines of Text</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30 font-mono"
          />
        </div>

        <Button onClick={removeDuplicates} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
          Remove Duplicate Lines
        </Button>

        {removedCount > 0 && (
          <p className="text-xs text-teal-400 font-medium text-center">
            Successfully removed {removedCount} duplicate line(s)!
          </p>
        )}
      </div>
    </div>
  );
}

// 11. Random String Generator
export function RandomStringGeneratorTool() {
  const [length, setLength] = React.useState<number>(32);
  const [charset, setCharset] = React.useState<"alphanumeric" | "hex" | "base64">("alphanumeric");
  const [generated, setGenerated] = React.useState<string>("");

  const generate = () => {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (charset === "hex") chars = "0123456789abcdef";
    if (charset === "base64") chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    let res = "";
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGenerated(res);
  };

  React.useEffect(() => {
    generate();
  }, [length, charset]);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">String Length ({length})</Label>
          <Slider value={[length]} min={8} max={128} step={1} onValueChange={(v) => setLength(v[0])} />
        </div>

        <div className="flex gap-2">
          {(["alphanumeric", "hex", "base64"] as const).map((cs) => (
            <Button
              key={cs}
              size="sm"
              variant={charset === cs ? "default" : "outline"}
              onClick={() => setCharset(cs)}
              className={charset === cs ? "bg-teal-600 text-white capitalize" : "capitalize text-xs"}
            >
              {cs}
            </Button>
          ))}
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Generated Secret / Key</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(generated)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs text-teal-400 break-all">
            {generated}
          </div>
        </div>

        <Button onClick={generate} variant="outline" className="w-full gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Generate New String
        </Button>
      </div>
    </div>
  );
}

// 12. Text Statistics & Readability
export function TextStatisticsTool() {
  const [text, setText] = React.useState<string>(
    "Zoqonyx is engineered for peak productivity. Our free web applications run directly inside modern web browsers with high security."
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : "0";
  const avgCharsPerWord = words > 0 ? (chars / words).toFixed(1) : "0";

  // Approximate Flesch Reading Ease
  const fleschScore = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * Number(avgWordsPerSentence) - 40)));

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-xl font-black text-teal-400">{fleschScore}/100</span>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Reading Ease</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-xl font-black text-teal-400">{avgWordsPerSentence}</span>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Words / Sentence</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-xl font-black text-teal-400">{avgCharsPerWord}</span>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Chars / Word</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center">
            <span className="text-xl font-black text-teal-400">{words}</span>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Words</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Text Analysis Content</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
          />
        </div>
      </div>
    </div>
  );
}