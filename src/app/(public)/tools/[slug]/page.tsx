import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { ComingSoonToolView } from "@/components/tools/coming-soon-tool-view";
import { ToolIcon } from "@/components/common/tool-icon";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
} from "lucide-react";
import { getDefaultToolBySlug, DEFAULT_TOOLS } from "@/lib/default-tools";
import { getToolSeoContent } from "@/lib/tool-seo-content";

export const dynamic = "force-dynamic";

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "Image Tools": "image-tools",
  "CSS & Design": "css-design",
  "Text & Code": "text-code",
  "Developer & SEO": "developer-seo",
  "Calculators": "calculators",
  "PDF & Documents": "pdf-documents",
  "Advanced Image / AI": "ai-tools",
  "AI Writing & Business": "ai-tools",
  "SEO & Marketing": "developer-seo",
};

const POPULAR_TOOL_SLUGS = [
  "image-compressor",
  "qr-code-generator",
  "json-formatter",
  "border-radius-generator",
  "css-gradient-generator",
  "age-calculator",
];

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    let tool = null;
    try {
      tool = await prisma.tool.findUnique({
        where: { slug },
      });
    } catch {}

    if (!tool) {
      tool = getDefaultToolBySlug(slug);
    }

    if (!tool) {
      return {
        title: "Tool Not Found | Zoqonyx",
      };
    }

    const seo = getToolSeoContent(slug, tool.name, tool.category, tool.description);
    const url = `https://zoqonyx.com/tools/${slug}`;

    return {
      title: {
        absolute: seo.title,
      },
      description: seo.metaDesc,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: seo.title,
        description: seo.metaDesc,
        url,
        siteName: "Zoqonyx Solution Hub",
        images: [
          {
            url: "/logo/zoqonyx-og.png",
            width: 1200,
            height: 630,
            alt: tool.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: seo.title,
        description: seo.metaDesc,
        images: ["/logo/zoqonyx-og.png"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for tool:", error);
    return {
      title: "Online Tool | Zoqonyx",
      description: "Fast, private, client-side digital utility.",
      alternates: {
        canonical: `https://zoqonyx.com/tools/${slug}`,
      },
    };
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  let tool: any = null;
  let relatedTools: Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string | null;
  }> = [];

  try {
    tool = await prisma.tool.findUnique({
      where: { slug },
    });

    if (tool) {
      // Increment usageCount in background
      prisma.tool
        .update({
          where: { id: tool.id },
          data: { usageCount: { increment: 1 } },
        })
        .catch((e) => console.error("Error updating usage count:", e));

      relatedTools = await prisma.tool.findMany({
        where: {
          isActive: true,
          category: tool.category,
          id: { not: tool.id },
        },
        take: 6,
        select: {
          slug: true,
          name: true,
          description: true,
          category: true,
          icon: true,
        },
      });
    }
  } catch (error) {
    console.error("Database connection error in ToolPage:", error);
  }

  // Resilient fallback to default catalog if DB returned null
  if (!tool) {
    tool = getDefaultToolBySlug(slug);
  }

  if (tool && relatedTools.length === 0) {
    relatedTools = DEFAULT_TOOLS.filter(
      (t) => t.category === tool.category && t.slug !== tool.slug
    ).slice(0, 6);
  }

  if (!tool) {
    notFound();
  }

  const seo = getToolSeoContent(slug, tool.name, tool.category, tool.description);
  const catSlug = CATEGORY_SLUG_MAP[tool.category] || "developer-seo";

  // Popular Tools query (excluding current tool)
  const popularTools = DEFAULT_TOOLS.filter(
    (t) => POPULAR_TOOL_SLUGS.includes(t.slug) && t.slug !== tool.slug
  ).slice(0, 4);

  // Structured Data (JSON-LD)
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://zoqonyx.com/tools/${tool.slug}`,
    applicationCategory: tool.category,
    operatingSystem: "All",
    browserRequirements: "Requires modern web browser with HTML5 Canvas and JavaScript support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://zoqonyx.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.category,
        item: `https://zoqonyx.com/category/${catSlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `https://zoqonyx.com/tools/${tool.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
        >
          <Link href="/" className="hover:text-brand-cyan transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href={`/category/${catSlug}`} className="hover:text-brand-cyan transition-colors">
            {tool.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-foreground font-bold truncate max-w-[200px] sm:max-w-none">
            {tool.name}
          </span>
        </nav>

        {/* State A: Coming Soon Tool */}
        {tool.isComingSoon ? (
          <ComingSoonToolView tool={tool} relatedTools={relatedTools} />
        ) : (
          /* State B: Live Interactive Tool */
          <div className="space-y-12">
            {/* Tool Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 text-brand-cyan dark:text-cyan-400">
                    <ToolIcon name={tool.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <Link
                      href={`/category/${catSlug}`}
                      className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-brand-cyan transition-colors"
                    >
                      {tool.category}
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
                      {tool.name}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1.5 py-1 px-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Free & Live</span>
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Runs 100% in your browser
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-brand-cyan" /> Zero server file uploads
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Instant sub-millisecond execution
                </span>
              </div>
            </div>

            {/* Interactive Tool Workstation Canvas */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm">
              <ToolRenderer slug={tool.slug} />
            </div>

            {/* Section 1: Step-by-Step "How to Use" Guide */}
            <section className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                  User Tutorial
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                  How to Use {tool.name} in 4 Simple Steps
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seo.howToSteps.map((s) => (
                  <div
                    key={s.step}
                    className="p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-2 hover:border-brand-cyan/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-cyan/15 text-brand-cyan font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <h3 className="font-heading font-semibold text-sm text-foreground">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                      {s.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Key Benefits & Browser Architecture */}
            <section className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-purple">
                  Architectural Advantages
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                  Why {tool.name} on Zoqonyx Beats Cloud Server Tools
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seo.keyBenefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-2 hover:border-brand-purple/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-brand-purple">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <h3 className="font-heading font-semibold text-sm text-foreground">
                        {b.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: In-Depth Technical Guide & Deep Dive */}
            {seo.deepDiveContent && (
              <section className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 space-y-6">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Deep Dive Guide
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                    Comprehensive Technical Overview & Best Practices
                  </h2>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-4 text-xs sm:text-sm leading-relaxed">
                  {seo.deepDiveContent
                    .trim()
                    .split("\n\n")
                    .map((block: string, idx: number) => {
                      if (block.startsWith("### ")) {
                        return (
                          <h3
                            key={idx}
                            className="text-base sm:text-lg font-heading font-bold text-foreground pt-3 text-slate-900 dark:text-white"
                          >
                            {block.replace("### ", "")}
                          </h3>
                        );
                      }
                      if (block.startsWith("- ")) {
                        const items = block.split("\n").map((i: string) => i.replace(/^- /, ""));
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-1">
                            {items.map((li: string, i: number) => (
                              <li key={i}>{li}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx}>{block}</p>;
                    })}
                </div>

                {/* Pro Tips Box */}
                {seo.proTips && seo.proTips.length > 0 && (
                  <div className="p-5 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/20 space-y-3 mt-6">
                    <div className="flex items-center gap-2 text-brand-cyan">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wider">
                        Pro Developer & Designer Tips
                      </h4>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {seo.proTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand-cyan font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Section 4: Frequently Asked Questions (FAQs) */}
            {seo.faqs && seo.faqs.length > 0 && (
              <section className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 space-y-6">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-cyan" />
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                    Frequently Asked Questions About {tool.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seo.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-2"
                    >
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground">
                        {faq.question}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 5: Related Tools in Same Category */}
            {relatedTools.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading font-bold text-foreground">
                    More {tool.category} on Zoqonyx
                  </h3>
                  <Link
                    href={`/category/${catSlug}`}
                    className="text-xs font-semibold text-brand-cyan hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Category Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools.map((rel) => (
                    <Link key={rel.slug} href={`/tools/${rel.slug}`} className="group">
                      <div className="p-4 rounded-xl bg-card border border-border/80 hover:border-brand-cyan/60 transition-all space-y-1.5 h-full flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <ToolIcon name={rel.icon} className="w-4 h-4 text-brand-cyan" />
                            <span className="font-heading font-semibold text-sm group-hover:text-brand-cyan transition-colors">
                              {rel.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {rel.description}
                          </p>
                        </div>
                        <div className="text-[11px] font-semibold text-brand-cyan flex items-center gap-1 pt-2">
                          <span>Launch Tool</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Section 6: Popular Tools Across Platform */}
            {popularTools.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading font-bold text-foreground">
                    Popular Free Tools on Zoqonyx
                  </h3>
                  <Link
                    href="/tools"
                    className="text-xs font-semibold text-brand-cyan hover:underline inline-flex items-center gap-1"
                  >
                    <span>Browse All 37+ Tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {popularTools.map((pop) => (
                    <Link key={pop.slug} href={`/tools/${pop.slug}`} className="group">
                      <div className="p-4 rounded-xl bg-card border border-border/80 hover:border-brand-cyan/60 transition-all space-y-1.5 h-full flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <ToolIcon name={pop.icon} className="w-4 h-4 text-brand-purple" />
                            <span className="font-heading font-semibold text-xs text-foreground group-hover:text-brand-cyan transition-colors">
                              {pop.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {pop.description}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pt-2">
                          {pop.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}
