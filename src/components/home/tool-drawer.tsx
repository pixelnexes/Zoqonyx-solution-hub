"use client";

import * as React from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import type { SerializedTool } from "@/components/home/tool-catalog";
import { ToolBadge, familyColor } from "@/components/common/tool-badge";
import { categoryStyle } from "@/components/kit/icons";

// Tool directory used on the homepage and /tools: a search pill, then one
// colored card per category. Searching replaces the cards with matching tools.

const CATEGORY_ORDER: { names: string[]; label: string; slug: string }[] = [
  { names: ["Image Tools"], label: "Images", slug: "image-tools" },
  { names: ["PDF Documents", "PDF & Documents"], label: "PDF", slug: "pdf-documents" },
  { names: ["Developer & SEO"], label: "Developer & SEO", slug: "developer-seo" },
  { names: ["Text & Code"], label: "Text & code", slug: "text-code" },
  { names: ["CSS & Design"], label: "CSS & design", slug: "css-design" },
  { names: ["Calculators"], label: "Calculators", slug: "calculators" },
];

const TOOLS_PER_CATEGORY = 7;

interface ToolDrawerProps {
  tools: SerializedTool[];
  /** How many tools to list per category before "See all" (homepage: 7, /tools: all). */
  perCategory?: number;
  /** Show a one-line description under each tool name. */
  detailed?: boolean;
  /** Leave out the search box where the page already has one. */
  hideSearch?: boolean;
}

function ToolRow({ tool, detailed = false, accentColor }: { tool: SerializedTool; detailed?: boolean; accentColor: string }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group flex gap-3 rounded-xl px-2.5 -mx-2.5 transition-colors hover:bg-[#F7F6F4] ${detailed ? "py-3 items-start" : "py-2 items-center"}`}
    >
      <ToolBadge name={tool.icon} category={tool.category} size={30} />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[15px] text-[#161513] group-hover:text-[#B02E0E]">{tool.name}</span>
        {detailed && <span className="block text-sm mt-0.5 leading-snug line-clamp-2 text-[#5E5B55]">{tool.description}</span>}
      </span>
      <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-colors text-[#D63A14]" aria-hidden="true" />
    </Link>
  );
}

export function ToolDrawer({ tools, perCategory = TOOLS_PER_CATEGORY, detailed = false, hideSearch = false }: ToolDrawerProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Active tools, one per slug (the catalog has a few duplicate entries).
  const liveTools = React.useMemo(() => {
    const seen = new Set<string>();
    return tools.filter((t) => {
      if (!t.isActive || t.isComingSoon || seen.has(t.slug)) return false;
      seen.add(t.slug);
      return true;
    });
  }, [tools]);

  const groups = React.useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        ...cat,
        tools: liveTools.filter((t) => cat.names.includes(t.category)),
      })).filter((g) => g.tools.length > 0),
    [liveTools]
  );

  const q = query.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (!q) return [];
    return liveTools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.slug.includes(q.replace(/\s+/g, "-"))
    );
  }, [liveTools, q]);

  // "/" focuses search, as on many tool sites.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section aria-label="All tools" className="space-y-10">
      <div className={hideSearch ? "hidden" : undefined}>
        <label htmlFor="home-search" className="sr-only">
          Search tools
        </label>
        <div className="zq-search">
          <Search className="w-5 h-5 shrink-0 text-[#D63A14]" aria-hidden="true" />
          <input
            ref={inputRef}
            id="home-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${liveTools.length} tools, for example "merge pdf" or "json"`}
            className="flex-1 min-w-0 bg-transparent border-0 text-base sm:text-lg font-medium text-[#161513] placeholder:text-[#6F6B64] placeholder:font-normal"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold rounded-full px-3 py-1.5 bg-[#F7F6F4] text-[#161513] hover:bg-[#E5E2DC]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold border border-[#E5E2DC] bg-[#F7F6F4] text-[#5E5B55]" title="Press / to search">
              /
            </kbd>
          )}
        </div>
      </div>

      {q ? (
        <div aria-live="polite">
          <p className="text-sm mb-4 text-[#5E5B55]">
            {results.length === 0
              ? `No tool matches "${query.trim()}". Try a shorter word, like "pdf" or "image".`
              : `${results.length} ${results.length === 1 ? "tool matches" : "tools match"} "${query.trim()}"`}
          </p>
          {results.length > 0 && (
            <ul key={q} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((t) => {
                return (
                  <li key={t.slug}>
                    <Link href={`/tools/${t.slug}`} className="zq-card flex items-start gap-3 p-4 h-full" style={{ animation: "zq-rise .35s var(--zq-ease) both" }}>
                      <ToolBadge name={t.icon} category={t.category} size={40} />
                      <span className="min-w-0">
                        <span className="block font-semibold text-[15px]">{t.name}</span>
                        <span className="block text-sm mt-0.5 leading-snug line-clamp-2 text-[#5E5B55]">{t.description}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => {
            const { Icon } = categoryStyle(g.label);
            const color = familyColor(g.label);
            return (
              <div key={g.slug} className="zq-card zq-card-hover p-5 sm:p-6 flex flex-col">
                <div className="flex items-center gap-3 pb-4 mb-2 border-b border-[#E5E2DC]">
                  <span className="zq-chip" style={{ background: color }} aria-hidden="true">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="zq-display text-xl font-semibold leading-tight">
                      <Link href={`/category/${g.slug}`} className="hover:text-[#B02E0E]">
                        {g.label}
                      </Link>
                    </h3>
                    <p className="text-sm text-[#5E5B55]">{g.tools.length} tools</p>
                  </div>
                </div>
                <ul className="flex-1">
                  {g.tools.slice(0, perCategory).map((t) => (
                    <li key={t.slug}>
                      <ToolRow tool={t} detailed={detailed} accentColor={color} />
                    </li>
                  ))}
                </ul>
                {g.tools.length > perCategory && (
                  <Link href={`/category/${g.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color }}>
                    See all {g.tools.length} tools <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
