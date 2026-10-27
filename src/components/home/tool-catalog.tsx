"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight, Clock, ShieldCheck, Zap } from "lucide-react";
import { ToolIcon } from "@/components/common/tool-icon";
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

const CATEGORY_THEMES: Record<
  string,
  {
    badge: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  "Image Tools": {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200/90",
    iconBg: "bg-emerald-100/80 border-emerald-200",
    iconColor: "text-emerald-700",
  },
  "CSS & Design": {
    badge: "bg-indigo-50 text-indigo-800 border-indigo-200/90",
    iconBg: "bg-indigo-100/80 border-indigo-200",
    iconColor: "text-indigo-700",
  },
  "Text & Code": {
    badge: "bg-sky-50 text-sky-800 border-sky-200/90",
    iconBg: "bg-sky-100/80 border-sky-200",
    iconColor: "text-sky-700",
  },
  "Developer & SEO": {
    badge: "bg-blue-50 text-blue-800 border-blue-200/90",
    iconBg: "bg-blue-100/80 border-blue-200",
    iconColor: "text-blue-700",
  },
  "Calculators": {
    badge: "bg-amber-50 text-amber-800 border-amber-200/90",
    iconBg: "bg-amber-100/80 border-amber-200",
    iconColor: "text-amber-700",
  },
  "PDF & Documents": {
    badge: "bg-rose-50 text-rose-800 border-rose-200/90",
    iconBg: "bg-rose-100/80 border-rose-200",
    iconColor: "text-rose-700",
  },
  "PDF Documents": {
    badge: "bg-rose-50 text-rose-800 border-rose-200/90",
    iconBg: "bg-rose-100/80 border-rose-200",
    iconColor: "text-rose-700",
  },
  "AI & Smart Tools": {
    badge: "bg-purple-50 text-purple-800 border-purple-200/90",
    iconBg: "bg-purple-100/80 border-purple-200",
    iconColor: "text-purple-700",
  },
};

const DEFAULT_THEME = {
  badge: "bg-teal-50 text-teal-800 border-teal-200/90",
  iconBg: "bg-teal-100/80 border-teal-200",
  iconColor: "text-teal-700",
};

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
    <section id="tools-catalog" className="w-full space-y-5 scroll-mt-20">
      {/* Search & Filters Command Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search 113+ free tools (e.g. image compressor, json formatter, jwt, emi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-slate-50/70 text-slate-900 placeholder:text-slate-500 text-sm rounded-md border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:border-teal-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Counter Pill */}
        <div className="shrink-0 text-xs font-mono text-slate-600 self-center sm:self-auto px-3 py-2 rounded-md bg-slate-100/90 border border-slate-200">
          Showing <span className="font-bold text-slate-900">{filteredTools.length}</span> of {initialTools.length} tools
        </div>
      </div>

      {/* Category Pills (Touch-optimized horizontal scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-medium transition-all border shrink-0",
                isSelected
                  ? "bg-teal-700 text-white border-teal-700 shadow-xs font-semibold"
                  : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200"
              )}
            >
              {cat}
            </button>
          );
        })}
        <button
          onClick={() => setSelectedCategory("Coming Soon")}
          className={cn(
            "whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs font-medium transition-all border flex items-center gap-1.5 shrink-0",
            selectedCategory === "Coming Soon"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs font-semibold"
              : "bg-white hover:bg-amber-50 text-amber-700 border-slate-200"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </button>
      </div>

      {/* Dedicated Category Link Banner */}
      {selectedCategory !== "All" && selectedCategory !== "Coming Soon" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-teal-50/60 border border-teal-200/80">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider font-mono">Category Documentation</p>
            <p className="text-xs sm:text-sm font-medium text-slate-800">
              In-depth technical guides, browser performance tips, and specs for {selectedCategory}.
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-all shrink-0"
          >
            <span>Explore {selectedCategory} Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-sm font-bold text-slate-800">No tools found matching your search</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try searching for related keywords or resetting category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-3 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {filteredTools.map((tool) => {
            const theme = CATEGORY_THEMES[tool.category] || DEFAULT_THEME;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-600 rounded-lg block h-full"
              >
                <div className="h-full flex flex-col justify-between p-4 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:shadow-[0_4px_16px_rgba(13,148,136,0.12)] transition-all duration-150">
                  <div className="space-y-3">
                    {/* Top row: Icon + Category Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-md border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                          theme.iconBg
                        )}
                      >
                        <ToolIcon name={tool.icon} className={cn("w-4.5 h-4.5", theme.iconColor)} />
                      </div>

                      {tool.isComingSoon ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 shrink-0">
                          <Clock className="w-2.5 h-2.5 text-amber-600" />
                          <span>Coming Soon</span>
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 tracking-tight",
                            theme.badge
                          )}
                        >
                          {tool.category}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 leading-snug tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Status + Action */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          tool.isComingSoon ? "bg-amber-500" : "bg-emerald-500"
                        )}
                      />
                      <span>{tool.isComingSoon ? "Roadmap" : "100% Client-Side"}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 group-hover:text-teal-800 group-hover:translate-x-0.5 transition-all">
                      <span>{tool.isComingSoon ? "View Specs" : "Open Tool"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
