"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight, Clock, Star, Zap, Lock, ShieldCheck } from "lucide-react";
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

const POPULAR_SLUGS = new Set([
  "image-compressor",
  "background-remover",
  "photo-resizer",
  "pdf-merge",
  "split-pdf",
  "pdf-to-jpg",
  "json-formatter",
  "qr-code-generator",
  "password-generator",
  "svg-to-png",
  "css-gradient-generator",
  "base64-encoder-decoder",
  "lorem-ipsum-generator",
  "color-palette-generator",
  "meta-tags-analyzer",
  "age-calculator",
]);

interface CategoryMeta {
  badge: string;
  iconBox: string;
  iconColor: string;
  accentBorder: string;
  engine: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "Image Tools": {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200/90",
    iconBox: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
    iconColor: "text-emerald-700",
    accentBorder: "group-hover:border-emerald-400",
    engine: "Canvas 2D • In-Memory",
  },
  "CSS & Design": {
    badge: "bg-violet-50 text-violet-800 border-violet-200/90",
    iconBox: "bg-violet-500/10 border-violet-500/30 text-violet-700",
    iconColor: "text-violet-700",
    accentBorder: "group-hover:border-violet-400",
    engine: "Live CSS3 • Visual",
  },
  "Text & Code": {
    badge: "bg-sky-50 text-sky-800 border-sky-200/90",
    iconBox: "bg-sky-500/10 border-sky-500/30 text-sky-700",
    iconColor: "text-sky-700",
    accentBorder: "group-hover:border-sky-400",
    engine: "Regex • Sub-ms",
  },
  "Developer & SEO": {
    badge: "bg-blue-50 text-blue-800 border-blue-200/90",
    iconBox: "bg-blue-500/10 border-blue-500/30 text-blue-700",
    iconColor: "text-blue-700",
    accentBorder: "group-hover:border-blue-400",
    engine: "RFC Spec • Zero Log",
  },
  "Calculators": {
    badge: "bg-amber-50 text-amber-800 border-amber-200/90",
    iconBox: "bg-amber-500/10 border-amber-500/30 text-amber-800",
    iconColor: "text-amber-800",
    accentBorder: "group-hover:border-amber-400",
    engine: "Exact Math • Instant",
  },
  "PDF & Documents": {
    badge: "bg-rose-50 text-rose-800 border-rose-200/90",
    iconBox: "bg-rose-500/10 border-rose-500/30 text-rose-700",
    iconColor: "text-rose-700",
    accentBorder: "group-hover:border-rose-400",
    engine: "PDF-Lib • In-Memory",
  },
  "PDF Documents": {
    badge: "bg-rose-50 text-rose-800 border-rose-200/90",
    iconBox: "bg-rose-500/10 border-rose-500/30 text-rose-700",
    iconColor: "text-rose-700",
    accentBorder: "group-hover:border-rose-400",
    engine: "PDF-Lib • In-Memory",
  },
  "AI & Smart Tools": {
    badge: "bg-purple-50 text-purple-800 border-purple-200/90",
    iconBox: "bg-purple-500/10 border-purple-500/30 text-purple-700",
    iconColor: "text-purple-700",
    accentBorder: "group-hover:border-purple-400",
    engine: "Local Compute",
  },
};

