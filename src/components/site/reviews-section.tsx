import { Star } from "lucide-react";
import type { TestimonialItem } from "@/lib/content";

function Card({ t }: { t: TestimonialItem }) {
  const stars = Math.max(1, Math.min(5, t.rating));
  return (
    <figure className="zq-card flex w-[300px] shrink-0 flex-col p-5 sm:w-[340px]">
      <div className="flex gap-0.5 text-[#F2A81D]" aria-label={`${stars} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < stars ? "fill-current" : ""}`} aria-hidden="true" />
        ))}
      </div>
      <blockquote className="mt-3 line-clamp-5 flex-1 whitespace-normal text-[15px] leading-relaxed">“{t.quote}”</blockquote>
      <figcaption className="mt-3 text-sm">
        <span className="font-semibold">{t.name}</span>
        {(t.role || t.company) && <span className="text-[#5B6270]"> — {[t.role, t.company].filter(Boolean).join(", ")}</span>}
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse }: { items: TestimonialItem[]; reverse?: boolean }) {
  // Repeat the cards until one half of the loop is wide enough, then double it for a seamless -50% loop.
  let half = items;
  while (half.length < 6) half = [...half, ...items];
  const list = reverse ? [...half].reverse() : half;
  return (
    <div className={`zq-marquee zq-marquee-slow ${reverse ? "zq-marquee-rev" : ""}`}>
      <div className="zq-marquee-track py-2" role="list">
        {[...list, ...list].map((t, i) => (
          <div key={`${t.id}-${i}`} role="listitem" aria-hidden={i >= list.length ? true : undefined}>
            <Card t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two-row review marquee (opposite directions, edge fade, pauses on hover). Posting reviews lives on /review. */
export function TestimonialsSection({ items, heading = "Client reviews" }: { items: TestimonialItem[]; heading?: string }) {
  const list = items.slice(0, 20);
  if (list.length === 0) return null; // only real, approved reviews are shown
  const avg = list.length ? list.reduce((a, t) => a + Math.max(1, Math.min(5, t.rating)), 0) / list.length : 0;
  const half = Math.ceil(list.length / 2);
  const a = list.slice(0, half);
  const b = list.length > 1 ? list.slice(half) : list;

  return (
    <section id="reviews" aria-labelledby="testimonials-heading" className="zq-band-tint zq-section overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="testimonials-heading" className="zq-display zq-h2">
              {heading}
            </h2>
            <p className="mt-2 max-w-xl text-[16px] text-[#5B6270]">
              Feedback from people we have worked with.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(
              <div className="flex items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-4 py-2.5">
                <span className="zq-display text-2xl font-semibold text-[#15171C]">{avg.toFixed(1)}</span>
                <Star className="h-5 w-5 fill-[#F2A81D] text-[#F2A81D]" aria-hidden="true" />
                <span className="text-sm text-[#5B6270]">
                  {list.length} review{list.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {list.length > 0 && (
        <div className="mt-8 space-y-4">
          <Row items={a} />
          <Row items={b} reverse />
        </div>
      )}
    </section>
  );
}
