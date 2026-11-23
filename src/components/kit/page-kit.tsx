import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { photoAlt } from "@/lib/photos";

export type Crumb = { label: string; href?: string };

/** Light hero for inner pages: breadcrumb, headline, intro and actions on the left, a real photo on the right. */
export function PageHero({
  crumbs,
  title,
  intro,
  actions,
  image,
  badge,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  actions?: React.ReactNode;
  image?: string;
  badge?: string;
  photos?: unknown;
}) {
  return (
    <section className="zq-hero-light">
      <div className={`container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${image ? "grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12" : ""}`}>
        <div className={image ? "" : "max-w-3xl"}>
          <nav aria-label="Breadcrumb" className="text-sm text-[#5B6270]">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {crumbs.map((c, i) => (
                <React.Fragment key={c.label + i}>
                  {i > 0 && <li aria-hidden="true">/</li>}
                  <li {...(i === crumbs.length - 1 ? { "aria-current": "page" as const } : {})} className={i === crumbs.length - 1 ? "font-semibold text-[#15171C]" : undefined}>
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
          {badge && <p className="mt-5 inline-flex rounded-md border border-[#15171C]/20 bg-white/70 px-3 py-1 text-sm font-semibold">{badge}</p>}
          <h1 className="zq-in-solid zq-display mt-4 text-4xl font-semibold leading-[1.06] text-[#15171C] sm:text-5xl">{title}</h1>
          {intro && (
            <p className="zq-in zq-lead-answer mt-4 max-w-xl text-[18px] leading-relaxed text-[#5B6270]" style={{ ["--d" as string]: "90ms" }}>
              {intro}
            </p>
          )}
          {actions && (
            <div className="zq-in mt-6 flex flex-wrap gap-3" style={{ ["--d" as string]: "160ms" }}>
              {actions}
            </div>
          )}
        </div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={photoAlt(image)} width={1200} height={800} fetchPriority="high" className="h-60 w-full rounded-xl object-cover shadow-[0_24px_60px_-34px_rgba(21,23,28,.5)] sm:h-72 lg:h-80" />
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
        <div className="relative isolate overflow-hidden rounded-2xl bg-[#15171C] text-white">
          <div className="max-w-xl px-7 py-12 sm:px-12 sm:py-16">
            <h2 className="zq-display text-3xl sm:text-4xl font-semibold leading-tight">{heading}</h2>
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
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.question}
                <ChevronDown className="w-5 h-5 shrink-0 text-[#6D28D9] transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#5B6270]">{f.answer}</p>
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
            <li key={s.t} className="relative rounded-xl border border-[#E4E7EC] bg-white p-6">
              <span className="zq-display text-4xl font-semibold text-[#6D28D9]">{i + 1}</span>
              <h3 className="mt-3 text-[18px] font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#5B6270]">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
