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

  // Fallback if DB is empty or down
  const displayedTools =
    liveTools.length > 0
      ? liveTools
      : category.fallbackTools.map((t, idx) => ({
          id: `fallback-${t.slug}`,
          slug: t.slug,
          name: t.name,
          description: t.description,
          icon: t.icon,
          isComingSoon: !!t.isComingSoon,
          category: category.name,
          order: idx + 1,
        }));

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
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"
        >
          <Link href="/" className="hover:text-brand-cyan transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/#tools-catalog" className="hover:text-brand-cyan transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-bold">{category.name}</span>
        </nav>

        {/* Category Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-sm">
          {/* Ambient Glow */}
          <div
            className={`absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br ${category.heroGradient} blur-3xl opacity-70 pointer-events-none`}
          />

          <div className="relative z-10 space-y-5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 text-brand-cyan dark:text-cyan-400 shadow-inner">
                <ToolIcon name={category.icon} className="w-7 h-7" />
              </div>
              <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-brand-cyan/40 text-brand-cyan">
                {category.badge}
              </Badge>
              <Badge variant="secondary" className="text-xs px-3 py-1 font-medium">
                100% Free & Client-Side
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-foreground leading-tight">
              {category.name}
            </h1>

            <p className="text-lg sm:text-xl font-medium text-brand-cyan dark:text-cyan-400">
              {category.tagline}
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {category.description}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Account or Login Required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-cyan" /> 100% Private (No Cloud Storage)
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Instant Hardware Acceleration
              </span>
            </div>
          </div>
        </div>

        {/* Tools Catalog Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                Available Tools in {category.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Click any tool below to launch instantly in your web browser.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground">
              {displayedTools.length} {displayedTools.length === 1 ? "Tool" : "Tools"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedTools.map((tool) => (
              <Card
                key={tool.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-border/80 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan/50 hover:shadow-lg hover:shadow-brand-cyan/5"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan/15 to-brand-purple/15 text-brand-cyan dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                      <ToolIcon name={tool.icon} className="h-5 w-5" />
                    </div>

                    {tool.isComingSoon ? (
                      <Badge variant="secondary" className="text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                        Coming Soon
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px] font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                        Live Ready
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="font-heading text-lg font-bold group-hover:text-brand-cyan transition-colors">
                    <Link href={`/tools/${tool.slug}`} className="focus:outline-none">
                      {tool.name}
                    </Link>
                  </CardTitle>

                  <CardDescription className="text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                  <Link href={`/tools/${tool.slug}`} className="block">
                    <Button
                      variant={tool.isComingSoon ? "outline" : "gradient"}
                      size="sm"
                      className="w-full justify-between group/btn text-xs font-semibold"
                    >
                      <span>{tool.isComingSoon ? "View Preview & Notify" : "Launch Tool"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comprehensive SEO Content & Educational Guide */}
        <section className="space-y-10 rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm">
          {/* Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-cyan">
              <Sparkles className="w-4 h-4" />
              <span>Comprehensive Category Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
              About {category.name} on Zoqonyx
            </h2>
            <div className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line space-y-4">
              {category.longContent.overview}
            </div>
          </div>

          {/* Key Advantages Grid */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="text-xl font-heading font-bold text-foreground">
              Key Advantages & Architectural Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.longContent.keyBenefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-2 transition-all hover:bg-muted/50"
                >
                  <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{b.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Workflows */}
          {category.longContent.popularWorkflows.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border/60">
              <h3 className="text-xl font-heading font-bold text-foreground">
                Popular Workflows & Best Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {category.longContent.popularWorkflows.map((flow, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-6 rounded-2xl bg-card border border-border/80 space-y-3"
                  >
                    <h4 className="font-heading font-bold text-base text-brand-cyan">
                      {flow.title}
                    </h4>
                    <ol className="space-y-2 text-xs sm:text-sm text-muted-foreground list-decimal list-inside">
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
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3">
              <div
                dangerouslySetInnerHTML={{
                  __html: category.longContent.deepDiveArticle
                    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-heading font-bold text-foreground mt-6 mb-3">$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-heading font-black text-foreground mt-8 mb-4">$1</h2>')
                    .replace(/^\- (.*$)/gim, '<li class="list-disc ml-5 text-sm my-1">$1</li>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                    .replace(/\n\n/g, '<p class="text-sm leading-relaxed my-3">')
                    .replace(/\n/g, '<br />'),
                }}
              />
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section className="space-y-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-cyan">
              <HelpCircle className="w-4 h-4" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Common questions about {category.name} and how our tools work.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-border/60">
            {category.faqs.map((faq, fIdx) => (
              <div key={fIdx} className="pt-4 first:pt-0 space-y-2">
                <h3 className="font-heading font-bold text-base text-foreground flex items-start gap-2.5">
                  <span className="text-brand-cyan font-mono text-sm">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Other Categories */}
        <section className="space-y-4 pt-4">
          <h3 className="text-base font-heading font-bold text-foreground uppercase tracking-wider">
            Explore Other Tool Categories
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/category/${other.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/80 text-xs font-semibold text-muted-foreground hover:border-brand-cyan/50 hover:text-brand-cyan transition-all"
              >
                <ToolIcon name={other.icon} className="w-4 h-4" />
                <span>{other.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
