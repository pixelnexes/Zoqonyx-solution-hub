"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight, Clock, Star } from "lucide-react";
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

const FEATURED_SHORTCUTS = [
  { slug: "image-compressor", label: "Compress Image", icon: "FileArchive" },
  { slug: "pdf-merge", label: "Merge PDF", icon: "FileText" },
  { slug: "json-formatter", label: "Format JSON", icon: "Code2" },
  { slug: "background-remover", label: "Remove Background", icon: "Crop" },
  { slug: "qr-code-generator", label: "QR Generator", icon: "QrCode" },
  { slug: "css-gradient-generator", label: "CSS Gradient", icon: "Palette" },
  { slug: "password-generator", label: "Password Gen", icon: "Key" },
  { slug: "base64-encoder-decoder", label: "Base64", icon: "Binary" },
];

const CATEGORY_STYLES: Record<string, { iconBg: string }> = {
  "Image Tools": { iconBg: "bg-emerald-600 text-white" },
  "CSS & Design": { iconBg: "bg-violet-600 text-white" },
  "Text & Code": { iconBg: "bg-sky-600 text-white" },
  "Developer & SEO": { iconBg: "bg-slate-900 text-white" },
  "Calculators": { iconBg: "bg-amber-600 text-white" },
  "PDF & Documents": { iconBg: "bg-rose-600 text-white" },
  "PDF Documents": { iconBg: "bg-rose-600 text-white" },
  "AI & Smart Tools": { iconBg: "bg-indigo-600 text-white" },
};

const DEFAULT_STYLE = { iconBg: "bg-teal-700 text-white" };

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
    <section id="tools-catalog" className="w-full space-y-3.5 scroll-mt-14">
      {/* Featured Quick Launch Shortcuts */}
      {!searchQuery && selectedCategory === "All" && (
        <div className="bg-white p-3 rounded-[10px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Quick Launch • Most Used Utilities
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Instant Browser Launch</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            {FEATURED_SHORTCUTS.map((sc) => (
              <Link
                key={sc.slug}
                href={`/tools/${sc.slug}`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 hover:border-teal-300 transition-all text-xs font-semibold text-slate-800 hover:text-teal-800 truncate group"
              >
                <ToolIcon name={sc.icon} className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-700 shrink-0 transition-colors" strokeWidth={2.2} />
                <span className="truncate">{sc.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tactile Command Bar (Search + Counter) */}
      <div className="bg-white p-2.5 rounded-[10px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] flex items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search 113+ utilities (e.g. compress image, format json, merge pdf, jwt, regex, emi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 pr-24 h-10 bg-slate-50/80 text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm font-medium rounded-[8px] border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-transparent transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 px-1.5 py-0.5 rounded hover:bg-slate-200 transition-colors"
              >
                Clear
              </button>
            )}
            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-[6px] border border-slate-200/80 hidden sm:inline-block">
              {filteredTools.length} of {initialTools.length}
            </span>
          </div>
        </div>

        {/* Mobile counter badge */}
        <div className="shrink-0 text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-[6px] border border-slate-200 sm:hidden">
          {filteredTools.length}
        </div>
      </div>

      {/* Filter Tabs (Horizontal Snap Touch Scroller) */}
      <div className="relative w-full">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 rounded-[7px] text-xs transition-all border shrink-0 font-semibold",
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                )}
              >
                {cat}
              </button>
            );
          })}
          <button
            onClick={() => setSelectedCategory("Coming Soon")}
            className={cn(
              "whitespace-nowrap px-3 py-1.5 rounded-[7px] text-xs transition-all border flex items-center gap-1.5 shrink-0 font-semibold",
              selectedCategory === "Coming Soon"
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            )}
          >
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Coming Soon</span>
          </button>
        </div>
      </div>

      {/* Tools Grid - Substantial, Tactile, Crafted Cards */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-[10px] border border-dashed border-slate-300 bg-white">
          <p className="text-sm font-bold text-slate-900">No tools found matching &quot;{searchQuery}&quot;</p>
          <p className="text-xs text-slate-500 mt-1">Try other keywords or reset your category filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-3 px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-[6px] border border-slate-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {filteredTools.map((tool) => {
            const style = CATEGORY_STYLES[tool.category] || DEFAULT_STYLE;
            const isPopular = POPULAR_SLUGS.has(tool.slug);

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-[10px] block h-full"
              >
                <div className="h-full flex flex-col justify-between p-3.5 rounded-[10px] bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_25px_-4px_rgba(15,23,42,0.08),0_4px_10px_-2px_rgba(15,23,42,0.04)] hover:border-slate-400 hover:-translate-y-0.5 transition-all duration-200">
                  <div className="space-y-2.5">
                    {/* Header: Solid Category Icon + Category / Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105",
                            style.iconBg
                          )}
                        >
                          <ToolIcon name={tool.icon} className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          {tool.category}
                        </span>
                      </div>

                      {tool.isComingSoon ? (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Coming Soon
                        </span>
                      ) : isPopular ? (
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                          ★ Popular
                        </span>
                      ) : null}
                    </div>

                    {/* Tool Name & Description */}
                    <div>
                      <h3 className="text-[14.5px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 leading-snug">
                        {tool.name}
                      </h3>
                      <p className="text-[12px] text-slate-600 line-clamp-2 leading-relaxed mt-1 font-normal">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Bar: Natural Human Indicators */}
                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1.5 font-medium">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          tool.isComingSoon ? "bg-amber-400" : "bg-emerald-500"
                        )}
                      />
                      <span>{tool.isComingSoon ? "In Development" : "Client-Side • Fast"}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-slate-700 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all">
                      <span>Launch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
