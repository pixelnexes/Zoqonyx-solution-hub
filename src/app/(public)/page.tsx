import { prisma } from "@/lib/prisma";
import { ToolCatalog } from "@/components/home/tool-catalog";
import { ShieldCheck, Shield, Zap, Globe, Check, Cpu } from "lucide-react";
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
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-2 sm:pt-2.5 pb-6">
          {/* Dense High-Contrast Technical Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-2 pt-0 pb-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-slate-300 bg-white shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-[11px] font-mono font-bold tracking-tight text-slate-900 uppercase">
                113 Client-Side Utilities
              </span>
              <span className="h-3 w-px bg-slate-200" />
              <span className="text-[11px] font-mono text-slate-500 font-semibold">Zero Cloud Uploads</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-[-0.035em] text-slate-900 leading-[1.04]">
              Professional browser utilities.<br className="hidden sm:inline" />{" "}
              <span className="text-teal-700">Engineered for raw speed & zero tracking.</span>
            </h1>

            <p className="text-xs sm:text-[13.5px] text-slate-600 leading-normal max-w-2xl mx-auto font-normal">
              113 single-purpose utilities for images, PDFs, code, and documents. Files process locally in your device&apos;s isolated browser memory—no remote storage, no signup walls, and no server queue latency.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-0.5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-slate-800">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-white border border-slate-300 shadow-xs hover:border-slate-800 transition-colors">
                <Shield className="w-3.5 h-3.5 text-teal-700" strokeWidth={2.2} />
                <span>ZERO SERVER STORAGE</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-white border border-slate-300 shadow-xs hover:border-slate-800 transition-colors">
                <Zap className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.2} />
                <span>HARDWARE ACCELERATED</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-white border border-slate-300 shadow-xs hover:border-slate-800 transition-colors">
                <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.2} />
                <span>NO ACCOUNTS OR API KEYS</span>
              </div>
            </div>
          </div>

          {/* Interactive Tool Catalog (Directly Below Hero with Minimum Margin) */}
          <div className="mt-2.5">
            <ToolCatalog initialTools={tools} />
          </div>

          {/* Value Proposition Grid (Compact & Dense) */}
          <div className="mt-10 pt-6 border-t border-slate-300">
            <div className="text-center max-w-2xl mx-auto space-y-1 mb-4">
              <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                Engineered for High Speed, Zero Telemetry & Global Access
              </h2>
              <p className="text-xs text-slate-600">
                The modern standard for digital utilities—crafted for engineers, creators, and teams worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="p-3.5 rounded-[8px] bg-white border border-slate-300 space-y-1.5 hover:border-slate-800 transition-all shadow-xs">
                <div className="w-7 h-7 rounded-[4px] bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Zero-Knowledge Privacy</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Your photos, sensitive documents, and proprietary code execute in your browser&apos;s isolated local memory. No files are transmitted to or stored on remote servers.
                </p>
              </div>

              <div className="p-3.5 rounded-[8px] bg-white border border-slate-300 space-y-1.5 hover:border-slate-800 transition-all shadow-xs">
                <div className="w-7 h-7 rounded-[4px] bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Cpu className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">Hardware-Accelerated Compute</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Harnessing HTML5 Canvas, Web Workers, and Web Crypto APIs. Heavy image filtering and data encoding execute at native device speeds with zero cloud latency.
                </p>
              </div>

              <div className="p-3.5 rounded-[8px] bg-white border border-slate-300 space-y-1.5 hover:border-slate-800 transition-all shadow-xs">
                <div className="w-7 h-7 rounded-[4px] bg-teal-700 text-white flex items-center justify-center shadow-xs">
                  <Globe className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-900">100% Free Forever</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
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
