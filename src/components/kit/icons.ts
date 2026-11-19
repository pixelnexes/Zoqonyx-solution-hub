import {
  Gamepad2,
  Smartphone,
  Globe,
  Code2,
  Megaphone,
  Cpu,
  Hexagon,
  Users,
  Boxes,
  Image as ImageIcon,
  FileText,
  Braces,
  Type,
  Palette,
  Calculator,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface Accent {
  /** CSS class for the gradient icon chip */
  chip: string;
  /** Solid color, for borders and highlights */
  color: string;
}

export const ACCENTS: Record<string, Accent> = {
  indigo: { chip: "zq-g-indigo", color: "#7C3AED" },
  aqua: { chip: "zq-g-aqua", color: "#0891B2" },
  sun: { chip: "zq-g-sun", color: "#D97706" },
  coral: { chip: "zq-g-coral", color: "#E11D48" },
  violet: { chip: "zq-g-violet", color: "#7C3AED" },
  emerald: { chip: "zq-g-emerald", color: "#059669" },
  slate: { chip: "zq-g-slate", color: "#475569" },
};

/** Service group slug -> icon and accent color. */
export const SERVICE_STYLE: Record<string, { icon: LucideIcon; accent: keyof typeof ACCENTS }> = {
  "game-development": { icon: Gamepad2, accent: "violet" },
  "app-development": { icon: Smartphone, accent: "indigo" },
  "website-development": { icon: Globe, accent: "aqua" },
  "custom-software": { icon: Code2, accent: "emerald" },
  "digital-marketing": { icon: Megaphone, accent: "coral" },
  "ai-nlp-development": { icon: Cpu, accent: "indigo" },
  "nft-development": { icon: Hexagon, accent: "sun" },
  "staff-augmentation": { icon: Users, accent: "slate" },
  "erp-crm-development": { icon: Boxes, accent: "aqua" },
};

/** Maps a service (by group name) to its hub slug style. */
export const GROUP_TO_SLUG: Record<string, string> = {
  "Game Development": "game-development",
  "App Development": "app-development",
  "Website Development": "website-development",
  "Custom Software": "custom-software",
  "Digital Marketing": "digital-marketing",
  "AI & NLP Development": "ai-nlp-development",
  "NFT Development": "nft-development",
  "Staff Augmentation": "staff-augmentation",
  "ERP & CRM Development": "erp-crm-development",
};

export function serviceStyle(groupOrSlug: string) {
  const slug = GROUP_TO_SLUG[groupOrSlug] || groupOrSlug;
  const s = SERVICE_STYLE[slug] || { icon: Wrench, accent: "indigo" as const };
  return { Icon: s.icon, accent: ACCENTS[s.accent] };
}

/** Tool category name -> style. */
const CATEGORY_STYLE: { match: RegExp; icon: LucideIcon; accent: keyof typeof ACCENTS }[] = [
  { match: /image/i, icon: ImageIcon, accent: "coral" },
  { match: /pdf/i, icon: FileText, accent: "sun" },
  { match: /developer|seo/i, icon: Braces, accent: "indigo" },
  { match: /text|code/i, icon: Type, accent: "emerald" },
  { match: /css|design/i, icon: Palette, accent: "violet" },
  { match: /calc/i, icon: Calculator, accent: "aqua" },
  { match: /ai/i, icon: Cpu, accent: "indigo" },
];

export function categoryStyle(name: string) {
  const s = CATEGORY_STYLE.find((c) => c.match.test(name)) || { icon: Wrench, accent: "slate" as const };
  return { Icon: s.icon, accent: ACCENTS[s.accent] };
}
