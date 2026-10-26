"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Globe,
  Copy,
  CheckCircle2,
  Search,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Smartphone,
  Monitor,
  Download,
} from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

// 1. XML Sitemap Generator
export function XmlSitemapGeneratorTool() {
  const [urls, setUrls] = React.useState<string>(
    "https://zoqonyx.com\nhttps://zoqonyx.com/tools\nhttps://zoqonyx.com/about\nhttps://zoqonyx.com/contact"
  );
  const [changefreq, setChangefreq] = React.useState<string>("daily");
  const [priority, setPriority] = React.useState<string>("0.8");
  const [xml, setXml] = React.useState<string>("");

  const generateSitemap = () => {
    const list = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    const date = new Date().toISOString().split("T")[0];

    const entries = list
      .map(
        (u) => `  <url>
    <loc>${u}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
      )
      .join("\n");

    const fullXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

    setXml(fullXml);
    addSessionHistory({
      toolSlug: "xml-sitemap-generator",
      toolName: "XML Sitemap Generator",
      action: "Generated Sitemap",
      summary: `Created sitemap.xml with ${list.length} URLs`,
    });
  };

  const downloadSitemap = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Website URLs (one per line)</Label>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={5}
            className="w-full p-3 text-xs font-mono rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Change Frequency</Label>
            <select
              value={changefreq}
              onChange={(e) => setChangefreq(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-border bg-background"
            >
              <option value="always">always</option>
              <option value="hourly">hourly</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Priority</Label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-border bg-background"
            >
              <option value="1.0">1.0 (Highest)</option>
              <option value="0.8">0.8 (Recommended)</option>
              <option value="0.5">0.5 (Default)</option>
              <option value="0.3">0.3 (Low)</option>
            </select>
          </div>
        </div>

        <Button onClick={generateSitemap} className="w-full bg-teal-600 hover:bg-teal-500 text-white">
          Generate XML Sitemap
        </Button>

        {xml && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">sitemap.xml Output</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(xml)}
                  className="text-xs gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
                <Button size="sm" onClick={downloadSitemap} className="text-xs gap-1 bg-teal-600 hover:bg-teal-500 text-white">
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            </div>
            <pre className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs overflow-x-auto">
              {xml}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. UTM Builder
export function UtmBuilderTool() {
  const [url, setUrl] = React.useState<string>("https://zoqonyx.com/tools");
  const [source, setSource] = React.useState<string>("twitter");
  const [medium, setMedium] = React.useState<string>("social");
  const [campaign, setCampaign] = React.useState<string>("spring_launch");
  const [content, setContent] = React.useState<string>("banner_ad");

  const buildUrl = () => {
    try {
      const u = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (source) u.searchParams.set("utm_source", source);
      if (medium) u.searchParams.set("utm_medium", medium);
      if (campaign) u.searchParams.set("utm_campaign", campaign);
      if (content) u.searchParams.set("utm_content", content);
      return u.toString();
    } catch {
      return url;
    }
  };

  const finalUrl = buildUrl();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Website Destination URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Campaign Source (utm_source)</Label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. google, newsletter, twitter" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Campaign Medium (utm_medium)</Label>
            <Input value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="e.g. cpc, email, social" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Campaign Name (utm_campaign)</Label>
            <Input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g. summer_promo" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Campaign Content (utm_content)</Label>
            <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="e.g. sidebar_link" />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Tagged Campaign URL</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(finalUrl)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs text-teal-400 break-all">
            {finalUrl}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Keyword Density Checker
export function KeywordDensityCheckerTool() {
  const [text, setText] = React.useState<string>(
    "Free online image compressor and PDF tools. Compress images online with zero loss. Our image compressor is 100% free and fast."
  );

  const getFrequencies = () => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const total = words.length;
    const counts: Record<string, number> = {};
    words.forEach((w) => {
      counts[w] = (counts[w] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        percent: total > 0 ? ((count / total) * 100).toFixed(1) : "0",
      }));
  };

  const frequencies = getFrequencies();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Article Content or Webpage Text</Label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full p-3 text-sm rounded-lg border border-border bg-muted/30"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Top Keywords Density</Label>
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-2 text-left">Keyword</th>
                  <th className="p-2 text-center">Frequency</th>
                  <th className="p-2 text-right">Density (%)</th>
                </tr>
              </thead>
              <tbody>
                {frequencies.map((item, i) => (
                  <tr key={i} className="border-b border-border/40">
                    <td className="p-2 font-medium">{item.word}</td>
                    <td className="p-2 text-center text-muted-foreground">{item.count}x</td>
                    <td className="p-2 text-right font-mono font-bold text-teal-400">{item.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Canonical Tag Checker
export function CanonicalTagCheckerTool() {
  const [url, setUrl] = React.useState<string>("https://zoqonyx.com/tools/image-compressor");
  const [canonicalTag, setCanonicalTag] = React.useState<string>("");

  const formatTag = () => {
    try {
      const u = new URL(url.startsWith("http") ? url : `https://${url}`);
      // normalize trailing slash and lowercase
      const clean = `${u.origin}${u.pathname}`.replace(/\/$/, "");
      setCanonicalTag(`<link rel="canonical" href="${clean}" />`);
    } catch {
      setCanonicalTag(`<link rel="canonical" href="${url}" />`);
    }
  };

  React.useEffect(() => {
    formatTag();
  }, [url]);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Page URL to Canonicalize</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Valid Canonical Tag</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(canonicalTag)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs text-teal-400 break-all">
            {canonicalTag}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Schema Markup Generator
export function SchemaMarkupGeneratorTool() {
  const [type, setType] = React.useState<"FAQPage" | "Article" | "Organization">("FAQPage");
  const [question, setQuestion] = React.useState<string>("Is Zoqonyx 100% free?");
  const [answer, setAnswer] = React.useState<string>(
    "Yes, all 100 tools on Zoqonyx run completely free in your browser with zero registration required."
  );

  const getSchema = () => {
    if (type === "FAQPage") {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer,
            },
          },
        ],
      };
    }
    if (type === "Article") {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": question,
        "author": {
          "@type": "Organization",
          "name": "Zoqonyx",
        },
      };
    }
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Zoqonyx Solution Hub",
      "url": "https://zoqonyx.com",
    };
  };

  const schemaJson = JSON.stringify(getSchema(), null, 2);
  const snippet = `<script type="application/ld+json">\n${schemaJson}\n</script>`;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Schema Type</Label>
          <div className="flex gap-2">
            {(["FAQPage", "Article", "Organization"] as const).map((t) => (
              <Button
                key={t}
                size="sm"
                variant={type === t ? "default" : "outline"}
                onClick={() => setType(t)}
                className={type === t ? "bg-teal-600 text-white" : "text-xs"}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {type === "FAQPage" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Question</Label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Answer</Label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-muted/30"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">JSON-LD Script Tag</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(snippet)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <pre className="p-3 rounded-lg border border-border bg-muted/40 font-mono text-xs overflow-x-auto text-teal-400">
            {snippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 6. HTTP Status Codes Diagnostic Reference
export function HttpStatusCodesTool() {
  const [search, setSearch] = React.useState<string>("");

  const CODES = [
    { code: 200, name: "OK", desc: "Request succeeded. Ideal for SEO crawlers and pages." },
    { code: 301, name: "Moved Permanently", desc: "Permanent redirect. Passes ~99% of link equity (PageRank)." },
    { code: 302, name: "Found (Temporary Redirect)", desc: "Temporary redirect. Does not transfer canonical equity." },
    { code: 400, name: "Bad Request", desc: "Malformed request syntax from client." },
    { code: 401, name: "Unauthorized", desc: "Authentication credentials required or invalid." },
    { code: 403, name: "Forbidden", desc: "Server refused authorization regardless of credentials." },
    { code: 404, name: "Not Found", desc: "Resource could not be found. Excluded from Google index." },
    { code: 410, name: "Gone", desc: "Resource intentionally deleted permanently. Expedites index removal." },
    { code: 500, name: "Internal Server Error", desc: "Server crashed or encountered an unhandled exception." },
    { code: 502, name: "Bad Gateway", desc: "Invalid response from upstream backend server." },
    { code: 503, name: "Service Unavailable", desc: "Server temporarily overloaded or down for maintenance." },
  ];

  const filtered = CODES.filter(
    (c) =>
      c.code.toString().includes(search) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Search Code or Keyword</Label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search e.g. 301, not found, redirect..."
          />
        </div>

        <div className="space-y-2">
          {filtered.map((c) => (
            <div
              key={c.code}
              className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-black ${
                    c.code < 300
                      ? "bg-teal-500/10 text-teal-400"
                      : c.code < 400
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {c.code}
                </span>
                <span className="text-sm font-semibold text-foreground">{c.name}</span>
              </div>
              <p className="text-xs text-muted-foreground sm:max-w-md">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 7. Google SERP Snippet Preview Simulator
export function SerpSnippetPreviewTool() {
  const [title, setTitle] = React.useState<string>("Free Online Tools Suite - Fast & Private | Zoqonyx");
  const [url, setUrl] = React.useState<string>("https://zoqonyx.com/tools");
  const [desc, setDesc] = React.useState<string>(
    "Access 100+ free browser tools for image compression, PDF merging, CSS generation, code formatting, and mathematical calculations with zero signups."
  );
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={device === "desktop" ? "default" : "outline"}
            onClick={() => setDevice("desktop")}
            className={device === "desktop" ? "bg-teal-600 text-white gap-1.5" : "text-xs gap-1.5"}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop Preview
          </Button>
          <Button
            size="sm"
            variant={device === "mobile" ? "default" : "outline"}
            onClick={() => setDevice("mobile")}
            className={device === "mobile" ? "bg-teal-600 text-white gap-1.5" : "text-xs gap-1.5"}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile Preview
          </Button>
        </div>

        {/* Search Result Mockup */}
        <div className="p-6 rounded-2xl border border-border bg-background shadow-md space-y-1 font-sans">
          <div className="flex items-center gap-2 text-xs text-muted-foreground pb-0.5">
            <span className="truncate max-w-xs">{url}</span>
          </div>
          <h3 className="text-lg text-blue-500 dark:text-blue-400 hover:underline cursor-pointer font-medium leading-snug">
            {title || "Page Title Here"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-1">
            {desc || "Meta description snippet will appear here exactly as indexed by search engines."}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label className="text-xs font-semibold">Page Title ({title.length}/60 chars)</Label>
              <span className={`text-[10px] ${title.length > 60 ? "text-amber-400 font-bold" : "text-muted-foreground"}`}>
                {title.length > 60 ? "May be truncated by Google" : "Optimal"}
              </span>
            </div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Target URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label className="text-xs font-semibold">Meta Description ({desc.length}/160 chars)</Label>
              <span className={`text-[10px] ${desc.length > 160 ? "text-amber-400 font-bold" : "text-muted-foreground"}`}>
                {desc.length > 160 ? "Exceeds 160 char snippet limit" : "Optimal"}
              </span>
            </div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full p-2.5 text-xs rounded-lg border border-border bg-muted/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}