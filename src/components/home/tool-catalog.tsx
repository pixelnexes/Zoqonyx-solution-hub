"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Sparkles, ArrowRight, Zap, CheckCircle2, Clock } from "lucide-react";
import { ToolIcon } from "@/components/common/tool-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
    <section id="tools-catalog" className="w-full py-8 space-y-8 scroll-mt-20">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-border/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search 100+ free tools (e.g. merge pdf, bulk compress, jwt, regex, emi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-background/80 text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Counter Pill */}
        <div className="shrink-0 text-xs font-medium text-muted-foreground self-center md:self-auto px-3 py-1.5 rounded-full bg-muted/60">
          Showing <span className="font-bold text-foreground">{filteredTools.length}</span> of {initialTools.length} tools
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
                isSelected
                  ? "bg-teal-600 text-white border-teal-500 shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
              )}
            >
              {cat}
            </button>
          );
        })}
        <button
          onClick={() => setSelectedCategory("Coming Soon")}
          className={cn(
            "whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5",
            selectedCategory === "Coming Soon"
              ? "bg-amber-600 text-white border-amber-500 shadow-xs"
              : "bg-card hover:bg-muted text-amber-400 border-border"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </button>
      </div>

      {/* Dedicated Category Banner */}
      {selectedCategory !== "All" &&
        selectedCategory !== "Coming Soon" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider font-mono">Category Hub</p>
              <p className="text-sm font-semibold text-foreground">
                In-depth guides, technical FAQs, and advanced workflows for {selectedCategory}.
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400 hover:bg-teal-500/20 transition-all shrink-0"
            >
              <span>Explore {selectedCategory} Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/10">
          <p className="text-base font-semibold text-foreground">No tools matched your search</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Try adjusting your search terms or clearing category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-3 px-3 py-1.5 text-xs font-medium text-teal-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded-xl block"
            >
              <Card className="h-full flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:border-teal-500/50 bg-card rounded-xl border border-border">
                <CardHeader className="space-y-3 pb-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <ToolIcon name={tool.icon} className="w-4 h-4" />
                    </div>

                    {tool.isComingSoon ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Coming Soon
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Free
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {tool.category}
                    </span>
                    <CardTitle className="text-sm font-bold group-hover:text-teal-400 transition-colors mt-0.5 line-clamp-1">
                      {tool.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <CardDescription className="text-xs line-clamp-2 text-muted-foreground">
                    {tool.description}
                  </CardDescription>

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:translate-x-0.5 transition-transform">
                    <span>{tool.isComingSoon ? "Preview Roadmap" : "Launch Tool"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
