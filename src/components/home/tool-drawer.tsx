"use client";

import * as React from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { SerializedTool } from "@/components/home/tool-catalog";

// Homepage only. Lists tools as a labeled drawer: one column per category,
// tool names in full, and a search that replaces the drawer with results.

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
}

export function ToolDrawer({ tools, perCategory = TOOLS_PER_CATEGORY }: ToolDrawerProps) {
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
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.slug.includes(q.replace(/\s+/g, "-"))
    );
  }, [liveTools, q]);

  // "/" focuses search, as on many tool sites.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
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
      {/* Search strip: the one bold element on the page */}
      <div>
        <label htmlFor="home-search" className="sr-only">
          Search tools
        </label>
        <div className="zq-strip flex items-center gap-3 rounded-[6px] px-4 sm:px-5 h-14 sm:h-16">
          <Search className="w-5 h-5 shrink-0" style={{ color: "var(--zq-ink)" }} aria-hidden="true" />
          <input
            ref={inputRef}
            id="home-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${liveTools.length} tools, for example "merge pdf" or "json"`}
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base sm:text-lg font-medium placeholder:font-normal"
            style={{ color: "var(--zq-ink)" }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="zq-focus shrink-0 inline-flex items-center gap-1 text-sm font-semibold rounded-[4px] px-2 py-1"
              style={{ color: "var(--zq-ink)" }}
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Clear
            </button>
          ) : (
            <kbd
              className="hidden sm:inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-[4px] text-sm font-semibold border"
              style={{ color: "var(--zq-ink)", borderColor: "rgba(20,33,61,0.35)" }}
              title="Press / to search"
            >
              /
            </kbd>
          )}
        </div>
      </div>

      {q ? (
        <div aria-live="polite">
          <p className="text-sm mb-4" style={{ color: "var(--zq-muted)" }}>
            {results.length === 0
              ? `No tool matches "${query.trim()}". Try a shorter word, like "pdf" or "image".`
              : `${results.length} ${results.length === 1 ? "tool matches" : "tools match"} "${query.trim()}"`}
          </p>
          {results.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 border-t" style={{ borderColor: "var(--zq-line)" }}>
              {results.map((t) => (
                <li key={t.slug} className="border-b" style={{ borderColor: "var(--zq-line)" }}>
                  <Link href={`/tools/${t.slug}`} className="zq-focus zq-row block py-3 rounded-[2px]">
                    <span className="block font-semibold" style={{ color: "var(--zq-ink)" }}>
                      {t.name}
                    </span>
                    <span className="block text-sm mt-0.5 line-clamp-2" style={{ color: "var(--zq-muted)" }}>
                      {t.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {groups.map((g) => (
            <div key={g.slug}>
              <h2 className="flex items-baseline justify-between gap-3 pb-2 border-b-2" style={{ borderColor: "var(--zq-ink)" }}>
                <Link
                  href={`/category/${g.slug}`}
                  className="zq-focus text-xl font-bold tracking-[-0.01em] rounded-[2px]"
                  style={{ color: "var(--zq-ink)" }}
                >
                  {g.label}
                </Link>
                <span className="text-sm tabular-nums" style={{ color: "var(--zq-muted)" }}>
                  {g.tools.length} tools
                </span>
              </h2>
              <ul>
                {g.tools.slice(0, perCategory).map((t) => (
                  <li key={t.slug} className="border-b" style={{ borderColor: "var(--zq-line)" }}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="zq-focus zq-row block py-2.5 text-[15px] font-medium rounded-[2px]"
                      style={{ color: "var(--zq-ink)" }}
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {g.tools.length > perCategory && (
                <Link
                  href={`/category/${g.slug}`}
                  className="zq-focus zq-link inline-block mt-3 text-sm font-semibold rounded-[2px]"
                >
                  See all {g.tools.length} tools in {g.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
