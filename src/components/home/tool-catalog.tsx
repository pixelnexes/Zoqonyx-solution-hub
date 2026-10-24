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
            placeholder="Search all 35+ tools (e.g. image compress, border radius, json, age)..."
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
                "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-brand-navy text-white dark:bg-brand-cyan dark:text-brand-navy border-transparent shadow-sm"
                  : "bg-card hover:bg-muted/80 text-muted-foreground hover:text-foreground border-border/60"
              )}
            >
              {cat}
            </button>
          );
        })}
        <button
          onClick={() => setSelectedCategory("Coming Soon")}
          className={cn(
            "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-1.5",
            selectedCategory === "Coming Soon"
              ? "bg-brand-purple text-white border-transparent shadow-sm"
              : "bg-card hover:bg-muted/80 text-brand-purple dark:text-purple-300 border-brand-purple/30"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </button>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
          <p className="text-lg font-heading font-semibold text-foreground">No tools matched your search</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Try adjusting your search terms or clearing category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 px-4 py-2 text-sm font-medium text-brand-cyan hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-xl"
            >
              <Card className="h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brand-cyan/60 bg-card/80">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-cyan/15 to-brand-purple/15 text-brand-cyan dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>

                    {tool.isComingSoon ? (
                      <Badge variant="comingSoon" className="gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>Coming Soon</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Free & Live</span>
                      </Badge>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {tool.category}
                    </span>
                    <CardTitle className="text-base font-heading group-hover:text-brand-cyan transition-colors mt-0.5 line-clamp-1">
                      {tool.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-xs line-clamp-2">
                    {tool.description}
                  </CardDescription>

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-brand-accent dark:text-brand-cyan group-hover:translate-x-0.5 transition-transform">
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
