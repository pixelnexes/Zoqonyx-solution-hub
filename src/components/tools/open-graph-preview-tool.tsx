"use client";

import * as React from "react";
import {
  Globe,
  Share2,
  Copy,
  Check,
  Eye,
  Sparkles,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Code2,
  Layers,
  HelpCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PreviewPlatform = "twitter" | "facebook" | "linkedin" | "google" | "whatsapp" | "discord";

export function OpenGraphPreviewTool() {
  const [title, setTitle] = React.useState("Zoqonyx Solution Hub – Free Online Tools Platform");
  const [desc, setDesc] = React.useState(
    "37+ fast, client-side digital utilities. Compress images, format JSON, generate branded QR codes and CSS styles. Zero uploads, 100% private."
  );
  const [url, setUrl] = React.useState("https://zoqonyx.com");
  const [siteName, setSiteName] = React.useState("Zoqonyx Solution Hub");
  const [imageUrl, setImageUrl] = React.useState("https://zoqonyx.com/logo/zoqonyx-og.png");
  const [twitterHandle, setTwitterHandle] = React.useState("@zoqonyx");
  const [twitterCardType, setTwitterCardType] = React.useState<"summary_large_image" | "summary">("summary_large_image");
  const [activePlatform, setActivePlatform] = React.useState<PreviewPlatform>("twitter");
  const [codeTab, setCodeTab] = React.useState<"html" | "nextjs" | "jsonld">("html");
  const [copied, setCopied] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle local image upload for instant visual preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Derive domain from URL safely
  const domain = React.useMemo(() => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return "zoqonyx.com";
    }
  }, [url]);

  // Code formats
  const htmlMetaCode = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${desc}" />
