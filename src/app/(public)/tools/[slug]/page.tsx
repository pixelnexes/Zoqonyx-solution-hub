import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { ComingSoonToolView } from "@/components/tools/coming-soon-tool-view";
import { ToolIcon } from "@/components/common/tool-icon";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tool = await prisma.tool.findUnique({
      where: { slug },
    });

    if (!tool) {
      return {
        title: "Tool Not Found | Zoqonyx Solution Hub",
      };
    }

    const title = tool.metaTitle || `${tool.name} | Zoqonyx Solution Hub`;
    const description = tool.metaDesc || tool.description;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://zoqonyx.com/tools/${slug}`,
        siteName: "Zoqonyx Solution Hub",
        images: [
          {
            url: "/logo/zoqonyx-logo.png",
            width: 1200,
            height: 630,
            alt: tool.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/logo/zoqonyx-logo.png"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for tool:", error);
    return {
      title: "Online Tool | Zoqonyx Solution Hub",
      description: "Fast, private, client-side digital utility.",
    };
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  let tool = null;
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
        take: 3,
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

  if (!tool) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://zoqonyx.com/tools/${tool.slug}`,
    applicationCategory: tool.category,
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Breadcrumb / Back link */}
        <div className="mb-6">
          <Link
            href="/#tools-catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Tools</span>
          </Link>
        </div>

        {/* State A: Coming Soon Tool */}
        {tool.isComingSoon ? (
          <ComingSoonToolView tool={tool} relatedTools={relatedTools} />
        ) : (
          /* State B: Live Interactive Tool */
          <div className="space-y-10">
            {/* Tool Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 text-brand-cyan dark:text-cyan-400">
                    <ToolIcon name={tool.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {tool.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
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

              <p className="text-sm text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Runs in your browser
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-brand-cyan" /> Zero data stored
                </span>
              </div>
            </div>

            {/* Interactive Tool Workstation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm">
              <ToolRenderer slug={tool.slug} />
            </div>

            {/* Below-the-fold Rich SEO Content & Guides */}
            {tool.content && (
              <div className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 space-y-6">
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-4 leading-relaxed">
                  {tool.content.split("\n\n").map((block, idx) => {
                    if (block.startsWith("## ")) {
                      return (
                        <h2 key={idx} className="text-xl sm:text-2xl font-heading font-bold text-foreground pt-4 border-b pb-2">
                          {block.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (block.startsWith("### ")) {
                      return (
                        <h3 key={idx} className="text-lg font-heading font-semibold text-foreground pt-3">
                          {block.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (block.startsWith("- ")) {
                      const listItems = block.split("\n").map((item) => item.replace(/^- /, ""));
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1">
                          {listItems.map((li, i) => (
                            <li key={i}>{li}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx}>{block}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Explore More {tool.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedTools.map((rel) => (
                    <Link key={rel.slug} href={`/tools/${rel.slug}`} className="group">
                      <div className="p-4 rounded-xl bg-card border border-border/80 hover:border-brand-cyan/60 transition-all space-y-1.5">
                        <div className="flex items-center gap-2">
                          <ToolIcon name={rel.icon} className="w-4 h-4 text-brand-cyan" />
                          <span className="font-heading font-semibold text-sm group-hover:text-brand-cyan transition-colors">
                            {rel.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {rel.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
