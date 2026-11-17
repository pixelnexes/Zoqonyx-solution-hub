"use client";

import * as React from "react";
import { ShieldAlert, Download, AlertTriangle, CheckCircle2, ExternalLink, FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addSessionHistory } from "@/lib/session-history";
import { StandardFileUploader } from "@/components/common/standard-file-uploader";
import { MAX_FILES_LIMIT, MAX_COMBINED_SIZE_BYTES } from "@/lib/file-standards";

// Backlink audit for data the user already has: a backlink export (Google
// Search Console, Ahrefs, Semrush, Moz) or a pasted list of linking URLs.
// A browser cannot crawl the web, so this tool never invents links or scores:
// every number shown is counted from the rows you provide.

export interface BacklinkRecord {
  sourceUrl: string;
  sourceHost: string;
  targetUrl: string;
  anchorText: string;
  rel: "dofollow" | "nofollow" | "ugc" | "sponsored" | "unknown";
  isSuspicious: boolean;
  reason?: string;
}

interface AuditSummary {
  totalLinks: number;
  referringDomains: number;
  hasRel: boolean;
  followCount: number;
  nofollowCount: number;
  hasAnchors: boolean;
  suspiciousCount: number;
  topAnchors: { anchor: string; count: number; percent: number }[];
  topDomains: { domain: string; count: number }[];
}

const SUSPICIOUS_TLD = /\.(xyz|top|click|fun|loan|stream|bid|buzz|gq|tk|ml|cf)$/i;
const SPAM_ANCHOR = /(viagra|casino|poker|porn|payday|crypto bonus|replica|escort|betting)/i;

// Minimal CSV/TSV line parser that respects quoted fields.
function parseLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === delimiter && !quoted) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function hostOf(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!url.hostname.includes(".")) return null;
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function findColumn(headers: string[], patterns: RegExp[]): number {
  return headers.findIndex((h) => patterns.some((p) => p.test(h)));
}

function parseRows(text: string): BacklinkRecord[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const first = parseLine(lines[0], delimiter).map((h) => h.toLowerCase());
  const looksLikeHeader = first.some((h) => /url|link|site|domain|anchor|source|referring|page/.test(h)) && !first.some((h) => /^https?:\/\//.test(h));

  let sourceCol = 0;
  let targetCol = -1;
  let anchorCol = -1;
  let relCol = -1;
  let nofollowCol = -1;
  if (looksLikeHeader) {
    sourceCol = findColumn(first, [/source/, /referring page/, /linking page/, /^from/, /^url$/, /^site$/, /referring domain/, /domain/]);
    if (sourceCol < 0) sourceCol = 0;
    targetCol = findColumn(first, [/target/, /^to/, /destination/]);
    anchorCol = findColumn(first, [/anchor/]);
    relCol = findColumn(first, [/^rel$/, /link type/, /follow/]);
    nofollowCol = findColumn(first, [/^nofollow$/]);
  }

  const rows = looksLikeHeader ? lines.slice(1) : lines;
  const records: BacklinkRecord[] = [];

  for (const line of rows) {
    const cells = parseLine(line, delimiter);
    const rawSource = cells[sourceCol] ?? "";
    const host = hostOf(rawSource);
    if (!host) continue;

    const anchorText = anchorCol >= 0 ? cells[anchorCol] ?? "" : "";
    let rel: BacklinkRecord["rel"] = "unknown";
    if (relCol >= 0) {
      const r = (cells[relCol] ?? "").toLowerCase();
      rel = r.includes("nofollow") || r === "true" ? "nofollow" : r.includes("ugc") ? "ugc" : r.includes("spons") ? "sponsored" : r ? "dofollow" : "unknown";
    } else if (nofollowCol >= 0) {
      const r = (cells[nofollowCol] ?? "").toLowerCase();
      rel = r === "true" || r === "1" || r === "yes" ? "nofollow" : r ? "dofollow" : "unknown";
    }

    const reasons: string[] = [];
    if (SUSPICIOUS_TLD.test(host)) reasons.push("Low-reputation top-level domain");
    if (anchorText && SPAM_ANCHOR.test(anchorText)) reasons.push("Spam keyword in anchor text");

    records.push({
      sourceUrl: /^https?:\/\//i.test(rawSource) ? rawSource : `https://${rawSource}`,
      sourceHost: host,
      targetUrl: targetCol >= 0 ? cells[targetCol] ?? "" : "",
      anchorText,
      rel,
      isSuspicious: reasons.length > 0,
      reason: reasons.join("; ") || undefined,
    });
  }
  return records;
}

function summarize(list: BacklinkRecord[]): AuditSummary {
  const domains: Record<string, number> = {};
  const anchors: Record<string, number> = {};
  let follow = 0;
  let nofollow = 0;
  let suspicious = 0;
  let withAnchor = 0;
  let withRel = 0;

  for (const b of list) {
    domains[b.sourceHost] = (domains[b.sourceHost] || 0) + 1;
    if (b.anchorText) {
      withAnchor++;
      const a = b.anchorText.toLowerCase().trim();
      anchors[a] = (anchors[a] || 0) + 1;
    }
    if (b.rel !== "unknown") withRel++;
    if (b.rel === "dofollow") follow++;
    if (b.rel === "nofollow" || b.rel === "ugc" || b.rel === "sponsored") nofollow++;
    if (b.isSuspicious) suspicious++;
  }

  const total = list.length;
  return {
    totalLinks: total,
    referringDomains: Object.keys(domains).length,
    hasRel: withRel > 0,
    followCount: follow,
    nofollowCount: nofollow,
    hasAnchors: withAnchor > 0,
    suspiciousCount: suspicious,
    topAnchors: Object.entries(anchors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([anchor, count]) => ({ anchor, count, percent: Math.round((count / Math.max(1, withAnchor)) * 100) })),
    topDomains: Object.entries(domains)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([domain, count]) => ({ domain, count })),
  };
}

