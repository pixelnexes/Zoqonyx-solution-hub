import { LeadForm, type ServiceOption } from "@/components/site/lead-form";
import type { TestimonialItem } from "@/lib/content";

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
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10">
        <div>
          <h2 id="contact-heading" className="text-2xl sm:text-[1.75rem] font-bold tracking-[-0.015em] leading-tight">
            {heading}
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[#4A5568] max-w-md">{intro}</p>
          <dl className="mt-6 space-y-3 text-[15px]">
            <div>
              <dt className="font-semibold">Email</dt>
              <dd>
                <a href="mailto:hello@zoqonyx.com" className="text-[#0F766E] underline underline-offset-[3px]">
                  hello@zoqonyx.com
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="p-5 sm:p-6 rounded-md bg-white border border-[#D5DCE4]">
          <LeadForm services={services} defaultService={defaultService} />
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ items, heading = "What clients say" }: { items: TestimonialItem[]; heading?: string }) {
  // Only real, published testimonials from the admin are shown. With none, the section is hidden.
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="text-2xl sm:text-[1.75rem] font-bold tracking-[-0.015em] leading-tight pb-2 border-b-2 border-[#14213D]">
        {heading}
      </h2>
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 6).map((t) => (
          <li key={t.id} className="p-5 rounded-md bg-white border border-[#D5DCE4] flex flex-col">
            <blockquote className="text-[16px] leading-relaxed text-[#14213D] flex-1">“{t.quote}”</blockquote>
            <p className="mt-4 text-sm">
              <span className="font-semibold">{t.name}</span>
              {(t.role || t.company) && (
                <span className="text-[#4A5568]">
                  {" "}
                  — {[t.role, t.company].filter(Boolean).join(", ")}
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
