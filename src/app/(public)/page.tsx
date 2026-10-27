import { prisma } from "@/lib/prisma";
import { ToolCatalog } from "@/components/home/tool-catalog";
import { ShieldCheck, Cpu, Globe } from "lucide-react";
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
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12">
          {/* Confident Human Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200/90 bg-white text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>113 Browser-Native Utilities</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">100% Free & Private</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.035em] text-slate-900 leading-[1.06]">
              Every digital utility you need,<br className="hidden sm:inline" />{" "}
              <span className="text-teal-700">executed privately in your browser.</span>
            </h1>

            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Compress images, edit PDFs, format code, and calculate values at native device speeds. Files never leave your computer—no servers, no logins, and zero usage limits.
            </p>
          </div>

          {/* Interactive Tool Catalog */}
          <div className="mt-3">
            <ToolCatalog initialTools={tools} />
          </div>

          {/* Security & Architecture Guarantee (Human Craftsmanship) */}
          <div className="mt-14 pt-10 border-t border-slate-200/90">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
                SECURITY ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Why client-side processing matters.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most online tools secretly upload your images, contracts, and code to remote cloud servers. Zoqonyx was engineered from day one to operate entirely inside your device&apos;s memory sandbox.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-[10px] bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-2.5">
                <div className="w-9 h-9 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Zero Cloud Uploads</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your files never travel across the internet. Image compression, PDF splitting, and text transformations happen strictly inside HTML5 Canvas and WebAssembly modules on your computer.
                </p>
              </div>

              <div className="p-5 rounded-[10px] bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-2.5">
                <div className="w-9 h-9 rounded-[8px] bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Hardware Acceleration</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Using local CPU and GPU threads via modern Web Workers. Heavy operations process with instant latency because there are no network bottlenecks or server upload queues.
                </p>
              </div>

              <div className="p-5 rounded-[10px] bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-2.5">
                <div className="w-9 h-9 rounded-[8px] bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Open Access Guarantee</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every utility is fully unlocked. No credit cards, no premium tiers, no daily quota limits, and no forced email signups. A true community utility built for daily workflow speed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