function download(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function BacklinkCheckerTool() {
  const [csvFiles, setCsvFiles] = React.useState<File[]>([]);
  const [pasted, setPasted] = React.useState("");
  const [isParsing, setIsParsing] = React.useState(false);
  const [links, setLinks] = React.useState<BacklinkRecord[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "suspicious" | "dofollow" | "nofollow">("all");

  const summary = React.useMemo(() => (links.length ? summarize(links) : null), [links]);

  const runAudit = async () => {
    setIsParsing(true);
    setError(null);
    const all: BacklinkRecord[] = [];
    for (const file of csvFiles) {
      try {
        all.push(...parseRows(await file.text()));
      } catch {
        setError(`Could not read ${file.name}.`);
      }
    }
    if (pasted.trim()) all.push(...parseRows(pasted));
    setIsParsing(false);

    if (all.length === 0) {
      setLinks([]);
      setError("No linking URLs or domains were found. The first column (or a column named Source, Linking page, URL or Site) must contain the linking page or domain.");
      return;
    }
    setLinks(all);
    addSessionHistory({
      toolSlug: "backlink-checker",
      toolName: "Backlink Checker",
      action: "Audited",
      summary: `Audited ${all.length} backlinks from ${new Set(all.map((l) => l.sourceHost)).size} domains`,
    });
  };

  const shown = links.filter((l) =>
    filter === "all" ? true : filter === "suspicious" ? l.isSuspicious : filter === "dofollow" ? l.rel === "dofollow" : l.rel === "nofollow"
  );

  const exportCsv = () => {
    const rows = [["Source URL", "Source domain", "Target URL", "Anchor text", "Rel", "Flagged", "Reason"]];
    links.forEach((b) =>
      rows.push([b.sourceUrl, b.sourceHost, b.targetUrl, b.anchorText, b.rel, String(b.isSuspicious), b.reason || ""].map((c) => `"${c.replace(/"/g, '""')}"`))
    );
    download("backlink-audit.csv", rows.map((r) => r.join(",")).join("\n"), "text/csv;charset=utf-8");
  };

  const exportDisavow = () => {
    const domains = Array.from(new Set(links.filter((l) => l.isSuspicious).map((l) => l.sourceHost)));
    if (domains.length === 0) return;
    const lines = [
      "# Disavow file draft from Zoqonyx Backlink Checker",
      "# Review every line before uploading to Google's Disavow Links tool.",
      ...domains.map((d) => `domain:${d}`),
    ];
    download("disavow.txt", lines.join("\n"), "text/plain;charset=utf-8");
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-[#F3F5F8] border border-[#D5DCE4] text-[15px] leading-relaxed text-[#14213D]">
        <p className="font-semibold">Where to get your backlink list</p>
        <ul className="mt-1.5 list-disc pl-5 space-y-1 text-[14px] text-[#4A5568]">
          <li>
            <strong className="text-[#14213D]">Google Search Console (free):</strong> Links → Top linking sites → Export, or Links → Export external
            links → Latest links.
          </li>
          <li>
            <strong className="text-[#14213D]">Ahrefs, Semrush or Moz:</strong> export the backlinks report as CSV.
          </li>
          <li>Or paste linking URLs or domains below, one per line.</li>
        </ul>
        <p className="mt-2 text-[13px] text-[#4A5568]">
          Your browser cannot crawl other websites, so this tool only analyses the links you give it. Files are read in your browser and not uploaded.
        </p>
      </div>

      <StandardFileUploader
        files={csvFiles}
        onFilesChange={setCsvFiles}
        maxFiles={MAX_FILES_LIMIT}
        maxCombinedSizeBytes={MAX_COMBINED_SIZE_BYTES}
        acceptedExtensions={[".csv", ".tsv", ".txt"]}
        acceptedTypes={["text/csv", "text/plain", "text/tab-separated-values"]}
        title="Drop backlink exports (CSV or TSV)"
        subtitle="Search Console, Ahrefs, Semrush or Moz exports. Up to 100 files."
        disabled={isParsing}
      />

      <div className="space-y-1.5">
        <Label htmlFor="bl-paste" className="text-sm font-semibold">
          Or paste linking URLs or domains
        </Label>
        <textarea
          id="bl-paste"
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          rows={5}
          placeholder={"https://example.com/blog/post\nnews-site.org"}
          className="w-full p-3 rounded-md border border-[#D5DCE4] bg-white text-sm font-mono"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={runAudit} disabled={isParsing || (csvFiles.length === 0 && !pasted.trim())} className="gap-1.5">
          <RefreshCw className={`w-4 h-4 ${isParsing ? "animate-spin" : ""}`} />
          {isParsing ? "Reading links…" : "Audit backlinks"}
        </Button>
        {error && <p className="text-sm text-rose-700">{error}</p>}
      </div>

      {summary && (
        <div className="space-y-6">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-md border border-[#D5DCE4] bg-white">
              <dt className="text-sm text-[#4A5568]">Backlinks</dt>
              <dd className="text-2xl font-bold">{summary.totalLinks.toLocaleString()}</dd>
            </div>
            <div className="p-3.5 rounded-md border border-[#D5DCE4] bg-white">
              <dt className="text-sm text-[#4A5568]">Referring domains</dt>
              <dd className="text-2xl font-bold">{summary.referringDomains.toLocaleString()}</dd>
            </div>
            <div className="p-3.5 rounded-md border border-[#D5DCE4] bg-white">
              <dt className="text-sm text-[#4A5568]">Follow / nofollow</dt>
              <dd className="text-2xl font-bold">
                {summary.hasRel ? `${summary.followCount} / ${summary.nofollowCount}` : "—"}
              </dd>
              {!summary.hasRel && <p className="text-xs text-[#4A5568]">Not in your file</p>}
            </div>
            <div className="p-3.5 rounded-md border border-[#D5DCE4] bg-white">
              <dt className="text-sm text-[#4A5568]">Flagged links</dt>
              <dd className={`text-2xl font-bold ${summary.suspiciousCount ? "text-rose-700" : ""}`}>{summary.suspiciousCount}</dd>
            </div>
          </dl>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-md border border-[#D5DCE4] bg-white">
              <h3 className="font-semibold">Top referring domains</h3>
              <ul className="mt-2 divide-y divide-[#D5DCE4] text-sm">
                {summary.topDomains.map((d) => (
                  <li key={d.domain} className="flex justify-between py-1.5">
                    <span className="truncate">{d.domain}</span>
                    <span className="tabular-nums text-[#4A5568]">{d.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-md border border-[#D5DCE4] bg-white">
              <h3 className="font-semibold">Top anchor texts</h3>
              {summary.hasAnchors ? (
                <ul className="mt-2 divide-y divide-[#D5DCE4] text-sm">
                  {summary.topAnchors.map((a) => (
                    <li key={a.anchor} className="flex justify-between gap-3 py-1.5">
                      <span className="truncate">{a.anchor}</span>
                      <span className="tabular-nums text-[#4A5568]">
                        {a.count} ({a.percent}%)
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-[#4A5568]">Your file has no anchor text column.</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-md border border-[#D5DCE4] bg-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold">Links ({shown.length})</h3>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="p-1.5 text-sm rounded border border-[#D5DCE4] bg-white"
                  aria-label="Filter links"
                >
                  <option value="all">All links</option>
                  <option value="suspicious">Flagged only</option>
                  <option value="dofollow">Follow only</option>
                  <option value="nofollow">Nofollow only</option>
                </select>
                <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5">
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportDisavow} disabled={!summary.suspiciousCount} className="gap-1.5">
                  <Download className="w-4 h-4" /> Disavow draft
                </Button>
              </div>
            </div>
            <p className="text-xs text-[#4A5568]">
              <ShieldAlert className="inline w-3.5 h-3.5 mr-1" />
              Links are flagged only for a low-reputation domain ending or a spam word in the anchor. Google advises using a disavow file only after a
              manual action for unnatural links.
            </p>
            <div className="border border-[#D5DCE4] rounded overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F3F5F8]">
                  <tr>
                    <th className="p-2.5">Linking page</th>
                    <th className="p-2.5">Anchor</th>
                    <th className="p-2.5">Rel</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D5DCE4]">
                  {shown.slice(0, 500).map((l, i) => (
                    <tr key={i}>
                      <td className="p-2.5 max-w-xs">
                        <a href={l.sourceUrl} target="_blank" rel="noreferrer nofollow" className="text-[#0F766E] hover:underline inline-flex items-center gap-1">
                          <span className="truncate">{l.sourceUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="p-2.5 max-w-[200px] truncate">{l.anchorText || "—"}</td>
                      <td className="p-2.5">{l.rel === "unknown" ? "—" : l.rel}</td>
                      <td className="p-2.5">
                        {l.isSuspicious ? (
                          <span className="inline-flex items-center gap-1 text-rose-700" title={l.reason}>
                            <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {shown.length > 500 && <p className="text-xs text-[#4A5568]">Showing the first 500 rows. Export CSV to see all.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
