import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + "...";
}


/** Meta descriptions longer than about 155 characters get cut off in search results.
 *  This shortens them at a sentence or word boundary instead of mid-word. */
export function clampDescription(text: string, max = 155): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  const word = cut.lastIndexOf(" ");
  return cut.slice(0, word > 0 ? word : max).replace(/[,;:\-\s]+$/, "") + ".";
}

/** A tool URL that is live: active, not coming soon, and not an alias that redirects. */
export function isLiveToolSlug(slug: string, catalog: { slug: string; isActive?: boolean; isComingSoon?: boolean }[], aliases: Record<string, string>): boolean {
  if (aliases[slug]) return false;
  const t = catalog.find((x) => x.slug === slug);
  return !!t && t.isActive !== false && !t.isComingSoon;
}