<link rel="canonical" href="${url}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="${twitterCardType}" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${desc}" />
<meta property="twitter:image" content="${imageUrl}" />
<meta property="twitter:creator" content="${twitterHandle}" />`;

  const nextJsMetadataCode = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title}",
  description: "${desc}",
  alternates: {
    canonical: "${url}",
  },
  openGraph: {
    title: "${title}",
    description: "${desc}",
    url: "${url}",
    siteName: "${siteName}",
    images: [
      {
        url: "${imageUrl}",
        width: 1200,
        height: 630,
        alt: "${title}",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "${twitterCardType}",
    title: "${title}",
    description: "${desc}",
    images: ["${imageUrl}"],
    creator: "${twitterHandle}",
  },
};`;

  const jsonLdCode = `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${title}",
  "description": "${desc}",
  "url": "${url}",
  "publisher": {
    "@type": "Organization",
    "name": "${siteName}",
    "logo": {
      "@type": "ImageObject",
      "url": "${imageUrl}"
    }
  }
}`;

  const getActiveCode = () => {
    switch (codeTab) {
      case "nextjs":
        return nextJsMetadataCode;
      case "jsonld":
        return jsonLdCode;
      case "html":
      default:
        return htmlMetaCode;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SEO Health Checks
  const titleLen = title.length;
  const descLen = desc.length;
  const isTitleGood = titleLen >= 40 && titleLen <= 60;
  const isDescGood = descLen >= 110 && descLen <= 160;

  return (
    <div className="space-y-8">
      {/* Top Banner / Feature Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-cyan/10 via-brand-purple/10 to-transparent border border-brand-cyan/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-brand-cyan/20 text-brand-cyan">
              Live Simulator
            </span>
            <h2 className="text-sm sm:text-base font-heading font-bold text-foreground">
              Social Card & SERP Open Graph Inspector
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Test how your links render across Twitter/X, Facebook, LinkedIn, Google SERP, WhatsApp, and Discord with pixel-accurate layout engines.
          </p>
        </div>

        {/* Quick Health Meter Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              isTitleGood
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : titleLen > 60
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {isTitleGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>Title: {titleLen}/60</span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              isDescGood
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : descLen > 160
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {isDescGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>Desc: {descLen}/160</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form & Meta Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-cyan" />
              <span>Metadata Configuration</span>
            </h3>
            <span className="text-[11px] text-muted-foreground">Live reactive</span>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Page Title</label>
              <span
                className={`text-[11px] font-mono ${
                  titleLen > 60
                    ? "text-amber-500 font-bold"
                    : isTitleGood
                    ? "text-emerald-500 font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {titleLen}/60 chars {titleLen > 60 && "(Truncated in Google)"}
              </span>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Awesome Web App | Zoqonyx"
              className="h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Meta Description Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Meta Description</label>
              <span
                className={`text-[11px] font-mono ${
                  descLen > 160
                    ? "text-amber-500 font-bold"
                    : isDescGood
                    ? "text-emerald-500 font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {descLen}/160 chars {descLen > 160 && "(Truncated in search)"}
              </span>
            </div>
            <Textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Provide a clear, engaging summary of the webpage for search engines and social feeds..."
              className="text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Canonical URL & Site Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Canonical URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Site Name</label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Brand / Website Name"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Social Image URL & Local Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Social Preview Image (OG Image)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-medium text-brand-cyan hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Test Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/og-banner.png (1200x630)"
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Recommended standard: 1200 x 630 px (1.91:1 ratio) in PNG/JPEG</span>
            </p>
          </div>

          {/* Twitter Card Type & Creator Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Twitter Card Type</label>
              <select
                value={twitterCardType}
                onChange={(e) => setTwitterCardType(e.target.value as "summary_large_image" | "summary")}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              >
                <option value="summary_large_image">Large Image (1200x630)</option>
                <option value="summary">Summary Small Square</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Twitter Handle</label>
              <Input
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@username"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Social & Search Previews (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Platform Tab Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/80 overflow-x-auto scrollbar-none">
            {[
              { id: "twitter", label: "Twitter / X" },
              { id: "facebook", label: "Facebook" },
              { id: "linkedin", label: "LinkedIn" },
              { id: "google", label: "Google SERP" },
              { id: "whatsapp", label: "WhatsApp" },
              { id: "discord", label: "Discord" },
            ].map((platform) => (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id as PreviewPlatform)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activePlatform === platform.id
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>

          {/* Preview Container Mockups */}
          <div className="p-4 sm:p-6 rounded-2xl bg-card/80 border border-border/80 shadow-md min-h-[380px] flex flex-col justify-center">
            {/* 1. TWITTER / X PREVIEW */}
            {activePlatform === "twitter" && (
              <div className="max-w-md mx-auto w-full rounded-2xl border border-border/80 bg-background/90 p-4 space-y-3 shadow-lg">
                {/* User Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-purple flex items-center justify-center text-white font-bold text-xs">
                    ZX
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1">
                      Zoqonyx <span className="text-blue-400">✓</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">{twitterHandle} · 1m</p>
                  </div>
                </div>

                <p className="text-xs text-foreground">
                  Check out this link: Discover fast, free digital utilities with 100% client-side privacy.
                </p>

                {/* Twitter Card Preview */}
                {twitterCardType === "summary_large_image" ? (
                  <div className="rounded-xl overflow-hidden border border-border/80 bg-card/60 hover:bg-card/90 transition-colors cursor-pointer group">
                    <div className="aspect-[1.91/1] w-full overflow-hidden bg-muted relative">
                      <img
                        src={imageUrl || "/logo/zoqonyx-og.png"}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/logo/zoqonyx-og.png";
                        }}
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-white font-mono">
                        {domain}
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-semibold text-foreground line-clamp-1">{title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{desc}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex rounded-xl overflow-hidden border border-border/80 bg-card/60 cursor-pointer">
                    <div className="w-24 h-24 shrink-0 bg-muted overflow-hidden">
                      <img
                        src={imageUrl || "/logo/zoqonyx-og.png"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5 flex flex-col justify-center space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-mono">{domain}</p>
                      <p className="text-xs font-semibold text-foreground line-clamp-1">{title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{desc}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. FACEBOOK PREVIEW */}
            {activePlatform === "facebook" && (
              <div className="max-w-md mx-auto w-full rounded-2xl border border-border/80 bg-background/90 p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    f
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{siteName}</p>
                    <p className="text-[11px] text-muted-foreground">Sponsored · Just now · 🌐</p>
                  </div>
                </div>

                <p className="text-xs text-foreground">
                  Transform your digital workflow with zero fees and total privacy.
                </p>

                <div className="rounded-xl overflow-hidden border border-border/80 bg-muted/30">
                  <div className="aspect-[1.91/1] w-full overflow-hidden bg-muted">
                    <img
                      src={imageUrl || "/logo/zoqonyx-og.png"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo/zoqonyx-og.png";
                      }}
                    />
                  </div>
                  <div className="p-3 bg-muted/20 space-y-0.5 border-t border-border/60">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                      {domain}
                    </p>
                    <p className="text-xs font-bold text-foreground line-clamp-1">{title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{desc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. LINKEDIN PREVIEW */}
            {activePlatform === "linkedin" && (
              <div className="max-w-md mx-auto w-full rounded-2xl border border-border/80 bg-background/90 p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0077B5] flex items-center justify-center text-white font-bold text-xs">
                    in
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{siteName}</p>
                    <p className="text-[10px] text-muted-foreground">1,250 followers · Promoted</p>
                  </div>
                </div>

                <p className="text-xs text-foreground">
                  Empowering professionals with state-of-the-art client-side browser utilities.
                </p>

                <div className="rounded-xl overflow-hidden border border-border/80 bg-muted/20">
                  <div className="aspect-[1.91/1] w-full overflow-hidden bg-muted">
                    <img
                      src={imageUrl || "/logo/zoqonyx-og.png"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 bg-card space-y-1 border-t border-border/60">
                    <p className="text-xs font-bold text-foreground line-clamp-1">{title}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                      <span>{domain}</span>
                      <span>· 1 min read</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. GOOGLE SERP PREVIEW */}
            {activePlatform === "google" && (
              <div className="max-w-lg mx-auto w-full rounded-2xl border border-border/80 bg-background/95 p-5 space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                    🌐
                  </div>
                  <div className="text-xs leading-none">
                    <p className="font-medium text-foreground">{siteName}</p>
                    <p className="text-[11px] text-muted-foreground">{url}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                    {title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                </div>
              </div>
            )}

            {/* 5. WHATSAPP PREVIEW */}
            {activePlatform === "whatsapp" && (
              <div className="max-w-sm mx-auto w-full rounded-2xl bg-emerald-950/20 border border-emerald-500/20 p-4 shadow-lg">
                <div className="bg-background dark:bg-zinc-900 rounded-xl p-3 shadow-sm border border-border/80 space-y-2">
                  <div className="rounded-lg overflow-hidden bg-muted aspect-[1.91/1]">
                    <img
                      src={imageUrl || "/logo/zoqonyx-og.png"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground line-clamp-1">{title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{desc}</p>
                    <p className="text-[10px] text-emerald-500 font-mono pt-1">{domain}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. DISCORD PREVIEW */}
            {activePlatform === "discord" && (
              <div className="max-w-md mx-auto w-full rounded-2xl bg-[#2f3136] text-white p-4 shadow-xl border border-white/10 space-y-2 font-sans">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-semibold text-white">BotUser</span>
                  <span className="bg-[#5865F2] text-[10px] px-1 rounded text-white font-medium">BOT</span>
                  <span className="text-[10px]">Today at 12:45 PM</span>
                </div>

                <div className="border-l-4 border-brand-cyan bg-[#292b2f] rounded-r-lg p-3 space-y-2">
                  <p className="text-[11px] text-zinc-400 font-medium">{siteName}</p>
                  <a href={url} className="text-xs font-bold text-brand-cyan hover:underline block line-clamp-1">
                    {title}
                  </a>
                  <p className="text-[11px] text-zinc-300 line-clamp-2">{desc}</p>

                  <div className="rounded overflow-hidden max-h-48 aspect-[1.91/1] bg-black/40">
                    <img
                      src={imageUrl || "/logo/zoqonyx-og.png"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Code Export Tabs & Copy Button */}
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3 bg-muted/40 border-b border-border/60">
              <div className="flex items-center gap-1.5">
                {[
                  { id: "html", label: "HTML Meta Tags" },
                  { id: "nextjs", label: "Next.js Metadata" },
                  { id: "jsonld", label: "JSON-LD Schema" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCodeTab(tab.id as "html" | "nextjs" | "jsonld")}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      codeTab === tab.id
                        ? "bg-background text-brand-cyan shadow-sm border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <Button
                variant="gradient"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 text-xs gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </Button>
            </div>

            <pre className="p-4 text-xs font-mono bg-background/50 overflow-x-auto text-muted-foreground leading-relaxed max-h-60 scrollbar-thin">
              <code>{getActiveCode()}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
