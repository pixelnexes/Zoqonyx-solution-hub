import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryBySlug, getAllCategories } from "@/lib/categories";
import { ToolIcon } from "@/components/common/tool-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  HelpCircle,
  Layers,
  ChevronRight,
} from "lucide-react";
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

  return {
    title: {
      absolute: category.metaTitle,
    },
    description,
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
  const fallbackFormatted = category.fallbackTools.map((t, idx) => ({
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
  const displayedTools = [...liveTools, ...missingFallback].sort((a, b) => a.order - b.order);

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

  const otherCategories = getAllCategories().filter((c) => c.slug !== category.slug);

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

      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-medium text-slate-500"
        >
          <Link href="/" className="hover:text-teal-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/#tools-catalog" className="hover:text-teal-700 transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-slate-900 font-bold">{category.name}</span>
        </nav>

        {/* Category Hero Section */}
        <div className="relative overflow-hidden rounded-[8px] border border-border/80 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="relative z-10 space-y-5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 rounded-[8px] bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ToolIcon name={category.icon} className="w-6 h-6" />
              </div>
              <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-teal-500/40 text-teal-400 font-mono">
                {category.badge}
              </Badge>
              <Badge variant="secondary" className="text-xs px-3 py-1 font-medium">
                100% Free & Client-Side
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black tracking-tight text-slate-900 leading-tight">
              {category.name}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-teal-700">
              {category.tagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {category.description}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Account or Login Required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> 100% Private (No Cloud Storage)
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Instant Hardware Acceleration
              </span>
            </div>
          </div>
        </div>

        {/* Tools Catalog Section */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                Available Tools in {category.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Click any tool below to launch instantly in your web browser.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-md bg-muted/60 text-slate-500 border border-border/60">
              {displayedTools.length} {displayedTools.length === 1 ? "Tool" : "Tools"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTools.map((tool) => (
              <Card
                key={tool.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[8px] border-border/80 bg-white/60 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/50 shadow-sm"
              >
                <CardHeader className="space-y-2.5 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-teal-500/10 text-teal-400 border border-teal-500/20 transition-transform duration-200 group-hover:scale-105">
                      <ToolIcon name={tool.icon} className="h-5 w-5" />
                    </div>

                    {tool.isComingSoon ? (
                      <Badge variant="secondary" className="text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border-amber-500/30">
                        DEV STAGE
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-mono font-medium border-emerald-500/30 text-emerald-400">
                        READY
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="font-heading text-base font-bold group-hover:text-teal-400 transition-colors">
                    <Link href={`/tools/${tool.slug}`} className="focus:outline-none">
                      {tool.name}
                    </Link>
                  </CardTitle>

                  <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                  <Link href={`/tools/${tool.slug}`} className="block">
                    <Button
                      variant={tool.isComingSoon ? "outline" : "default"}
                      size="sm"
                      className={`w-full justify-between group/btn text-xs font-semibold rounded-md ${
                        tool.isComingSoon
                          ? "hover:border-teal-500/50 hover:text-teal-400"
                          : "bg-teal-500 hover:bg-teal-400 text-slate-950"
                      }`}
                    >
                      <span>{tool.isComingSoon ? "Preview & Notify" : "Launch Tool"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comprehensive SEO Content & Educational Guide */}
        <section className="space-y-8 rounded-[8px] border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
          {/* Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CATEGORY ARCHITECTURE & GUIDE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              About {category.name} on Zoqonyx
            </h2>
            <div className="text-sm text-slate-500 leading-relaxed whitespace-pre-line space-y-4">
              {category.longContent.overview}
            </div>
          </div>

          {/* Key Advantages Grid */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Key Advantages & Architectural Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.longContent.keyBenefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[8px] bg-muted/20 border border-border/60 space-y-2 transition-all hover:border-teal-500/40"
                >
                  <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{b.title}</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed pl-6">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Workflows */}
          {category.longContent.popularWorkflows.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border/60">
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Popular Workflows & Best Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.longContent.popularWorkflows.map((flow, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-5 rounded-[8px] bg-white border border-border/80 space-y-2.5"
                  >
                    <h4 className="font-heading font-bold text-sm text-teal-400">
                      {flow.title}
                    </h4>
                    <ol className="space-y-1.5 text-xs text-slate-500 list-decimal list-inside">
                      {flow.steps.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deep-Dive Editorial Article */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-500 leading-relaxed space-y-3">
              <div
                dangerouslySetInnerHTML={{
                  __html: category.longContent.deepDiveArticle
                    .replace(/^### (.*$)/gim, '<h3 class="text-base font-heading font-bold text-slate-900 mt-5 mb-2">$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-heading font-black text-slate-900 mt-6 mb-3">$1</h2>')
                    .replace(/^\- (.*$)/gim, '<li class="list-disc ml-5 text-xs sm:text-sm my-1">$1</li>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                    .replace(/\n\n/g, '<p class="text-xs sm:text-sm leading-relaxed my-2.5">')
                    .replace(/\n/g, '<br />'),
                }}
              />
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section className="space-y-6 rounded-[8px] border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">
              Common questions about {category.name} and how our tools work.
            </p>
          </div>

          <div className="space-y-3 divide-y divide-border/60">
            {category.faqs.map((faq, fIdx) => (
              <div key={fIdx} className="pt-3 first:pt-0 space-y-1.5">
                <h3 className="font-heading font-bold text-sm text-slate-900 flex items-start gap-2">
                  <span className="text-teal-400 font-mono text-xs">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Other Categories */}
        <section className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Explore Other Tool Categories
          </h3>
          <div className="flex flex-wrap items-center gap-2.5">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/category/${other.slug}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-white border border-border/80 text-xs font-semibold text-slate-500 hover:border-teal-500/50 hover:text-teal-400 transition-all"
              >
                <ToolIcon name={other.icon} className="w-3.5 h-3.5" />
                <span>{other.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
