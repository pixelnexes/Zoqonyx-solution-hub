import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TOOLS } from "@/lib/default-tools";
import { ToolDrawer } from "@/components/home/tool-drawer";
import { ZQ_CSS } from "@/components/home/zq-styles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Free Online Tools Directory | Zoqonyx",
  },
  description:
    "Every free tool on Zoqonyx by category: merge PDFs, compress images, format JSON, generate CSS, preview SERP snippets and run calculators. No sign-up.",
  alternates: {
    canonical: "https://zoqonyx.com/tools",
  },
  openGraph: {
    title: "All Free Online Tools | Zoqonyx",
    description:
      "Every free tool on Zoqonyx by category: PDF, images, code, text, CSS and calculators. No sign-up, nothing to install.",
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
      where: { isActive: true, isComingSoon: false },
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

      <style>{ZQ_CSS}</style>

      <div className="zq-home">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-14">
        <div>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm" style={{ color: "var(--zq-muted)" }}>
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/" className="zq-focus rounded-[2px] hover:underline underline-offset-4">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium" style={{ color: "var(--zq-ink)" }}>
                All tools
              </li>
            </ol>
          </nav>

          <header className="max-w-[46rem] mb-8">
            <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.08] font-bold tracking-[-0.02em]">All tools</h1>
            <p className="mt-3 text-[17px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
              Every tool on Zoqonyx, by category. Search by name or by what you want to do.
            </p>
          </header>

          <ToolDrawer tools={tools} perCategory={Number.POSITIVE_INFINITY} />
        </div>

        {/* Below-the-fold Comprehensive SEO Guide */}
        <section aria-labelledby="faq-heading" className="max-w-[46rem]">
          <h2 id="faq-heading" className="text-2xl sm:text-[1.75rem] font-bold tracking-[-0.015em] leading-tight">
            Questions
          </h2>
          <div className="mt-5 border-t" style={{ borderColor: "var(--zq-line)" }}>
            {TOOLS_PAGE_FAQS.map((faq, i) => (
              <div key={i} className="py-4 border-b" style={{ borderColor: "var(--zq-line)" }}>
                <h3 className="text-[17px] font-semibold leading-snug">{faq.q}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>
    </>
  );
}
