import * as React from "react";
import { TechLogo } from "@/components/kit/tech-logo";
import { blogPhotoKey, groupPhotoKey, photoAlt, photoSrc } from "@/lib/photos";

/* Real, topic-related photographs. (File name kept from an earlier version.) */

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

/** A plain photo for a service group (or a given photo), no overlays. */
export function TechScene({ group, photo, className = "", alt }: { group?: string; techs?: string[]; photo?: string; className?: string; alt?: string }) {
  const src = photo || photoSrc(groupPhotoKey(group || ""));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? photoAlt(src)} width={1200} height={800} loading="lazy" decoding="async" className={`rounded-xl object-cover ${className}`} />
  );
}

/** Blog image: a photo related to the article's topic. */
export function BlogCover({ seed, category = "", className = "", priority = false }: { seed: string; category?: string; className?: string; priority?: boolean }) {
  const src = photoSrc(blogPhotoKey(seed, category));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={photoAlt(src)} width={1200} height={800} loading={priority ? "eager" : "lazy"} decoding="async" className={`object-cover ${className}`} />
  );
}

/** Small row of the technology logos used for a service group. */
export function TechRow({ group }: { group: string }) {
  const list = GROUP_TECH[group];
  if (!list) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-semibold text-[#5E5B55]" aria-label="Technologies">
      {list.slice(0, 3).map((t) => (
        <li key={t} className="inline-flex items-center gap-1.5">
          <TechLogo name={t} />
        </li>
      ))}
    </ul>
  );
}
