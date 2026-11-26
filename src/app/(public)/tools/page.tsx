import type { Metadata } from "next";
import { PageHero } from "@/components/kit/page-kit";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TOOLS, TOOL_ALIASES } from "@/lib/default-tools";
import { isLiveToolSlug } from "@/lib/utils";
import { ToolDrawer } from "@/components/home/tool-drawer";

export const revalidate = 300;

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
  const isLive = (slug: string) => isLiveToolSlug(slug, DEFAULT_TOOLS, TOOL_ALIASES);

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
  // Hide alias tools (their URLs redirect) and inactive ones, so the directory links only live pages.
  tools = tools.filter((t) => isLive(t.slug));

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

      <div className="zq-page">
        <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "All tools" }]} title="All free tools" intro="Every tool on Zoqonyx, by category. Search by name or by what you want to do. No sign-up needed." image="/photos/u-dev.webp" />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section space-y-16">
          <ToolDrawer tools={tools} perCategory={Number.POSITIVE_INFINITY} detailed />

          <section aria-labelledby="faq-heading" className="max-w-3xl">
            <h2 id="faq-heading" className="zq-display zq-h2">
              Questions
            </h2>
            <div className="mt-6 space-y-3">
              {TOOLS_PAGE_FAQS.map((faq, i) => (
                <details key={i} className="zq-card group p-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 shrink-0 text-[#7C3AED] transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#5B6270]">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
