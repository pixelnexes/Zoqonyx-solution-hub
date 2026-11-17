import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { ComingSoonToolView } from "@/components/tools/coming-soon-tool-view";
import Link from "next/link";
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

      <div className="bg-[#F3F5F8] text-[#14213D]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#4A5568]">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className={TP_LINK}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/category/${catSlug}`} className={TP_LINK}>
                {catLabel}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#14213D] font-medium">
              {tool.name}
            </li>
          </ol>
        </nav>

        <div className="space-y-14">
          <div className="space-y-6">
            <header className="max-w-[46rem]">
              <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.08] font-bold tracking-[-0.02em]">
                {tool.name}
              </h1>
              <p className="mt-3 text-[17px] leading-relaxed text-[#4A5568]">{tool.description}</p>
              <p className="mt-2 text-sm text-[#4A5568]">Free to use. No sign-up.</p>
            </header>

            {/* The tool itself */}
            <div className="p-4 sm:p-6 rounded-[6px] bg-white border border-[#D5DCE4]">
              <ToolRenderer slug={tool.slug} />
            </div>
          </div>

            {/* How to use: a real sequence, so numbered */}
            <section aria-labelledby="howto-heading" className="max-w-[46rem]">
              <h2 id="howto-heading" className={TP_H2}>
                How to use {tool.name}
              </h2>
              <ol className="mt-5 border-t border-[#D5DCE4]">
                {seo.howToSteps.map((s) => (
                  <li key={s.step} className="grid grid-cols-[2rem_1fr] gap-x-3 py-4 border-b border-[#D5DCE4]">
                    <span className="text-lg font-bold tabular-nums leading-snug">{s.step}.</span>
                    <div>
                      <h3 className="text-[17px] font-semibold leading-snug">{s.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-[#4A5568]">{s.instruction}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {seo.keyBenefits.length > 0 && (
              <section aria-labelledby="features-heading">
                <h2 id="features-heading" className={TP_H2}>
                  What {tool.name} does
                </h2>
                <dl className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-[#D5DCE4]">
                  {seo.keyBenefits.map((b, idx) => (
                    <div key={idx} className="py-4 border-b border-[#D5DCE4]">
                      <dt className="text-[17px] font-semibold">{b.title}</dt>
                      <dd className="mt-1 text-[15px] leading-relaxed text-[#4A5568]">{b.desc}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Section 3: In-Depth Technical Guide & Deep Dive */}
            {seo.deepDiveContent && (
              <section aria-labelledby="about-heading" className="max-w-[46rem]">
                <h2 id="about-heading" className={TP_H2}>
                  About {tool.name}
                </h2>

                <div className="mt-5 space-y-4 text-[16px] leading-[1.7] text-[#2D3748]">
                  {seo.deepDiveContent
                    .trim()
                    .split("\n\n")
                    .map((block: string, idx: number) => {
                      if (block.startsWith("### ")) {
                        return (
                          <h3
                            key={idx}
                            className="text-xl font-bold pt-4 text-[#14213D]"
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
                              <li key={i}>{renderInlineBold(li)}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx}>{renderInlineBold(block)}</p>;
                    })}
                </div>

                {/* Pro Tips Box */}
                {seo.proTips && seo.proTips.length > 0 && (
                  <div className="mt-8 pl-4 border-l-4 border-[#F2C230]">
                    <h3 className="text-[17px] font-semibold">Tips</h3>
                    <ul className="mt-2 list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-[#2D3748]">
                      {seo.proTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Section 4: Frequently Asked Questions (FAQs) */}
            {seo.faqs && seo.faqs.length > 0 && (
              <section aria-labelledby="faq-heading" className="max-w-[46rem]">
                <h2 id="faq-heading" className={TP_H2}>
                  Questions about {tool.name}
                </h2>
                <div className="mt-5 border-t border-[#D5DCE4]">
                  {seo.faqs.map((faq, idx) => (
                    <div key={idx} className="py-4 border-b border-[#D5DCE4]">
                      <h3 className="text-[17px] font-semibold leading-snug">{faq.question}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[#4A5568]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 5: Related Tools in Same Category */}
            {relatedTools.length > 0 && (
              <section aria-labelledby="related-heading">
                <div className="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b-2 border-[#14213D]">
                  <h2 id="related-heading" className={TP_H2}>
                    More tools in {catLabel}
                  </h2>
                  <Link href={`/category/${catSlug}`} className={`text-[15px] font-semibold ${TP_LINK_TEAL}`}>
                    See all {catLabel} tools
                  </Link>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
                  {relatedTools.map((rel) => (
                    <li key={rel.slug} className="border-b border-[#D5DCE4]">
                      <Link href={`/tools/${rel.slug}`} className={`block py-3 hover:bg-white ${TP_FOCUS}`}>
                        <span className="block text-[15px] font-semibold">{rel.name}</span>
                        <span className="block mt-0.5 text-sm leading-relaxed text-[#4A5568] line-clamp-2">
                          {rel.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Section 6: Popular Tools Across Platform */}
            {popularTools.length > 0 && (
              <section aria-labelledby="popular-heading">
                <div className="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b-2 border-[#14213D]">
                  <h2 id="popular-heading" className={TP_H2}>
                    Popular tools
                  </h2>
                  <Link href="/tools" className={`text-[15px] font-semibold ${TP_LINK_TEAL}`}>
                    Browse all tools
                  </Link>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10">
                  {popularTools.map((pop) => (
                    <li key={pop.slug} className="border-b border-[#D5DCE4]">
                      <Link href={`/tools/${pop.slug}`} className={`block py-3 text-[15px] font-semibold hover:bg-white ${TP_FOCUS}`}>
                        {pop.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
        </div>
      </div>
      </div>
    </>
  );
}

// Tool page styling (matches the homepage tokens: ink #14213D, line #D5DCE4, teal #0F766E).
const TP_FOCUS =
  "rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D]";
const TP_LINK = `hover:text-[#14213D] hover:underline underline-offset-4 ${TP_FOCUS}`;
const TP_LINK_TEAL = `text-[#0F766E] underline underline-offset-[3px] decoration-1 hover:decoration-2 ${TP_FOCUS}`;
const TP_H2 = "text-2xl sm:text-[1.75rem] font-bold tracking-[-0.015em] leading-tight";

// The SEO copy uses **bold** markers; show them as bold instead of raw asterisks.
function renderInlineBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#14213D]">
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
