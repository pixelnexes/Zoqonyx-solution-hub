import { ToolIcon } from "@/components/common/tool-icon";

/** One colour per tool family, so people can tell the kind of tool at a glance. */
export function familyColor(category = "") {
  if (/pdf/i.test(category)) return "#B3261E";
  if (/image/i.test(category)) return "#D63A14";
  if (/developer|seo/i.test(category)) return "#1A6FD1";
  if (/text|code/i.test(category)) return "#12805C";
  if (/css|design/i.test(category)) return "#9A5B00";
  if (/calc/i.test(category)) return "#0F6E78";
  return "#5E5B55";
}

/** Tool icon: a file with a folded corner and the tool's glyph on it. */
export function ToolBadge({ name, category, size = 44 }: { name?: string | null; category?: string; size?: number }) {
  const c = familyColor(category);
  return (
    <span className="relative inline-block shrink-0" style={{ width: size * 0.86, height: size, color: c }} aria-hidden="true">
      <svg viewBox="0 0 38 44" className="absolute inset-0 h-full w-full">
        <path d="M3 3a3 3 0 0 1 3-3h20l12 12v29a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill={c} fillOpacity=".12" />
        <path d="M26 0l12 12H29a3 3 0 0 1-3-3z" fill={c} fillOpacity=".45" />
      </svg>
      <span className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: size * 0.16, paddingLeft: size * 0.05 }}>
        <ToolIcon name={name} className={size >= 60 ? "h-7 w-7" : size >= 40 ? "h-5 w-5" : "h-3.5 w-3.5"} strokeWidth={2.4} />
      </span>
    </span>
  );
}
