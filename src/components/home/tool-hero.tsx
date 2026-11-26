"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SerializedTool } from "@/components/home/tool-catalog";
import { ToolBadge } from "@/components/common/tool-badge";

const CHIPS = [
  { label: "Popular", match: null },
  { label: "Images", match: /image/i },
  { label: "PDF", match: /pdf/i },
  { label: "Developer and SEO", match: /developer|seo/i },
  { label: "Text and code", match: /text|code/i },
  { label: "CSS and design", match: /css|design/i },
  { label: "Calculators", match: /calc/i },
] as const;

const POPULAR = ["image-compressor", "merge-pdf", "split-pdf", "json-formatter", "qr-code-generator", "image-resizer", "backlink-checker", "compress-pdf"];

/** The first screen: search and a grid of tools that people can open at once. */
export function ToolHero({ tools, count }: { tools: SerializedTool[]; count: number }) {
  const [query, setQuery] = React.useState("");
  const [chip, setChip] = React.useState(0);

  const live = React.useMemo(() => {
    const seen = new Set<string>();
    return tools.filter((t) => t.isActive && !t.isComingSoon && !seen.has(t.slug) && seen.add(t.slug));
  }, [tools]);

  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return live.filter((t) => t.name.toLowerCase().includes(q) || t.slug.includes(q.replace(/\s+/g, "-"))).slice(0, 12);
    const match = CHIPS[chip].match;
    if (match) return live.filter((t) => match.test(t.category)).slice(0, 8);
    const picked = POPULAR.map((s) => live.find((t) => t.slug === s)).filter(Boolean) as SerializedTool[];
    return picked.concat(live.filter((t) => !POPULAR.includes(t.slug))).slice(0, 8);
  }, [live, query, chip]);

  return (
    <section id="tools" className="scroll-mt-20 border-b border-[#E5E2DC] bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid items-end gap-5 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <h1 className="zq-display text-[2.4rem] font-bold leading-[1.05] text-[#161513] sm:text-[3.4rem]">Free tools for files, images and code</h1>
          <p className="max-w-xl text-[17px] leading-relaxed text-[#5E5B55]">
            {count} tools with no account and no paid tier. Need something built? Our team makes{" "}
            <Link href="/services" className="font-semibold text-[#B02E0E] underline underline-offset-4">
              apps, websites and software
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 flex h-[60px] items-center gap-3 rounded-[10px] border-2 border-[#161513] bg-white pl-4 pr-2 focus-within:border-[#D63A14]">
          <Search className="h-5 w-5 shrink-0 text-[#5E5B55]" aria-hidden="true" />
          <label htmlFor="hero-search" className="sr-only">
            Search tools
          </label>
          <input
            id="hero-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a tool, for example merge pdf"
            className="min-w-0 flex-1 border-0 bg-transparent text-[17px] text-[#161513] !outline-none placeholder:text-[#6F6B64]"
          />
          <Link href="/tools" className="zq-btn zq-btn-indigo !h-11 !px-4 sm:!px-6">
            All tools
          </Link>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Tool categories">
          {CHIPS.map((c, i) => (
            <button
              key={c.label}
              type="button"
              aria-pressed={chip === i && !query}
              onClick={() => {
                setChip(i);
                setQuery("");
              }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                chip === i && !query ? "border-[#161513] bg-[#161513] text-white" : "border-[#E5E2DC] text-[#5E5B55] hover:border-[#161513]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="mt-6 text-[#5E5B55]">
            No tool matches that.{" "}
            <Link href="/contact?subject=Tool%20request" className="font-semibold text-[#B02E0E] underline underline-offset-4">
              Request it
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {shown.map((t) => (
              <li key={t.slug}>
                <Link href={`/tools/${t.slug}`} className="flex h-full flex-col gap-3 rounded-[10px] border border-[#E5E2DC] bg-[#F7F6F4] p-4 transition-colors hover:border-[#161513] hover:bg-white sm:p-5">
                  <ToolBadge name={t.icon} category={t.category} size={42} />
                  <span>
                    <span className="block text-[16px] font-semibold leading-snug text-[#161513]">{t.name}</span>
                    <span className="mt-1 line-clamp-2 text-sm leading-snug text-[#5E5B55]">{t.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
