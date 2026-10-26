import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TOOLS } from "@/lib/default-tools";
import { ToolCatalog } from "@/components/home/tool-catalog";
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  Lock,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Free Online Tools Directory | Zoqonyx",
  },
  description:
    "Explore 113+ fast, privacy-first, 100% free digital tools. Merge PDFs, compress images in bulk, format code, design CSS, simulate SERPs, and run calculations client-side with zero signups.",
  alternates: {
    canonical: "https://zoqonyx.com/tools",
  },
  openGraph: {
    title: "All Free Online Tools Directory (113+ Digital Utilities) | Zoqonyx",
    description:
      "Explore 113+ fast, privacy-first, 100% free digital tools. Zero installations, zero tracking, 100% browser-based.",
    url: "https://zoqonyx.com/tools",
    siteName: "Zoqonyx Solution Hub",
    images: [
      {
        url: "/logo/zoqonyx-og.png",
        width: 1200,
        height: 630,
        alt: "Zoqonyx All Tools Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Free Online Tools Directory | Zoqonyx",
    description:
      "Explore 100+ fast, privacy-first, 100% free digital tools. Zero installations, zero tracking.",
    images: ["/logo/zoqonyx-og.png"],
  },
};

const TOOLS_PAGE_FAQS = [
  {
    q: "Are all tools on Zoqonyx Solution Hub completely free?",
    a: "Yes. Every tool in the Zoqonyx catalog is 100% free with no hidden fees, no subscriptions, no credit card requirements, and no daily usage limits.",
  },
  {
    q: "Do I need to create an account or log in to use the tools?",
    a: "No. Unlike other platforms that lock high-resolution downloads or advanced features behind mandatory logins, all Zoqonyx tools work instantly the moment you visit the page.",
  },
  {
    q: "Are my files, images, and text snippets private and secure?",
    a: "Absolutely. Zoqonyx operates entirely on a client-side architecture. When you compress an image, format JSON, or generate a QR code, the code runs inside your web browser via HTML5 Canvas and JavaScript. Nothing is uploaded to or saved on remote servers.",
  },
  {
    q: "Can I use Zoqonyx tools on mobile devices?",
    a: "Yes. All tools are fully responsive and touch-optimized, offering full functionality across smartphones, tablets, laptops, and desktop computers.",
  },
];

export default async function ToolsPage() {
  let tools: any[] = [];

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
    console.error("Database fetch error on /tools, using static catalog:", error);
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

    // Merge: ensure all 130 tools are always displayed even if DB has only 37 seeded rows
    const dbSlugs = new Set(tools.map((t) => t.slug));
    const missing = defaultToolsFormatted.filter((t) => !dbSlugs.has(t.slug));
    tools = [...tools, ...missing].sort((a, b) => a.order - b.order);
  }

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Free Online Tools Directory - Zoqonyx Solution Hub",
    description:
      "Directory of 100+ free client-side digital tools for developers, designers, creators, and marketers.",
    url: "https://zoqonyx.com/tools",
    publisher: {
      "@type": "Organization",
      name: "Zoqonyx Solution Hub",
      url: "https://zoqonyx.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((t, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: t.name,
        description: t.description,
        url: `https://zoqonyx.com/tools/${t.slug}`,
      })),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TOOLS_PAGE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"
        >
          <Link href="/" className="hover:text-brand-cyan transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-bold">All Tools Directory</span>
        </nav>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-sm space-y-6">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Complete Directory • 113 Free Tools Live (165 Total Catalog)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-foreground leading-tight">
              All Free Online Tools Directory
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Browse our comprehensive directory of high-performance digital tools. Whether you need to compress photos, visually generate CSS gradients, validate complex JSON payloads, or format text, every tool runs 100% inside your web browser.
            </p>

            {/* Quick Guarantees */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free Always
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-brand-cyan" /> Zero Server Uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Zero Sign-up Required
              </span>
            </div>
          </div>
        </div>

        {/* Live Search & Catalog Component */}
        <section className="space-y-6">
          <ToolCatalog initialTools={tools} />
        </section>

        {/* Below-the-fold Comprehensive SEO Guide */}
        <section className="p-6 sm:p-8 rounded-xl bg-card border border-border/80 space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
              Why Browser-Native Digital Tools Are Superior
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Traditional online utilities frequently upload your sensitive assets—such as customer databases, confidential contract PDFs, and high-resolution creative media—to third-party cloud servers. This introduces significant privacy vulnerabilities, upload latency, and artificial rate-limiting paywalls.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Zoqonyx Solution Hub was built to overturn this model. By leveraging modern browser technologies including the HTML5 Canvas API, Web Workers, and WebAssembly, all data processing occurs entirely within your local device memory. Your confidential graphics and source code never leave your computer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-muted/20 border border-border/60 space-y-2 hover:border-teal-500/40 transition-colors">
              <div className="p-2 rounded-md bg-teal-500/10 text-teal-400 w-fit">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Absolute Data Privacy
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero telemetry on your files. No cookies tracking your uploads. Your photos and source code remain your private property.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/60 space-y-2 hover:border-teal-500/40 transition-colors">
              <div className="p-2 rounded-md bg-teal-500/10 text-teal-400 w-fit">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Zero Network Latency
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Processing speed is limited only by your device hardware, completely bypassing sluggish internet upload and download queues.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/60 space-y-2 hover:border-teal-500/40 transition-colors">
              <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400 w-fit">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                No Artificial Paywalls
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export 2048px high-resolution QR codes, compress multiple megabytes of imagery, and inspect deep code diffs completely unrestricted.
              </p>
            </div>
          </div>

          {/* Category Hubs Quick Links */}
          <div className="pt-6 border-t border-border/60 space-y-4">
            <h3 className="text-lg font-heading font-bold text-foreground">
              Explore Dedicated Category SEO Hubs
            </h3>
            <p className="text-xs text-muted-foreground">
              Discover in-depth technical guides, architectural comparisons, and specialized workflows by category:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { name: "Image & Photo Tools", slug: "image-tools" },
                { name: "CSS & Design Generators", slug: "css-design" },
                { name: "Text & Code Utilities", slug: "text-code" },
                { name: "Developer & SEO Tools", slug: "developer-seo" },
                { name: "Calculators & Math", slug: "calculators" },
                { name: "PDF & Document Utilities", slug: "pdf-documents" },
                { name: "Advanced AI Tools", slug: "ai-tools" },
              ].map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="p-3 rounded-lg bg-card border border-border/70 hover:border-teal-500/50 hover:bg-muted/30 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-semibold text-foreground group-hover:text-teal-400 transition-colors">
                    {c.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* FAQs Section */}
          <div className="pt-6 border-t border-border/60 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-400" />
              <h3 className="text-xl font-heading font-bold text-foreground">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOOLS_PAGE_FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-muted/20 border border-border/60 space-y-1.5"
                >
                  <p className="font-semibold text-xs sm:text-sm text-foreground">
                    {faq.q}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
