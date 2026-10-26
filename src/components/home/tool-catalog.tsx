"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight, CheckCircle2, Clock, Zap, Shield, Sparkles } from "lucide-react";
import { ToolIcon } from "@/components/common/tool-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SerializedTool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  isComingSoon: boolean;
  icon: string | null;
  order: number;
}

interface ToolCatalogProps {
  initialTools: SerializedTool[];
}

export function ToolCatalog({ initialTools }: ToolCatalogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  // Extract unique categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    initialTools.forEach((t) => {
      if (t.isActive) set.add(t.category);
    });
    return ["All", ...Array.from(set)];
  }, [initialTools]);

  // Filter tools based on query and category
  const filteredTools = React.useMemo(() => {
    return initialTools.filter((tool) => {
      if (!tool.isActive) return false;

      const matchesCategory =
        selectedCategory === "All"
          ? true
          : selectedCategory === "Coming Soon"
          ? tool.isComingSoon
          : tool.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [initialTools, searchQuery, selectedCategory]);

  return (
    <section id="tools-catalog" className="w-full space-y-6 scroll-mt-20">
      {/* Search & Filters Command Bar (Linear style) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-border shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search 113+ free tools (e.g. merge pdf, bulk compress, jwt, regex, emi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-background/90 text-sm rounded-lg border-border focus-visible:ring-1 focus-visible:ring-teal-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-mono font-medium"
            >
              ESC / Clear
            </button>
          )}
        </div>

        {/* Counter Pill */}
        <div className="shrink-0 text-xs font-mono text-muted-foreground self-center md:self-auto px-3 py-1.5 rounded-lg bg-muted/40 border border-border/60">
          Showing <span className="font-bold text-foreground">{filteredTools.length}</span> of {initialTools.length} tools
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all border font-sans",
                isSelected
                  ? "bg-teal-600 text-white border-teal-500 shadow-xs font-semibold"
                  : "bg-card/70 hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
              )}
            >
              {cat}
            </button>
          );
        })}
        <button
          onClick={() => setSelectedCategory("Coming Soon")}
          className={cn(
            "whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 font-sans",
            selectedCategory === "Coming Soon"
              ? "bg-amber-600 text-white border-amber-500 shadow-xs font-semibold"
              : "bg-card/70 hover:bg-muted text-amber-400 border-border/80"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </button>
      </div>

      {/* Dedicated Category Link Banner */}
      {selectedCategory !== "All" && selectedCategory !== "Coming Soon" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-card/60 border border-border">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider font-mono">Category Documentation</p>
            <p className="text-xs sm:text-sm font-medium text-foreground">
              In-depth engineering workflows, Core Web Vitals optimization, and technical FAQs for {selectedCategory}.
            </p>
          </div>
          <Link
            href={`/category/${
              selectedCategory.toLowerCase().includes("image")
                ? "image-tools"
                : selectedCategory.toLowerCase().includes("css") || selectedCategory.toLowerCase().includes("design")
                ? "css-design"
                : selectedCategory.toLowerCase().includes("text") || selectedCategory.toLowerCase().includes("code")
                ? "text-code"
                : selectedCategory.toLowerCase().includes("seo") || selectedCategory.toLowerCase().includes("developer")
                ? "developer-seo"
                : selectedCategory.toLowerCase().includes("calc")
                ? "calculators"
                : selectedCategory.toLowerCase().includes("pdf")
                ? "pdf-documents"
                : selectedCategory.toLowerCase().includes("ai")
                ? "ai-tools"
                : "image-tools"
            }`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400 hover:bg-teal-500/20 transition-all shrink-0"
          >
            <span>Read {selectedCategory} Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Tools Grid - Linear / Squoosh / Vercel style */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/10">
          <p className="text-sm font-semibold text-foreground">No tools found matching your query</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Try searching for related keywords or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-3 px-3 py-1.5 text-xs font-mono font-medium text-teal-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded-xl block h-full"
            >
              <Card className="h-full flex flex-col justify-between p-4 rounded-xl border border-border/80 bg-card hover:border-teal-500/50 hover:bg-muted/20 transition-all duration-150 shadow-xs hover:-translate-y-0.5">
                <div className="space-y-3">
                  {/* Top row: Icon + Status Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-black transition-colors shrink-0">
                      <ToolIcon name={tool.icon} className="w-4 h-4" />
                    </div>

                    {tool.isComingSoon ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5" /> Soon
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground/80 border border-border/60 bg-muted/30 shrink-0">
                        {tool.category}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-teal-400 transition-colors line-clamp-1 leading-snug">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed font-normal">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Micro-tag + Action arrow */}
                <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-muted-foreground/70 flex items-center gap-1 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400/80" />
                    {tool.isComingSoon ? "Roadmap" : "Client-Side"}
                  </span>

                  <span className="inline-flex items-center gap-1 font-semibold text-teal-400 group-hover:translate-x-0.5 transition-transform">
                    <span>{tool.isComingSoon ? "Notify" : "Open"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}