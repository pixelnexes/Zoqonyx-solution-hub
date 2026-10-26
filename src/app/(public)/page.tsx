import { prisma } from "@/lib/prisma";
import { ToolCatalog } from "@/components/home/tool-catalog";
import { ShieldCheck, Shield, Zap, Globe, Check, ArrowDown, Lock, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

import { DEFAULT_TOOLS } from "@/lib/default-tools";

export const metadata: Metadata = {
  title: {
    absolute: "Zoqonyx Solution Hub | 100+ Free Online Tools",
  },
  description:
    "113+ fast, private client-side digital utilities. Compress images in bulk, format JSON, manipulate PDFs, generate CSS, and compute values instantly with zero cloud uploads.",
  alternates: {
    canonical: "https://zoqonyx.com",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let tools: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    isComingSoon: boolean;
    icon: string | null;
    order: number;
  }> = [];

  try {
    tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        isActive: true,
        isComingSoon: true,
        icon: true,
        order: true,
      },
    });
  } catch (error) {
    console.error("Error fetching tools for homepage:", error);
  }

  const defaultToolsFormatted = DEFAULT_TOOLS.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
    isActive: t.isActive,
    isComingSoon: t.isComingSoon,
    icon: t.icon,
    order: t.order,
  }));

  const canonicalMap = new Map(DEFAULT_TOOLS.map((t) => [t.slug, t]));

  if (tools.length === 0) {
    tools = defaultToolsFormatted;
  } else {
    // Reconcile DB tools against canonical catalog to eliminate corrupted names/categories
    tools = tools.map((t) => {
      const c = canonicalMap.get(t.slug);
      return c
        ? {
            ...t,
            name: c.name,
            category: c.category,
            description: c.description,
            icon: c.icon,
            isComingSoon: c.isComingSoon,
          }
        : t;
    });

    // Merge: ensure all catalog tools are always displayed even if DB has fewer rows
    const dbSlugs = new Set(tools.map((t) => t.slug));
    const missing = defaultToolsFormatted.filter((t) => !dbSlugs.has(t.slug));
    tools = [...tools, ...missing].sort((a, b) => a.order - b.order);
  }

  const activeLiveCount = tools.filter((t) => !t.isComingSoon).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zoqonyx Solution Hub",
    url: "https://zoqonyx.com",
    description: "Free online tools platform for creators, developers, designers, and marketers.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://zoqonyx.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Hero Section - Linear/Vercel Technical Style */}
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-card/80 text-xs font-mono text-muted-foreground shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>113 Free Tools Live • Zero Cloud Uploads • 100% Client-Side</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
              High-performance browser tools.<br />
              <span className="text-teal-400">Zero tracking, zero uploads.</span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Every utility executes client-side in your device&apos;s isolated browser memory. Compress photos in bulk, manipulate PDFs, format code, and compute values with zero accounts, zero fees, and zero server latency.
            </p>

            {/* Quick Metrics */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs font-mono text-foreground">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-card/70 border border-border shadow-xs">
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span>113 Live Free Tools</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-card/70 border border-border shadow-xs">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>100% Client Privacy</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-card/70 border border-border shadow-xs">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Non-Blocking Bulk Batching</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Link href="#tools-catalog">
                <Button className="bg-teal-600 hover:bg-teal-500 text-white rounded-lg px-5 py-2 text-xs font-semibold gap-2 shadow-xs transition-colors">
                  <span>Explore 113 Free Tools</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Tool Catalog */}
          <div className="mt-8">
            <ToolCatalog initialTools={tools} />
          </div>

          {/* Value Proposition Grid */}
          <div className="mt-20 pt-14 border-t border-border/60">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                Engineered for High Speed, Zero Telemetry & Global Access
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The modern standard for digital utilities—crafted for engineers, creators, and teams worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-card/70 border border-border space-y-2.5 hover:border-teal-500/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-foreground">Zero-Knowledge Privacy</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your photos, sensitive documents, and proprietary code execute in your browser&apos;s isolated local memory. No files are transmitted to or stored on remote servers.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-card/70 border border-border space-y-2.5 hover:border-teal-500/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-foreground">Hardware-Accelerated Compute</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Harnessing HTML5 Canvas, Web Workers, and Web Crypto APIs. Heavy image filtering and data encoding execute at native device speeds with zero cloud latency.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-card/70 border border-border space-y-2.5 hover:border-teal-500/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-foreground">100% Free Forever</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No artificial paywalls, usage meters, or mandatory subscriptions. Clean, high-performance tools designed to boost productivity with zero barriers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}