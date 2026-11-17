import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ToolDrawer } from "@/components/home/tool-drawer";
import { ZQ_CSS } from "@/components/home/zq-styles";
import type { Metadata } from "next";

import { DEFAULT_TOOLS } from "@/lib/default-tools";

export const metadata: Metadata = {
  title: {
    absolute: "Free Online Tools for Images, PDF, Code & Text | Zoqonyx",
  },
  description:
    "Free tools to compress images, merge PDFs, format JSON, generate CSS and calculate values. Most run in your browser, so your files stay on your device. No sign-up.",
  alternates: {
    canonical: "https://zoqonyx.com",
  },
};

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
    console.error("Error fetching tools for homepage:", error);
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

    // Merge: ensure all catalog tools are always displayed even if DB has fewer rows
    const dbSlugs = new Set(tools.map((t) => t.slug));
    const missing = defaultToolsFormatted.filter((t) => !dbSlugs.has(t.slug));
    tools = [...tools, ...missing].sort((a, b) => a.order - b.order);
  }

  const liveCount = new Set(tools.filter((t) => t.isActive && !t.isComingSoon).map((t) => t.slug)).size;

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

      <style>{ZQ_CSS}</style>

      <div className="zq-home">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16">
          <header className="max-w-[46rem] mb-8 sm:mb-10">
            <h1 className="text-[2.25rem] sm:text-[3.25rem] leading-[1.05] font-bold tracking-[-0.025em]" style={{ color: "var(--zq-ink)" }}>
              Free tools for images, PDFs, code and text.
            </h1>
            <p className="mt-4 text-[17px] sm:text-lg leading-relaxed max-w-[38rem]" style={{ color: "var(--zq-muted)" }}>
              Open a tool and use it. No sign-up, no account. Most tools run in your browser, so the files you add stay on your device.
            </p>
          </header>

          <div>
            <ToolDrawer tools={tools} />
          </div>

          <p className="mt-16 pt-6 border-t text-sm leading-relaxed max-w-[42rem]" style={{ borderColor: "var(--zq-line)", color: "var(--zq-muted)" }}>
            Image, PDF and text tools process files in your browser. A few network tools, like DNS lookup, query a public service.{" "}
            <Link href="/tools" className="zq-focus zq-link font-semibold rounded-[2px]">
              Browse all {liveCount} tools
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

