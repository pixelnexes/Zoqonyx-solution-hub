import { Star } from "lucide-react";
import { Slider } from "@/components/kit/slider";
import { ReviewForm } from "@/components/site/review-form";
import type { TestimonialItem } from "@/lib/content";

export function TestimonialsSection({ items, heading = "Client reviews" }: { items: TestimonialItem[]; heading?: string }) {
  // Only real, approved reviews are shown. With none yet, visitors are invited to write the first one.
  const avg = items.length ? items.reduce((a, t) => a + Math.max(1, Math.min(5, t.rating)), 0) / items.length : 0;
  return (
    <section id="reviews" aria-labelledby="testimonials-heading" className="zq-band-tint zq-section scroll-mt-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="testimonials-heading" className="zq-display zq-h2">
              {heading}
            </h2>
            <p className="mt-2 max-w-xl text-[16px] text-[#5C5878]">
              {items.length ? "Feedback from people we have worked with." : "No reviews yet. Worked with us? Tell others how it went."}
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-[#E7E1F6] bg-white px-4 py-3">
              <span className="zq-display text-3xl font-extrabold text-[#1B1340]">{avg.toFixed(1)}</span>
              <div>
                <div className="flex gap-0.5 text-[#F2A81D]" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(avg) ? "fill-current" : ""}`} />
                  ))}
                </div>
                <p className="text-xs text-[#5C5878]">
                  {items.length} review{items.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-8">
            <Slider label="reviews">
              {items.slice(0, 12).map((t) => (
                <figure key={t.id} className="zq-slide zq-card flex flex-col p-6" style={{ minHeight: 220 }}>
                  <div className="flex gap-0.5 text-[#F2A81D]" aria-label={`${t.rating} out of 5`}>
                    {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 text-[16px] leading-relaxed">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-bold">{t.name}</span>
                    {(t.role || t.company) && <span className="text-[#5C5878]"> — {[t.role, t.company].filter(Boolean).join(", ")}</span>}
                  </figcaption>
                </figure>
              ))}
            </Slider>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-[#E7E1F6] bg-white p-6 sm:p-8 lg:max-w-2xl">
          <h3 className="text-xl font-bold text-[#1B1340]">Write a review</h3>
          <div className="mt-4">
            <ReviewForm />
          </div>
        </div>
      </div>
    </section>
  );
}
