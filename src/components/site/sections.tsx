import { Mail, MessageSquareQuote, Star } from "lucide-react";
import { Slider } from "@/components/kit/slider";
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
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-14 items-start">
          <div>
            <h2 id="contact-heading" className="zq-display text-3xl sm:text-4xl font-semibold leading-tight">
              {heading}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/85 max-w-md">{intro}</p>
            <ul className="mt-7 space-y-4 text-[16px]">
              <li className="flex items-center gap-3">
                <span className="zq-chip zq-chip-sm zq-g-sun text-[#15171C]">
                  <Mail className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
                <a href="mailto:hello@zoqonyx.com" className="font-semibold underline underline-offset-4 hover:text-[#F2A81D]">
                  hello@zoqonyx.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/85">
                <span className="zq-chip zq-chip-sm zq-g-aqua">
                  <MessageSquareQuote className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
                Tell us about your idea and we will reply with questions. We work remotely with clients in the USA, Europe, the Gulf and Asia.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white text-[#15171C] p-5 sm:p-8 shadow-[0_30px_70px_-24px_rgba(0,0,0,.65)]">
            <LeadForm services={services} defaultService={defaultService} />
          </div>
        </div>
      </div>
    </section>
  );
}

export { TestimonialsSection } from "@/components/site/reviews-section";
