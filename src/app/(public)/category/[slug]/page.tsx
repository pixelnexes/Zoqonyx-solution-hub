import { notFound } from "next/navigation";
import { PageHero } from "@/components/kit/page-kit";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ToolIcon } from "@/components/common/tool-icon";
import { categoryStyle } from "@/components/kit/icons";
import { prisma } from "@/lib/prisma";
import { getCategoryBySlug, getAllCategories } from "@/lib/categories";
import { DEFAULT_TOOLS } from "@/lib/default-tools";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | Zoqonyx Solution Hub",
      description: "Explore free online tools on Zoqonyx Solution Hub.",
    };
  }

  const title = category.metaTitle;
  const description = category.metaDesc;
  const url = `https://zoqonyx.com/category/${category.slug}`;

  // Thin category (no live tools yet): keep it out of the index.
  const liveCount = category.fallbackTools.filter(
    (t) => !t.isComingSoon && DEFAULT_TOOLS.some((d) => d.slug === t.slug && d.isActive)
  ).length;

  return {
    title: {
      absolute: category.metaTitle,
    },
    description,
    ...(liveCount === 0 ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Zoqonyx Solution Hub",
      images: [
        {
          url: "/logo/zoqonyx-og.png",
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo/zoqonyx-og.png"],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch live tools matching any dbCategories from Prisma
  let liveTools: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string | null;
    isComingSoon: boolean;
    category: string;
    order: number;
  }> = [];

  try {
    const dbResults = await prisma.tool.findMany({
      where: {
        isActive: true,
        isComingSoon: false,
        category: {
          in: category.dbCategories,
        },
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        isComingSoon: true,
        category: true,
        order: true,
      },
    });

    if (dbResults.length > 0) {
      liveTools = dbResults;
    }
  } catch (err) {
    console.error("Error fetching category tools from DB:", err);
  }

  // Merge DB tools with category fallback tools to guarantee full catalog visibility
  // Skip Coming Soon entries and tools that are de-listed in the catalog.
  const fallbackFormatted = category.fallbackTools
    .filter(
      (t) =>
        !t.isComingSoon &&
        DEFAULT_TOOLS.some((d) => d.slug === t.slug && d.isActive)
    )
    .map((t, idx) => ({
    id: `fallback-${t.slug}`,
    slug: t.slug,
    name: t.name,
    description: t.description,
    icon: t.icon,
    isComingSoon: !!t.isComingSoon,
    category: category.name,
    order: idx + 1,
  }));

  const canonicalMap = new Map(DEFAULT_TOOLS.map((t) => [t.slug, t]));
  liveTools = liveTools.map((t) => {
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

  const dbSlugs = new Set(liveTools.map((t) => t.slug));
  const missingFallback = fallbackFormatted.filter((t) => !dbSlugs.has(t.slug));

  // Also list every active catalog tool in this category, so the count matches
  // the homepage and the All tools page even when the DB has fewer rows.
  const shownSlugs = new Set([...dbSlugs, ...missingFallback.map((t) => t.slug)]);
  const missingCatalog = DEFAULT_TOOLS.filter(
    (t) =>
      t.isActive &&
      !t.isComingSoon &&
      category.dbCategories.includes(t.category) &&
      !shownSlugs.has(t.slug)
  ).map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    icon: t.icon,
    isComingSoon: false,
    category: t.category,
    order: 1000 + t.order,
  }));

  const displayedTools = [...liveTools, ...missingFallback, ...missingCatalog].sort((a, b) => a.order - b.order);

  // JSON-LD structured data for SEO (CollectionPage + ItemList + FAQPage)
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `https://zoqonyx.com/category/${category.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Zoqonyx Solution Hub",
      url: "https://zoqonyx.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: displayedTools.map((t, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: t.name,
        description: t.description,
        url: `https://zoqonyx.com/tools/${t.slug}`,
      })),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // Only link to categories that have at least one live tool.
  const otherCategories = getAllCategories().filter(
    (c) =>
      c.slug !== category.slug &&
      DEFAULT_TOOLS.some((t) => t.isActive && !t.isComingSoon && c.dbCategories.includes(t.category))
  );

  const { Icon: CatIcon, accent: catAccent } = categoryStyle(category.name);

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

      <div className="zq-page">
        <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "All tools", href: "/tools" }, { label: category.name }]} title={category.name} intro={category.description} />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section space-y-16">
          <section aria-labelledby="tools-heading">
            <h2 id="tools-heading" className="zq-display zq-h2">
              Tools
            </h2>
            {displayedTools.length === 0 ? (
              <p className="mt-5 text-[16px] text-[#4F5B57]">
                No tools are live in this category yet.{" "}
                <Link href="/tools" className="font-bold text-[#0A5E44] underline underline-offset-4">
                  Browse all tools
                </Link>
              </p>
            ) : (
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={`/tools/${tool.slug}`} className="zq-card zq-card-hover group flex h-full items-start gap-3 p-4">
                      <span className={`zq-chip zq-chip-sm ${catAccent.chip}`} aria-hidden="true">
                        <ToolIcon name={tool.icon} className="w-[18px] h-[18px]" strokeWidth={2} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[16px] font-bold group-hover:text-[#0A5E44]">{tool.name}</span>
                        <span className="block mt-0.5 text-sm leading-relaxed text-[#4F5B57] line-clamp-2">{tool.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="about-heading" className="max-w-3xl">
            <h2 id="about-heading" className="zq-display zq-h2">
              About {category.name}
            </h2>
            <div className="mt-5 text-[16px] leading-[1.75] text-[#2B3633] whitespace-pre-line">{category.longContent.overview}</div>

            {category.longContent.keyBenefits.length > 0 && (
              <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.longContent.keyBenefits.map((b, idx) => (
                  <div key={idx} className="zq-card p-5" style={{ borderTop: `3px solid ${catAccent.color}` }}>
                    <dt className="text-[17px] font-bold">{b.title}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-[#4F5B57]">{b.desc}</dd>
                  </div>
                ))}
              </dl>
            )}

            {category.longContent.popularWorkflows.length > 0 && (
              <div className="mt-10 space-y-8">
                {category.longContent.popularWorkflows.map((flow, fIdx) => (
                  <div key={fIdx}>
                    <h3 className="text-xl font-bold">{flow.title}</h3>
                    <ol className="mt-3 list-decimal pl-6 space-y-1.5 text-[15px] leading-relaxed text-[#2B3633]">
                      {flow.steps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}

            <div
              className="mt-10 text-[16px] leading-[1.75] text-[#2B3633]"
              dangerouslySetInnerHTML={{
                __html: category.longContent.deepDiveArticle
                  .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-[#10181A] mt-8 mb-2">$1</h3>')
                  .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#10181A] mt-10 mb-3">$1</h2>')
                  .replace(/^\- (.*$)/gim, '<li class="list-disc ml-6 my-1">$1</li>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#10181A] font-semibold">$1</strong>')
                  .replace(/\n\n/g, '<p class="my-4">')
                  .replace(/\n/g, "<br />"),
              }}
            />
          </section>

          {category.faqs.length > 0 && (
            <section aria-labelledby="faq-heading" className="max-w-3xl">
              <h2 id="faq-heading" className="zq-display zq-h2">
                Questions about {category.name}
              </h2>
              <div className="mt-6 space-y-3">
                {category.faqs.map((faq, fIdx) => (
                  <details key={fIdx} className="zq-card group p-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <ChevronDown className="w-5 h-5 shrink-0 text-[#0E7C5A] transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#4F5B57]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="other-heading">
            <h2 id="other-heading" className="zq-display zq-h2">
              Other categories
            </h2>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherCategories.map((other) => {
                const o = categoryStyle(other.name);
                return (
                  <li key={other.slug}>
                    <Link href={`/category/${other.slug}`} className="zq-card zq-card-hover flex items-center gap-3 p-4 text-[16px] font-bold">
                      <span className={`zq-chip zq-chip-sm ${o.accent.chip}`} aria-hidden="true">
                        <o.Icon className="w-[18px] h-[18px]" />
                      </span>
                      {other.name}
                      <ArrowRight className="ml-auto w-4 h-4 text-[#0E7C5A]" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