const DEFAULT_META: CategoryMeta = {
  badge: "bg-slate-100 text-slate-800 border-slate-200",
  iconBox: "bg-teal-500/10 border-teal-500/30 text-teal-700",
  iconColor: "text-teal-700",
  accentBorder: "group-hover:border-teal-400",
  engine: "Client-Side • Fast",
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
    <section id="tools-catalog" className="w-full space-y-3.5 scroll-mt-16">
      {/* Search & Filters Command Bar (Dense, Compact, Linear/Vercel Style) */}
      <div className="flex items-center justify-between gap-2 bg-white p-1.5 sm:p-2 rounded-[8px] border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Search Input with inline count pill */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search 113+ free tools (e.g. compress, json, regex, pdf, jwt, emi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-24 h-9 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-[6px] border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[11px] text-slate-400 hover:text-slate-700 font-medium px-1.5 py-0.5 rounded hover:bg-slate-200/60"
              >
                Clear
              </button>
            )}
            <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-[4px] border border-slate-300/70 hidden xs:inline-block sm:inline-block">
              {filteredTools.length} tools
            </span>
          </div>
        </div>

        {/* Counter Pill for ultra-small mobile screens */}
        <div className="shrink-0 text-[10px] font-mono font-bold text-slate-700 px-2 py-1.5 rounded-[6px] bg-slate-100 border border-slate-200 xs:hidden">
          {filteredTools.length}
        </div>
      </div>

      {/* Category Pills (Touch-optimized horizontal scroll) */}
      <div className="relative w-full">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-2.5 py-1 rounded-[6px] text-xs transition-all border shrink-0 font-medium",
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs font-semibold"
                    : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200"
                )}
              >
                {cat}
              </button>
            );
          })}
          <button
            onClick={() => setSelectedCategory("Coming Soon")}
            className={cn(
              "whitespace-nowrap px-2.5 py-1 rounded-[6px] text-xs transition-all border flex items-center gap-1 shrink-0 font-medium",
              selectedCategory === "Coming Soon"
                ? "bg-amber-600 text-white border-amber-600 shadow-xs font-semibold"
                : "bg-white hover:bg-amber-50 text-amber-700 border-slate-200"
            )}
          >
            <Clock className="w-3 h-3" />
            <span>Coming Soon</span>
          </button>
        </div>
      </div>

      {/* Dedicated Category Link Banner */}
      {selectedCategory !== "All" && selectedCategory !== "Coming Soon" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-[8px] bg-slate-50 border border-slate-200">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Category Documentation</p>
            <p className="text-xs font-medium text-slate-800">
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
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shrink-0"
          >
            <span>Explore {selectedCategory} Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Tools Grid - Dense, Punchy, High-Contrast (Linear / Vercel style) */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-[8px] border border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-sm font-bold text-slate-800">No tools found matching your search</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try searching for related keywords or resetting category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-2.5 px-3 py-1 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-[6px] border border-slate-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {filteredTools.map((tool) => {
            const meta = CATEGORY_META[tool.category] || DEFAULT_META;
            const isPopular = POPULAR_SLUGS.has(tool.slug);

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 rounded-[8px] block h-full"
              >
                <div
                  className={cn(
                    "h-full flex flex-col justify-between p-3 sm:p-3.5 rounded-[8px] border bg-white transition-all duration-150",
                    "border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                    "hover:border-slate-400 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:-translate-y-[1px]",
                    meta.accentBorder
                  )}
                >
                  <div className="space-y-2.5">
                    {/* Header: Icon + Category/Popular Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-[6px] border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                            meta.iconBox
                          )}
                        >
                          <ToolIcon name={tool.icon} className={cn("w-4 h-4", meta.iconColor)} strokeWidth={2.25} />
                        </div>
                        <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                          {tool.category.replace(" Tools", "").replace(" & Documents", "").replace(" & Design", "")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {tool.isComingSoon ? (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-amber-600" />
                            <span>Soon</span>
                          </span>
                        ) : isPopular ? (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold bg-slate-900 text-white flex items-center gap-1 tracking-tight">
                            <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                            <span>Core</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200">
                            Free
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-[13.5px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 leading-snug tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Engine Spec + Micro Action */}
                  <div className="pt-2 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10.5px] font-mono flex items-center gap-1">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          tool.isComingSoon ? "bg-amber-500" : "bg-emerald-500"
                        )}
                      />
                      <span className="truncate max-w-[140px]">
                        {tool.isComingSoon ? "Roadmap" : meta.engine}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 group-hover:text-teal-700 transition-colors shrink-0">
                      <span>{tool.isComingSoon ? "Specs" : "Open"}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
