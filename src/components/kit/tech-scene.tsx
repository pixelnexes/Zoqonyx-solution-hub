import * as React from "react";
import { Boxes, Code2, Globe, Search, Smartphone, Wrench, Megaphone, Cpu, type LucideIcon } from "lucide-react";
import { TechLogo } from "@/components/kit/tech-logo";

/* Code-drawn "tech scene" images: dark violet board, grid, glow, and glass tiles carrying real technology logos. */

export const GROUP_TECH: Record<string, string[]> = {
  "Game Development": ["Unity", "Unreal Engine", "Godot", "Solidity"],
  "App Development": ["Kotlin", "Swift", "Flutter", "React Native"],
  "Website Development": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
  "Custom Software": ["Python", "PostgreSQL", "Docker", "Node.js"],
  "Digital Marketing": ["Google Cloud", "Cloudflare", "React", "Next.js"],
  "AI & NLP Development": ["Python", "spaCy", "Docker", "PostgreSQL"],
  "NFT Development": ["Solidity", "React", "Node.js", "TypeScript"],
  "Staff Augmentation": ["React", "Node.js", "Python", "Kotlin", "Swift"],
  "ERP & CRM Development": ["PostgreSQL", "MySQL", "Laravel", "Docker"],
};

const SLOTS: { x: number; y: number; r: number }[] = [
  { x: 8, y: 14, r: -4 },
  { x: 54, y: 8, r: 3 },
  { x: 30, y: 46, r: -2 },
  { x: 64, y: 54, r: 4 },
  { x: 6, y: 66, r: 3 },
];

const BOARD = "relative isolate overflow-hidden bg-gradient-to-br from-[#1B1340] via-[#2D1B69] to-[#5B21B6]";
const GRID = { backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "28px 28px" };

export function TechScene({ techs, className = "", label }: { techs: string[]; className?: string; label?: string }) {
  const items = techs.slice(0, 5);
  return (
    <div className={`${BOARD} rounded-xl ${className}`} role="img" aria-label={label || `Technologies: ${items.join(", ")}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-80" style={GRID} />
      <div aria-hidden="true" className="absolute -left-10 -top-16 -z-10 h-64 w-64 rounded-full bg-[#8B5CF6]/50 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-20 -right-10 -z-10 h-64 w-64 rounded-full bg-[#F472B6]/40 blur-3xl" />
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 -z-10 h-full w-full">
        {items.slice(1).map((_, i) => (
          <line key={i} x1={SLOTS[i].x + 14} y1={SLOTS[i].y + 8} x2={SLOTS[i + 1].x + 14} y2={SLOTS[i + 1].y + 8} stroke="#C4B5FD" strokeOpacity=".45" strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {items.map((t, i) => (
        <div
          key={t}
          className="zq-float absolute flex items-center gap-2 rounded-xl border border-white/25 bg-white/12 px-3 py-2.5 text-[14px] font-semibold text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)] backdrop-blur-md"
          style={{ left: `${SLOTS[i].x}%`, top: `${SLOTS[i].y}%`, ["--r" as string]: `${SLOTS[i].r}deg`, ["--d" as string]: `${-i * 1.3}s` }}
        >
          <TechLogo name={t} mono />
        </div>
      ))}
    </div>
  );
}

const CAT_ICON: [RegExp, LucideIcon][] = [
  [/seo|search/i, Search],
  [/tool/i, Wrench],
  [/business|erp|crm/i, Boxes],
  [/web/i, Globe],
  [/app|mobile/i, Smartphone],
  [/market/i, Megaphone],
  [/ai/i, Cpu],
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Blog cover: dark board, a glass tile with the topic icon, node graph and code-line skeleton. */
export function BlogCover({ seed, category = "", className = "" }: { seed: string; category?: string; className?: string }) {
  const h = hash(seed);
  const Icon = (CAT_ICON.find(([re]) => re.test(category)) || [null, Code2])[1];
  const pts = Array.from({ length: 5 }, (_, i) => ({ x: 12 + i * 19 + ((h >> (i * 3)) % 8), y: 22 + ((h >> (i * 2 + 1)) % 46) }));
  const hue = h % 3;
  const from = ["#1B1340", "#1E1B4B", "#2E1065"][hue];
  const to = ["#6D28D9", "#4F46E5", "#A21CAF"][hue];
  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} role="img" aria-label={`${category} article`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-80" style={GRID} />
      <svg aria-hidden="true" viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 -z-10 h-full w-full">
        <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#C4B5FD" strokeOpacity=".55" strokeWidth=".7" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.4" fill="#F9A8D4" />
        ))}
      </svg>
      <div className="absolute left-5 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,.6)] backdrop-blur-md">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <div aria-hidden="true" className="absolute right-5 top-1/2 w-[38%] -translate-y-1/2 space-y-2">
        <span className="block h-2 w-3/4 rounded-full bg-white/50" />
        <span className="block h-2 w-full rounded-full bg-white/25" />
        <span className="block h-2 w-2/3 rounded-full bg-white/25" />
        <span className="block h-2 w-5/6 rounded-full bg-[#F9A8D4]/70" />
      </div>
    </div>
  );
}
