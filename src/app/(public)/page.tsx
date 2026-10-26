import { prisma } from "@/lib/prisma";
import { ToolCatalog } from "@/components/home/tool-catalog";
import { ShieldCheck, Shield, Zap, Globe, Check, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

import { DEFAULT_TOOLS } from "@/lib/default-tools";

export const metadata: Metadata = {
  title: {
    absolute: "Zoqonyx Solution Hub | Free Online Tools Platform",
  },
  description:
    "Every useful tool in one place. Compress images, format JSON, generate CSS styles, convert files, and calculate values instantly with zero subscriptions and zero data storage.",
  alternates: {
    canonical: "https://zoqonyx.com",
  },
};

// Force dynamic or ISR to ensure admin toggles reflect immediately without redeploy
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

  if (tools.length === 0) {
    tools = DEFAULT_TOOLS.map((t) => ({
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
  }

  const activeLiveCount = tools.filter((t) => !t.isComingSoon).length;
  const comingSoonCount = tools.filter((t) => t.isComingSoon).length;

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

      <div className="relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-cyan/15 via-brand-purple/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold backdrop-blur-sm animate-in fade-in zoom-in duration-300 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Next-Gen Web Utilities • Hardware-Accelerated Local Compute • Zero Telemetry</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-foreground leading-[1.1]">
              Next-Gen Digital Tools. <br />
              <span className="brand-gradient-text">Zero Server Limits.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Experience 100+ private, hardware-accelerated digital utilities and 30 upcoming pro tools. Merge PDFs, compress high-res media in bulk, generate QR matrices, format code, and calculate values—with zero subscriptions, zero tracking, and zero cloud uploads.
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-foreground">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border/80 shadow-sm">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{activeLiveCount}+ Live Free Tools</span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border/80 shadow-sm">
                <Shield className="w-4 h-4 text-brand-cyan" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border/80 shadow-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Zero Server Uploads</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Link href="#tools-catalog">
                <Button variant="gradient" size="lg" className="gap-2 shadow-lg shadow-brand-cyan/25 hover:shadow-brand-cyan/40 transition-all duration-300">
                  <span>Explore Tools Catalog</span>
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Tool Catalog */}
          <div className="mt-12">
            <ToolCatalog initialTools={tools} />
          </div>

          {/* Value Proposition Grid */}
          <div className="mt-24 pt-16 border-t border-border/60">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Engineered for High Speed, Zero Telemetry & Global Access
              </h2>
              <p className="text-sm text-muted-foreground">
                The modern standard for digital utilities—crafted for engineers, creators, and teams worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card/60 border border-border/80 space-y-3 hover:border-brand-cyan/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">Zero-Knowledge Privacy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your photos, sensitive documents, and proprietary code execute in your browser’s isolated local memory. No files are transmitted to or stored on remote servers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-border/80 space-y-3 hover:border-brand-cyan/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">Hardware-Accelerated Compute</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Harnessing HTML5 Canvas, Web Workers, and Web Crypto APIs. Heavy image filtering and data encoding execute at native device speeds with zero cloud latency.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 border border-border/80 space-y-3 hover:border-brand-cyan/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">100% Free Forever</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
