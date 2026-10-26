"use client";

import * as React from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Key,
  Layers,
  Sparkles,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR_CHARS = /[il1Lo0O]/g;

const WORD_LIST = [
  "beacon", "cipher", "cobalt", "delta", "dynamo", "falcon", "galaxy", "harbor",
  "impact", "javelin", "karma", "lunar", "matrix", "nebula", "orbit", "pulse",
  "quantum", "radar", "shadow", "titan", "ultra", "vector", "zenith", "aurora",
  "blaze", "comet", "echo", "glacier", "horizon", "ignite", "jupiter", "kinetic",
  "laser", "meteor", "nova", "nexus", "omega", "phoenix", "quasar", "rift",
  "solaris", "vortex", "warp", "apex", "cosmic", "digital", "enigma", "flux",
  "gravity", "helix", "infinity", "kronos", "luminous", "magnet", "neutron"
];

export function PasswordGeneratorTool() {
  const [mode, setMode] = React.useState<"password" | "passphrase">("password");
  
  // Standard Password Config
  const [length, setLength] = React.useState<number>(16);
  const [useUpper, setUseUpper] = React.useState<boolean>(true);
  const [useLower, setUseLower] = React.useState<boolean>(true);
  const [useNumbers, setUseNumbers] = React.useState<boolean>(true);
  const [useSymbols, setUseSymbols] = React.useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = React.useState<boolean>(true);

  // Passphrase Config
  const [wordCount, setWordCount] = React.useState<number>(4);
  const [separator, setSeparator] = React.useState<string>("-");
  const [capitalize, setCapitalize] = React.useState<boolean>(true);
  const [includeNumber, setIncludeNumber] = React.useState<boolean>(true);

  // Bulk Generation State
  const [bulkCount, setBulkCount] = React.useState<number>(1);
  const [generatedList, setGeneratedList] = React.useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Primary generated password
  const primaryPassword = generatedList[0] || "";

  // Cryptographically secure random number generator
  const getRandomInt = (max: number) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  };

  const generateSinglePassword = React.useCallback(() => {
    if (mode === "passphrase") {
      let words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        let w = WORD_LIST[getRandomInt(WORD_LIST.length)];
        if (capitalize) {
          w = w.charAt(0).toUpperCase() + w.slice(1);
        }
        words.push(w);
      }
      let result = words.join(separator);
      if (includeNumber) {
        result += separator + getRandomInt(99).toString().padStart(2, "0");
      }
      return result;
    } else {
      let chars = "";
      if (useLower) chars += LOWERCASE;
      if (useUpper) chars += UPPERCASE;
      if (useNumbers) chars += NUMBERS;
      if (useSymbols) chars += SYMBOLS;

      if (!chars) chars = LOWERCASE; // Fallback

      if (excludeSimilar) {
        chars = chars.replace(SIMILAR_CHARS, "");
      }

      let pass = "";
      for (let i = 0; i < length; i++) {
        pass += chars[getRandomInt(chars.length)];
      }
      return pass;
    }
  }, [mode, length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar, wordCount, separator, capitalize, includeNumber]);

  const generateAll = React.useCallback(() => {
    const list: string[] = [];
    const count = Math.min(Math.max(1, bulkCount), 100);
    for (let i = 0; i < count; i++) {
      list.push(generateSinglePassword());
    }
    setGeneratedList(list);
  }, [bulkCount, generateSinglePassword]);

  React.useEffect(() => {
    generateAll();
  }, [generateAll]);

  // Calculate Entropy (bits)
  const calculateEntropy = (str: string) => {
    let poolSize = 0;
    if (/[a-z]/.test(str)) poolSize += 26;
    if (/[A-Z]/.test(str)) poolSize += 26;
    if (/[0-9]/.test(str)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(str)) poolSize += 32;
    if (poolSize === 0) return 0;
    return Math.round(str.length * Math.log2(poolSize));
  };

  const entropy = calculateEntropy(primaryPassword);

  const getStrengthLabel = (bits: number) => {
    if (bits < 40) return { label: "Weak", color: "text-rose-400", bg: "bg-rose-500" };
    if (bits < 60) return { label: "Moderate", color: "text-amber-400", bg: "bg-amber-500" };
    if (bits < 80) return { label: "Strong", color: "text-teal-400", bg: "bg-teal-500" };
    return { label: "Very Strong (Cryptographic Grade)", color: "text-emerald-400", bg: "bg-emerald-500" };
  };

  const strength = getStrengthLabel(entropy);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadAsFile = (fileType: "txt" | "csv") => {
    let fileContent = "";
    if (fileType === "csv") {
      fileContent = "Index,Password,EntropyBits\n" + generatedList.map((p, i) => `${i + 1},"${p}",${calculateEntropy(p)}`).join("\n");
    } else {
      fileContent = generatedList.join("\n");
    }

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `zoqonyx-passwords-${Date.now()}.${fileType}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Primary Display Card */}
      <div className="p-5 sm:p-6 rounded-xl border border-border/80 bg-card/90 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/40 border border-border">
            <button
              onClick={() => setMode("password")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === "password" ? "bg-teal-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Password Generator
            </button>
            <button
              onClick={() => setMode("passphrase")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === "passphrase" ? "bg-teal-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Passphrase (Diceware)
            </button>
          </div>

          {/* Entropy Metric */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Strength:</span>
            <span className={`font-bold ${strength.color}`}>{strength.label}</span>
            <span className="text-muted-foreground/60">({entropy} bits)</span>
          </div>
        </div>

        {/* Display Box */}
        <div className="relative flex items-center justify-between gap-3 p-4 rounded-xl bg-background/90 border border-border font-mono text-base sm:text-lg break-all select-all text-foreground">
          <span>{primaryPassword || "Generating..."}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(primaryPassword, 0)}
              className="h-9 px-3 text-xs font-mono text-teal-400 hover:bg-teal-500/10 gap-1.5"
            >
              {copiedIndex === 0 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedIndex === 0 ? "Copied!" : "Copy"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateAll}
              className="h-9 w-9 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.bg}`}
            style={{ width: `${Math.min(100, Math.max(15, (entropy / 96) * 100))}%` }}
          />
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Generator Settings */}
        <div className="p-5 rounded-xl border border-border/80 bg-card/90 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            <span>{mode === "password" ? "Password Settings" : "Passphrase Settings"}</span>
          </h3>

          {mode === "password" ? (
            <div className="space-y-4">
              {/* Length Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Password Length</span>
                  <span className="font-mono text-teal-400 font-bold">{length} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              {/* Character Toggles */}
              <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-1">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-muted/20 border border-border/60 hover:border-teal-500/40">
                  <input
                    type="checkbox"
                    checked={useUpper}
                    onChange={(e) => setUseUpper(e.target.checked)}
                    className="accent-teal-500"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-muted/20 border border-border/60 hover:border-teal-500/40">
                  <input
                    type="checkbox"
                    checked={useLower}
                    onChange={(e) => setUseLower(e.target.checked)}
                    className="accent-teal-500"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-muted/20 border border-border/60 hover:border-teal-500/40">
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                    className="accent-teal-500"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-muted/20 border border-border/60 hover:border-teal-500/40">
                  <input
                    type="checkbox"
                    checked={useSymbols}
                    onChange={(e) => setUseSymbols(e.target.checked)}
                    className="accent-teal-500"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground pt-1">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="accent-teal-500"
                />
                <span>Exclude ambiguous characters (i, l, 1, L, o, 0, O)</span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Word Count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Number of Words</span>
                  <span className="font-mono text-teal-400 font-bold">{wordCount} words</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              {/* Separator */}
              <div className="flex items-center justify-between text-xs">
                <span>Word Separator:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  {["-", ".", "_", " "].map((sep) => (
                    <button
                      key={sep}
                      onClick={() => setSeparator(sep)}
                      className={`px-2.5 py-1 rounded border text-xs ${
                        separator === sep ? "bg-teal-600 text-white border-teal-500" : "bg-muted/40 border-border text-muted-foreground"
                      }`}
                    >
                      {sep === " " ? "space" : sep}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-1">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-muted/20 border border-border/60 hover:border-teal-500/40">
                  <input
                    type="checkbox"
                    checked={capitalize}
                    onChange={(e) => setCapitalize(e.target.checked)}
                    className="accent-teal-500"
                  />
                  <span>Capitalize Words</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-muted/20 border border-border/60 hover:border-teal-500/40">
                  <input
                    type="checkbox"
                    checked={includeNumber}
                    onChange={(e) => setIncludeNumber(e.target.checked)}
                    className="accent-teal-500"
                  />
                  <span>Append Random Number</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Generation & Export */}
        <div className="p-5 rounded-xl border border-border/80 bg-card/90 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Bulk Generation & Export</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Generate Multiple Passwords</span>
                <span className="font-mono text-teal-400 font-bold">{bulkCount} {bulkCount === 1 ? "password" : "passwords"}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate up to 50 cryptographically random passwords simultaneously. Download as clean TXT or formatted CSV file for credential management.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadAsFile("txt")}
              className="flex-1 text-xs font-mono gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .TXT</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadAsFile("csv")}
              className="flex-1 text-xs font-mono gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download .CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Results Table (when bulkCount > 1) */}
      {bulkCount > 1 && (
        <div className="p-5 rounded-xl border border-border/80 bg-card/90 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Generated Passwords ({generatedList.length})</span>
            <span>Click password to copy</span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
            {generatedList.map((p, idx) => (
              <div
                key={idx}
                onClick={() => handleCopy(p, idx)}
                className="flex items-center justify-between p-2 rounded-lg bg-background/80 hover:bg-muted/40 border border-border/60 hover:border-teal-500/40 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-muted-foreground/60 w-6 text-right shrink-0">#{idx + 1}</span>
                  <span className="text-foreground font-semibold truncate">{p}</span>
                </div>
                <div className="text-[11px] text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}