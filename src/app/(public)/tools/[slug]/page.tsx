import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
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

    const canonical = getDefaultToolBySlug(slug);
    if (canonical && canonical.slug !== slug) {
      permanentRedirect(`/tools/${canonical.slug}`);
    }
    if (canonical) {
      tool = {
        ...canonical,
        ...(tool || {}),
        slug: canonical.slug,
        name: canonical.name,
        category: canonical.category,
        description: canonical.description,
        icon: canonical.icon,
        isComingSoon: canonical.isComingSoon,
      };
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

  // 301 Permanent Redirect for Aliased / Legacy Tool Slugs
  const canonical = getDefaultToolBySlug(slug);
  if (canonical && canonical.slug !== slug) {
    permanentRedirect(`/tools/${canonical.slug}`);
  }

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

  // Reconcile with canonical catalog to prevent database row corruption mismatches
  if (canonical) {
    tool = {
      ...canonical,
      ...(tool || {}),
      slug: canonical.slug,
      name: canonical.name,
      category: canonical.category,
      description: canonical.description,
      icon: canonical.icon,
      isComingSoon: canonical.isComingSoon,
    };
  } else if (!tool) {
    notFound();
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

      <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500"
        >
          <Link href="/" className="hover:text-teal-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href={`/category/${catSlug}`} className="hover:text-teal-700 transition-colors">
            {tool.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
            {tool.name}
          </span>
        </nav>

        {/* State A: Coming Soon Tool */}
        {tool.isComingSoon ? (
          <ComingSoonToolView tool={tool} relatedTools={relatedTools} />
        ) : (
          /* State B: Live Interactive Tool */
          <div className="space-y-6">
            {/* Tool Header Banner */}
            <div className="p-3.5 sm:p-4 rounded-[8px] bg-white border border-slate-300 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[6px] bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ToolIcon name={tool.icon} className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <Link
                      href={`/category/${catSlug}`}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {tool.category}
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
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

              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Runs 100% in your browser
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-teal-700" /> Zero server file uploads
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Instant sub-millisecond execution
                </span>
              </div>
            </div>

            {/* Interactive Tool Workstation Canvas */}
            <div className="p-3.5 sm:p-5 rounded-[8px] bg-white border border-slate-300 shadow-xs">
              <ToolRenderer slug={tool.slug} />
            </div>

            {/* Section 1: Step-by-Step Practical Guide */}
            <section className="p-3.5 sm:p-4 rounded-[8px] bg-white border border-slate-300 space-y-3 shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 font-mono font-bold">
                  PRACTICAL GUIDE
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                  {seo.workflowHeading || `How to Use ${tool.name}`}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seo.howToSteps.map((s) => (
                  <div
                    key={s.step}
                    className="p-2.5 rounded-[6px] bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-teal-700 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {s.step}
                      </span>
                      <h3 className="font-heading font-semibold text-sm text-slate-900">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-8">
                      {s.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Key Capabilities & Architecture */}
            <section className="p-3.5 sm:p-4 rounded-[8px] bg-white border border-slate-300 space-y-3 shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 font-mono font-bold">
                  ARCHITECTURE & ADVANTAGES
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                  Key Technical Capabilities of {tool.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seo.keyBenefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-[6px] bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-teal-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h3 className="font-heading font-semibold text-sm text-slate-900">
                        {b.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: In-Depth Technical Guide & Deep Dive */}
            {seo.deepDiveContent && (
              <section className="p-3.5 sm:p-4 rounded-[8px] bg-white border border-slate-300 space-y-3 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono font-bold">
                    TECHNICAL DEEP DIVE
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                    Comprehensive Technical Overview & Best Practices
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-xs sm:text-sm leading-relaxed">
                  {seo.deepDiveContent
                    .trim()
                    .split("\n\n")
                    .map((block: string, idx: number) => {
                      if (block.startsWith("### ")) {
                        return (
                          <h3
                            key={idx}
                            className="text-base sm:text-lg font-heading font-bold text-foreground pt-3 text-slate-900"
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
                  <div className="p-4 rounded-lg bg-teal-500/5 border border-teal-500/20 space-y-2.5 mt-4">
                    <div className="flex items-center gap-2 text-teal-700">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wider font-mono">
                        Pro Engineering & Workflow Tips
                      </h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {seo.proTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-teal-700 font-bold">•</span>
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
              <section className="p-3.5 sm:p-4 rounded-[8px] bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-teal-700" />
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                    Frequently Asked Questions About {tool.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seo.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-[6px] bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <h3 className="font-semibold text-sm text-slate-900">
                        {faq.question}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 5: Related Tools in Same Category */}
            {relatedTools.length > 0 && (
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-heading font-black text-slate-900">
                    More {tool.category} on Zoqonyx
                  </h3>
                  <Link
                    href={`/category/${catSlug}`}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Category Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {relatedTools.map((rel) => (
                    <Link key={rel.slug} href={`/tools/${rel.slug}`} className="group">
                      <div className="p-3 rounded-[8px] bg-white border border-slate-300 hover:border-slate-900 hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)] transition-all space-y-1 h-full flex flex-col justify-between shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-[4px] bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <ToolIcon name={rel.icon} className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="font-heading font-black text-[13.5px] text-slate-900 group-hover:text-teal-700 transition-colors">
                              {rel.name}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">
                            {rel.description}
                          </p>
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 group-hover:text-teal-700 flex items-center gap-1 pt-2 border-t border-slate-100">
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
              <section className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-heading font-black text-slate-900">
                    Popular Free Tools on Zoqonyx
                  </h3>
                  <Link
                    href="/tools"
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Browse All 113+ Tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {popularTools.map((pop) => (
                    <Link key={pop.slug} href={`/tools/${pop.slug}`} className="group">
                      <div className="p-3 rounded-[8px] bg-white border border-slate-300 hover:border-slate-900 hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)] transition-all space-y-1 h-full flex flex-col justify-between shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-[4px] bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <ToolIcon name={pop.icon} className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="font-heading font-black text-[13px] text-slate-900 group-hover:text-teal-700 transition-colors">
                              {pop.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {pop.description}
                          </p>
                        </div>
                        <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider pt-1.5 border-t border-slate-100">
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
