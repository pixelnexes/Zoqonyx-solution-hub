import { Mail, MessageSquareQuote, Star } from "lucide-react";
import { LeadForm, type ServiceOption } from "@/components/site/lead-form";
import type { TestimonialItem } from "@/lib/content";

/** Dark contact band with a white form card. Used at the bottom of every page that has a form. */
export function ContactSection({
  services,
  defaultService = "",
  heading = "Tell us about your project",
  intro = "Send a few details and we will reply with questions and next steps.",
}: {
  services: ServiceOption[];
  defaultService?: string;
  heading?: string;
  intro?: string;
}) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="zq-band-dark scroll-mt-20">
      <div aria-hidden="true" className="zq-blob zq-pulse" style={{ width: 380, height: 380, right: -80, top: -90, background: "#5B5BF0" }} />
      <div aria-hidden="true" className="zq-blob" style={{ width: 300, height: 300, left: -100, bottom: -120, background: "#22D3EE", opacity: 0.3 }} />
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-14 items-start">
          <div>
            <h2 id="contact-heading" className="zq-display text-3xl sm:text-4xl font-extrabold leading-tight">
              {heading}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/85 max-w-md">{intro}</p>
            <ul className="mt-7 space-y-4 text-[16px]">
              <li className="flex items-center gap-3">
                <span className="zq-chip zq-chip-sm zq-g-sun text-[#0B1026]">
                  <Mail className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
                <a href="mailto:hello@zoqonyx.com" className="font-semibold underline underline-offset-4 hover:text-[#FFB020]">
                  hello@zoqonyx.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/85">
                <span className="zq-chip zq-chip-sm zq-g-aqua">
                  <MessageSquareQuote className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
                Tell us about your idea and we will reply with questions.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white text-[#0B1026] p-5 sm:p-8 shadow-[0_30px_70px_-24px_rgba(0,0,0,.65)]">
            <LeadForm services={services} defaultService={defaultService} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ items, heading = "What clients say" }: { items: TestimonialItem[]; heading?: string }) {
  // Only real, published testimonials from the admin are shown. With none, the section is hidden.
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-heading" className="zq-band-tint zq-section">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="testimonials-heading" className="zq-display zq-h2">
          {heading}
        </h2>
        <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((t) => (
            <li key={t.id} className="zq-card p-6 flex flex-col">
              <div className="flex gap-0.5 text-[#FFB020]" aria-label={`${t.rating} out of 5`}>
                {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-3 text-[16px] leading-relaxed flex-1">“{t.quote}”</blockquote>
              <p className="mt-4 text-sm">
                <span className="font-bold">{t.name}</span>
                {(t.role || t.company) && <span className="text-[#4B557A]"> — {[t.role, t.company].filter(Boolean).join(", ")}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
