import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

/* Real CC0 photographs in /public/photos. Picked by a stable hash so a page always shows the same picture. */
export const PHOTO_KEYS = ["developer", "team", "marketing", "handshake", "game", "workspace", "city", "code2", "coworking", "keyboard", "phone-app"] as const;

export function photoFor(seed: string, offset = 0) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `/photos/${PHOTO_KEYS[(Math.abs(h) + offset) % PHOTO_KEYS.length]}.jpg`;
}

export const GROUP_PHOTO: Record<string, string> = {
  "Game Development": "game",
  "App Development": "phone-app",
  "Website Development": "code2",
  "Custom Software": "developer",
  "Digital Marketing": "marketing",
  "AI & NLP Development": "keyboard",
  "NFT Development": "city",
  "Staff Augmentation": "team",
  "ERP & CRM Development": "workspace",
};

export function groupPhoto(group: string) {
  return `/photos/${GROUP_PHOTO[group] || "developer"}.jpg`;
}

export type Crumb = { label: string; href?: string };

/** Centered light hero used by inner pages: breadcrumb, headline, intro, actions and an optional photo row. */
export function PageHero({
  crumbs,
  title,
  intro,
  actions,
  photos,
  badge,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  actions?: React.ReactNode;
  photos?: [string, string, string];
  badge?: string;
}) {
  return (
    <section className="zq-hero-light">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 text-center">
        <nav aria-label="Breadcrumb" className="text-sm text-[#4F5B57]">
          <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {crumbs.map((c, i) => (
              <React.Fragment key={c.label + i}>
                {i > 0 && <li aria-hidden="true">/</li>}
                <li {...(i === crumbs.length - 1 ? { "aria-current": "page" as const } : {})} className={i === crumbs.length - 1 ? "font-semibold text-[#10181A]" : undefined}>
                  {c.href ? (
                    <Link href={c.href} className="hover:underline underline-offset-4">
                      {c.label}
                    </Link>
                  ) : (
                    c.label
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
        {badge && <p className="mt-6 inline-flex rounded-md border border-[#10181A]/20 bg-white/70 px-3 py-1 text-sm font-semibold">{badge}</p>}
        <h1 className="zq-in-solid zq-display mx-auto mt-5 max-w-4xl text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.05] text-[#10181A]">{title}</h1>
        {intro && (
          <p className="zq-in mx-auto mt-5 max-w-2xl text-[18px] leading-relaxed text-[#4F5B57]" style={{ ["--d" as string]: "90ms" }}>
            {intro}
          </p>
        )}
        {actions && (
          <div className="zq-in mt-8 flex flex-wrap justify-center gap-3" style={{ ["--d" as string]: "160ms" }}>
            {actions}
          </div>
        )}
        {photos ? (
          <div className="zq-in mx-auto mt-12 grid max-w-5xl grid-cols-3 items-end gap-3 sm:gap-5" style={{ ["--d" as string]: "240ms" }}>
            {photos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src + i} src={src} alt="" width={640} height={427} loading={i === 1 ? "eager" : "lazy"} className={`w-full rounded-t-xl object-cover shadow-[0_24px_50px_-28px_rgba(16,24,26,.55)] ${i === 1 ? "h-44 sm:h-72" : "h-32 sm:h-56"}`} />
            ))}
          </div>
        ) : (
          <div className="pb-12 sm:pb-14" />
        )}
      </div>
    </section>
  );
}

/** Solid green call-to-action block. */
export function CtaBand({ heading, text, href = "#contact", cta = "Get a quote", photo = "/photos/coworking.jpg" }: { heading: string; text: string; href?: string; cta?: string; photo?: string }) {
  return (
    <section className="zq-section">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-2xl bg-[#0E7C5A] text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" width={960} height={640} loading="lazy" className="absolute inset-y-0 right-0 -z-10 hidden h-full w-1/2 object-cover opacity-30 mix-blend-luminosity md:block" />
          <div className="max-w-xl px-7 py-12 sm:px-12 sm:py-16">
            <h2 className="zq-display text-3xl sm:text-4xl font-extrabold leading-tight">{heading}</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/90">{text}</p>
            <a href={href} className="zq-btn zq-btn-sun mt-7">
              {cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Two-column FAQ: title on the left, accordion on the right. */
export function FaqBlock({ heading, items }: { heading: string; items: { question: string; answer: string }[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="zq-section">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 id="faq-heading" className="zq-display zq-h2">
            {heading}
          </h2>
          <p className="mt-3 zq-lead">Short answers to what people ask us first. Need more? Send us a message.</p>
        </div>
        <div className="space-y-3">
          {items.map((f, i) => (
            <details key={i} className="zq-card group p-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                {f.question}
                <ChevronDown className="w-5 h-5 shrink-0 text-[#0E7C5A] transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#4F5B57]">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export const WORK_STEPS = [
  { t: "Talk", d: "A short call to understand your goal, users and deadline." },
  { t: "Plan", d: "A written plan with scope, stages and a fixed first step." },
  { t: "Build", d: "Weekly working builds you can click through and comment on." },
  { t: "Launch and support", d: "Release, handover and help after go-live." },
];

export function WorkSteps({ heading = "How a project runs" }: { heading?: string }) {
  return (
    <section aria-labelledby="steps-heading" className="zq-band-tint zq-section">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="steps-heading" className="zq-display zq-h2">
          {heading}
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORK_STEPS.map((s, i) => (
            <li key={s.t} className="relative rounded-xl border border-[#DFE3DA] bg-white p-6">
              <span className="zq-display text-4xl font-extrabold text-[#0E7C5A]">{i + 1}</span>
              <h3 className="mt-3 text-[18px] font-bold">{s.t}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#4F5B57]">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
