import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { ComingSoonToolView } from "@/components/tools/coming-soon-tool-view";
import Link from "next/link";
import { ArrowRight, ChevronDown, Lightbulb } from "lucide-react";
import { ToolIcon } from "@/components/common/tool-icon";
import { categoryStyle } from "@/components/kit/icons";
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
  "PDF Documents": "pdf-documents",
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
      if (canonical.isActive === false) {
        return {
          title: "Tool Not Found | Zoqonyx",
        };
      }
      tool = {
        ...canonical,
        ...(tool || {}),
        slug: canonical.slug,
        name: canonical.name,
        category: canonical.category,
        description: canonical.description,
        icon: canonical.icon,
        isActive: canonical.isActive,
        isComingSoon: false,
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
    if (canonical.isActive === false) {
      notFound();
    }
    tool = {
      ...canonical,
      ...(tool || {}),
      slug: canonical.slug,
      name: canonical.name,
      category: canonical.category,
      description: canonical.description,
      icon: canonical.icon,
      isActive: canonical.isActive,
      isComingSoon: false,
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
  const catLabel = CATEGORY_LABELS[catSlug] || tool.category;

  const { accent: toolAccent } = categoryStyle(catLabel);

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

      <div className="zq-page">
        <section className="zq-hero-light">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <nav aria-label="Breadcrumb" className="text-sm text-[#51607A]">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link href="/" className="hover:underline underline-offset-4">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/category/${catSlug}`} className="hover:underline underline-offset-4">
                    {catLabel}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-[#0B1F3A]">
                  {tool.name}
                </li>
              </ol>
            </nav>
            <div className="mt-5 flex flex-col sm:flex-row sm:items-start gap-5">
              <span className={`zq-chip ${toolAccent.chip} !w-16 !h-16 !rounded-2xl zq-float`} aria-hidden="true">
                <ToolIcon name={tool.icon} className="w-8 h-8" strokeWidth={2} />
              </span>
              <div className="max-w-3xl">
                <h1 className="zq-in-solid zq-display text-3xl sm:text-5xl font-extrabold leading-[1.06] text-[#0B1F3A]">{tool.name}</h1>
                <p className="zq-in mt-3 text-[18px] leading-relaxed text-[#51607A]">{tool.description}</p>
                <p className="mt-3 inline-flex rounded-full border border-[#0B1F3A]/15 bg-white/80 px-3 py-1 text-sm font-semibold">Free to use. No sign-up.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
          {/* The tool itself */}
          <div className="p-4 sm:p-6 rounded-[18px] bg-white border border-[#E2E8F0] shadow-[0_20px_50px_-28px_rgba(30,40,120,.35)] -mt-6 relative">
            <ToolRenderer slug={tool.slug} />
          </div>

          {/* How to use: a real sequence, so numbered */}
          <section aria-labelledby="howto-heading">
            <h2 id="howto-heading" className="zq-display zq-h2">
              How to use {tool.name}
            </h2>
            <ol className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {seo.howToSteps.map((s) => (
                <li key={s.step} className="zq-card p-5">
                  <span className={`zq-chip zq-chip-sm ${toolAccent.chip} font-extrabold`} aria-hidden="true">
                    {s.step}
                  </span>
                  <h3 className="mt-3 text-[17px] font-bold leading-snug">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#51607A]">{s.instruction}</p>
                </li>
              ))}
            </ol>
          </section>

          {seo.keyBenefits.length > 0 && (
            <section aria-labelledby="features-heading">
              <h2 id="features-heading" className="zq-display zq-h2">
                What {tool.name} does
              </h2>
              <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {seo.keyBenefits.map((b, idx) => (
                  <div key={idx} className="zq-card p-5" style={{ borderTop: `3px solid ${toolAccent.color}` }}>
                    <dt className="text-[17px] font-bold">{b.title}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-[#51607A]">{b.desc}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {seo.deepDiveContent && (
            <section aria-labelledby="about-heading" className="max-w-3xl">
              <h2 id="about-heading" className="zq-display zq-h2">
                About {tool.name}
              </h2>

              <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-[#25344D]">
                {seo.deepDiveContent
                  .trim()
                  .split("\n\n")
                  .map((block: string, idx: number) => {
                    if (block.startsWith("### ")) {
                      return (
                        <h3 key={idx} className="text-xl font-bold pt-4 text-[#0B1F3A]">
                          {block.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (block.startsWith("- ")) {
                      const items = block.split("\n").map((i: string) => i.replace(/^- /, ""));
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1">
                          {items.map((li: string, i: number) => (
                            <li key={i}>{renderInlineBold(li)}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx}>{renderInlineBold(block)}</p>;
                  })}
              </div>

              {seo.proTips && seo.proTips.length > 0 && (
                <div className="mt-8 rounded-2xl p-5 bg-[#FFF7E0] border border-[#FFE29A]">
                  <h3 className="flex items-center gap-2 text-[17px] font-bold">
                    <Lightbulb className="w-5 h-5 text-[#B7791F]" aria-hidden="true" /> Tips
                  </h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-[#25344D]">
                    {seo.proTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {seo.faqs && seo.faqs.length > 0 && (
            <section aria-labelledby="faq-heading" className="max-w-3xl">
              <h2 id="faq-heading" className="zq-display zq-h2">
                Questions about {tool.name}
              </h2>
              <div className="mt-6 space-y-3">
                {seo.faqs.map((faq, idx) => (
                  <details key={idx} className="zq-card group p-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <ChevronDown className="w-5 h-5 shrink-0 text-[#0E9F6E] transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#51607A]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {relatedTools.length > 0 && (
            <section aria-labelledby="related-heading">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="related-heading" className="zq-display zq-h2">
                  More tools in {catLabel}
                </h2>
                <Link href={`/category/${catSlug}`} className="inline-flex items-center gap-1 text-[15px] font-bold text-[#067A57]">
                  See all {catLabel} tools <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((rel) => (
                  <li key={rel.slug}>
                    <Link href={`/tools/${rel.slug}`} className="zq-card zq-card-hover group flex h-full items-start gap-3 p-4">
                      <span className={`zq-chip zq-chip-sm ${toolAccent.chip}`} aria-hidden="true">
                        <ToolIcon name={rel.icon} className="w-[18px] h-[18px]" strokeWidth={2} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold group-hover:text-[#067A57]">{rel.name}</span>
                        <span className="block mt-0.5 text-sm leading-relaxed text-[#51607A] line-clamp-2">{rel.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {popularTools.length > 0 && (
            <section aria-labelledby="popular-heading">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="popular-heading" className="zq-display zq-h2">
                  Popular tools
                </h2>
                <Link href="/tools" className="inline-flex items-center gap-1 text-[15px] font-bold text-[#067A57]">
                  Browse all tools <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularTools.map((pop) => (
                  <li key={pop.slug}>
                    <Link href={`/tools/${pop.slug}`} className="zq-card zq-card-hover flex h-full items-center gap-3 p-4 text-[15px] font-bold">
                      <span className="zq-chip zq-chip-sm zq-g-indigo" aria-hidden="true">
                        <ToolIcon name={pop.icon} className="w-[18px] h-[18px]" strokeWidth={2} />
                      </span>
                      {pop.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

// Tool page styling (matches the homepage tokens: ink #0B1F3A, line #E2E8F0, teal #0E9F6E).
const TP_FOCUS =
  "rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F3A]";
const TP_LINK = `hover:text-[#0B1F3A] hover:underline underline-offset-4 ${TP_FOCUS}`;
const TP_LINK_TEAL = `text-[#0E9F6E] underline underline-offset-[3px] decoration-1 hover:decoration-2 ${TP_FOCUS}`;
const TP_H2 = "text-2xl sm:text-[1.75rem] font-bold tracking-[-0.015em] leading-tight";

// The SEO copy uses **bold** markers; show them as bold instead of raw asterisks.
function renderInlineBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#0B1F3A]">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

// Display names for categories, same as the homepage and header.
const CATEGORY_LABELS: Record<string, string> = {
  "image-tools": "Images",
  "pdf-documents": "PDF",
  "developer-seo": "Developer & SEO",
  "text-code": "Text & code",
  "css-design": "CSS & design",
  calculators: "Calculators",
  "ai-tools": "AI tools",
};
