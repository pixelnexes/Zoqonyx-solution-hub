"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight, Clock, Star, Zap, ShieldCheck } from "lucide-react";
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

interface CategoryStyle {
  iconBg: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  tag: string;
  engine: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Image Tools": {
    iconBg: "bg-emerald-600 text-white",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    tag: "IMAGE",
    engine: "CANVAS 2D • WASM",
  },
  "CSS & Design": {
    iconBg: "bg-violet-600 text-white",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-800",
    badgeBorder: "border-violet-200",
    tag: "CSS",
    engine: "LIVE CSS3 • VISUAL",
  },
  "Text & Code": {
    iconBg: "bg-sky-600 text-white",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-800",
    badgeBorder: "border-sky-200",
    tag: "CODE",
    engine: "REGEX • SUB-MS",
  },
  "Developer & SEO": {
    iconBg: "bg-slate-900 text-white",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-800",
    badgeBorder: "border-slate-300",
    tag: "DEV",
    engine: "RFC SPEC • ZERO LOG",
  },
  "Calculators": {
    iconBg: "bg-amber-600 text-white",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    tag: "CALC",
    engine: "MATH.JS • ACCURATE",
  },
  "PDF & Documents": {
    iconBg: "bg-rose-600 text-white",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-800",
    badgeBorder: "border-rose-200",
    tag: "PDF",
    engine: "PDF-LIB • IN-MEMORY",
  },
  "PDF Documents": {
    iconBg: "bg-rose-600 text-white",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-800",
    badgeBorder: "border-rose-200",
    tag: "PDF",
    engine: "PDF-LIB • IN-MEMORY",
  },
  "AI & Smart Tools": {
    iconBg: "bg-purple-600 text-white",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-200",
    tag: "AI",
    engine: "LOCAL INFERENCE",
  },
};

const DEFAULT_STYLE: CategoryStyle = {
  iconBg: "bg-teal-700 text-white",
  badgeBg: "bg-teal-50",
  badgeText: "text-teal-800",
  badgeBorder: "border-teal-200",
  tag: "TOOL",
  engine: "CLIENT-SIDE",
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
    <section id="tools-catalog" className="w-full space-y-2.5 scroll-mt-14">
      {/* Dense Command Bar (Search + Counter) */}
      <div className="bg-white p-2 rounded-[8px] border border-slate-300 shadow-xs flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search 113+ tools (e.g. compress image, format json, merge pdf, jwt, regex, emi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-24 h-9 bg-slate-50 text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm font-medium rounded-[6px] border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-900 px-1 py-0.5 rounded hover:bg-slate-200"
              >
                Clear
              </button>
            )}
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-[4px] border border-slate-300 hidden sm:inline-block">
              {filteredTools.length} / {initialTools.length} TOOLS
            </span>
          </div>
        </div>

        {/* Mobile counter tag */}
        <div className="shrink-0 text-[10px] font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1.5 rounded-[6px] border border-slate-300 sm:hidden">
          {filteredTools.length}
        </div>
      </div>

      {/* Filter Tabs (Horizontal Snap Touch Scroller) */}
      <div className="relative w-full">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-2.5 py-1 rounded-[6px] text-xs transition-all border shrink-0 font-medium",
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs font-bold"
                    : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300"
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
                ? "bg-amber-600 text-white border-amber-600 shadow-xs font-bold"
                : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
            )}
          >
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Coming Soon</span>
          </button>
        </div>
      </div>

      {/* Tools Grid - Dense, Punchy, High-Contrast Cards */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-[8px] border border-dashed border-slate-300 bg-white">
          <p className="text-sm font-bold text-slate-900">No tools found matching &quot;{searchQuery}&quot;</p>
          <p className="text-xs text-slate-500 mt-1">Try other keywords or reset your category filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-2.5 px-3 py-1 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-[6px] border border-slate-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-2.5">
          {filteredTools.map((tool) => {
            const style = CATEGORY_STYLES[tool.category] || DEFAULT_STYLE;
            const isPopular = POPULAR_SLUGS.has(tool.slug);

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-[8px] block h-full"
              >
                <div className="h-full flex flex-col justify-between p-3 rounded-[8px] border border-slate-300/80 bg-white hover:border-slate-900 hover:shadow-[0_4px_16px_rgba(15,23,42,0.12)] hover:-translate-y-[1px] transition-all duration-150 shadow-xs">
                  <div className="space-y-2">
                    {/* Header Row: Solid Punchy Icon Tile + Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Solid Branded Icon Tile - Bold & High-Contrast */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105",
                            style.iconBg
                          )}
                        >
                          <ToolIcon name={tool.icon} className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                        </div>

                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          {style.tag}
                        </span>
                      </div>

                      {/* Right Tag */}
                      <div className="flex items-center gap-1 shrink-0">
                        {tool.isComingSoon ? (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>SOON</span>
                          </span>
                        ) : isPopular ? (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-black bg-slate-900 text-white flex items-center gap-1 shadow-xs tracking-wider">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span>CORE</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tool Name & Description */}
                    <div>
                      <h3 className="text-[14px] font-black text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 leading-snug tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed mt-0.5 font-normal">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Spec Bar */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 text-[10px] flex items-center gap-1.5 font-medium">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          tool.isComingSoon ? "bg-amber-500" : "bg-emerald-600"
                        )}
                      />
                      <span className="truncate max-w-[140px] uppercase font-bold tracking-tight">
                        {tool.isComingSoon ? "IN DEV" : style.engine}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 group-hover:text-teal-700 transition-colors shrink-0">
                      <span>{tool.isComingSoon ? "SPECS" : "OPEN"}</span>
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
