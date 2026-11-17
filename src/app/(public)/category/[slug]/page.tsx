import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
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

      <div className="bg-[#F3F5F8] text-[#14213D]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-14">
        <nav aria-label="Breadcrumb" className="text-sm text-[#4A5568]">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className={CP_LINK}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/tools" className={CP_LINK}>
                All tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#14213D] font-medium">
              {category.name}
            </li>
          </ol>
        </nav>

        <header className="max-w-[46rem] -mt-6">
          <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.08] font-bold tracking-[-0.02em]">
            {category.name}
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#4A5568]">{category.description}</p>
          <p className="mt-2 text-sm text-[#4A5568]">
            {displayedTools.length} {displayedTools.length === 1 ? "tool" : "tools"}. Free to use, no sign-up.
          </p>
        </header>

        {/* Tools Catalog Section */}
        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className={`${CP_H2} pb-2 border-b-2 border-[#14213D]`}>
            Tools
          </h2>
          {displayedTools.length === 0 ? (
            <p className="mt-5 text-[16px] text-[#4A5568]">
              No tools are live in this category yet.{" "}
              <Link href="/tools" className={CP_LINK_TEAL}>
                Browse all tools
              </Link>
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {displayedTools.map((tool) => (
                <li key={tool.slug} className="border-b border-[#D5DCE4]">
                  <Link href={`/tools/${tool.slug}`} className={`block py-3.5 hover:bg-white ${CP_FOCUS}`}>
                    <span className="block text-[16px] font-semibold">{tool.name}</span>
                    <span className="block mt-0.5 text-sm leading-relaxed text-[#4A5568] line-clamp-2">
                      {tool.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Comprehensive SEO Content & Educational Guide */}
        <section aria-labelledby="about-heading" className="max-w-[46rem]">
          <h2 id="about-heading" className={CP_H2}>
            About {category.name}
          </h2>
          <div className="mt-5 text-[16px] leading-[1.7] text-[#2D3748] whitespace-pre-line">
            {category.longContent.overview}
          </div>

          {category.longContent.keyBenefits.length > 0 && (
            <dl className="mt-8 border-t border-[#D5DCE4]">
              {category.longContent.keyBenefits.map((b, idx) => (
                <div key={idx} className="py-4 border-b border-[#D5DCE4]">
                  <dt className="text-[17px] font-semibold">{b.title}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#4A5568]">{b.desc}</dd>
                </div>
              ))}
            </dl>
          )}

          {category.longContent.popularWorkflows.length > 0 && (
            <div className="mt-10 space-y-8">
              {category.longContent.popularWorkflows.map((flow, fIdx) => (
                <div key={fIdx}>
                  <h3 className="text-xl font-bold">{flow.title}</h3>
                  <ol className="mt-3 list-decimal pl-6 space-y-1.5 text-[15px] leading-relaxed text-[#2D3748]">
                    {flow.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          <div
            className="mt-10 text-[16px] leading-[1.7] text-[#2D3748]"
            dangerouslySetInnerHTML={{
              __html: category.longContent.deepDiveArticle
                .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-[#14213D] mt-8 mb-2">$1</h3>')
                .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#14213D] mt-10 mb-3">$1</h2>')
                .replace(/^\- (.*$)/gim, '<li class="list-disc ml-6 my-1">$1</li>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#14213D] font-semibold">$1</strong>')
                .replace(/\n\n/g, '<p class="my-4">')
                .replace(/\n/g, "<br />"),
            }}
          />
        </section>

        {category.faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className="max-w-[46rem]">
            <h2 id="faq-heading" className={CP_H2}>
              Questions about {category.name}
            </h2>
            <div className="mt-5 border-t border-[#D5DCE4]">
              {category.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="py-4 border-b border-[#D5DCE4]">
                  <h3 className="text-[17px] font-semibold leading-snug">{faq.question}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#4A5568]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="other-heading">
          <h2 id="other-heading" className={`${CP_H2} pb-2 border-b-2 border-[#14213D]`}>
            Other categories
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
            {otherCategories.map((other) => (
              <li key={other.slug} className="border-b border-[#D5DCE4]">
                <Link href={`/category/${other.slug}`} className={`block py-3 text-[16px] font-semibold hover:bg-white ${CP_FOCUS}`}>
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      </div>
    </>
  );
}

// Category page styling (same tokens as the homepage and tool pages).
const CP_FOCUS =
  "rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D]";
const CP_LINK = `hover:text-[#14213D] hover:underline underline-offset-4 ${CP_FOCUS}`;
const CP_LINK_TEAL = `text-[#0F766E] underline underline-offset-[3px] decoration-1 hover:decoration-2 ${CP_FOCUS}`;
const CP_H2 = "text-2xl sm:text-[1.75rem] font-bold tracking-[-0.015em] leading-tight";
