import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Offer = { slug: string; name: string; title: string; text: string };

const OFFERS = {
  marketing: {
    slug: "digital-marketing-services",
    name: "Digital Marketing Services",
    title: "Want more visitors and enquiries?",
    text: "Our team handles SEO, content and campaigns, and sets up tracking so you can see which work brings leads.",
  },
  web: {
    slug: "website-development",
    name: "Website Development",
    title: "Need a website or web app?",
    text: "We design, build and maintain websites and web applications for businesses.",
  },
  front: {
    slug: "front-end-development",
    name: "Front-End Development",
    title: "Need a design turned into a real interface?",
    text: "We build responsive, accessible front ends from your designs or ideas.",
  },
  app: {
    slug: "app-development",
    name: "App Development",
    title: "Planning a mobile app?",
    text: "We build Android, iOS and cross-platform apps, from the first version to ongoing releases.",
  },
  ai: {
    slug: "ai-nlp-development",
    name: "AI & NLP Development",
    title: "Want AI inside your product?",
    text: "We add AI features such as text, document and language processing to business software.",
  },
  software: {
    slug: "custom-software-development",
    name: "Custom Software Development",
    title: "Doing this task every day in your business?",
    text: "We build custom software and internal tools that do repeated work for your team.",
  },
} satisfies Record<string, Offer>;

/** Picks the service closest to a tool category or blog topic. */
function offerFor(topic: string): Offer {
  if (/seo|search|marketing|backlink|schema|growth/i.test(topic)) return OFFERS.marketing;
  if (/\bai\b|writing/i.test(topic)) return OFFERS.ai;
  if (/css|design/i.test(topic)) return OFFERS.front;
  if (/image|photo|app|mobile|calculator|game/i.test(topic)) return OFFERS.app;
  if (/developer|web/i.test(topic)) return OFFERS.web;
  return OFFERS.software;
}

/** Links content pages to a related service, with a quote popup. */
export function ServiceCta({ topic }: { topic: string }) {
  const o = offerFor(topic);
  return (
    <aside aria-label={o.name} className="zq-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <h2 className="zq-display text-xl font-semibold text-[#161513]">{o.title}</h2>
        <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-[#5E5B55]">
          {o.text}{" "}
          <Link href={`/services/${o.slug}`} className="font-semibold text-[#B02E0E] underline underline-offset-4">
            See {o.name.toLowerCase().replace(/\bai & nlp\b/, "AI & NLP")}
          </Link>
          .
        </p>
      </div>
      <a href="/contact" data-lead="quote" data-service={o.name} className="zq-btn zq-btn-indigo shrink-0">
        Get a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </aside>
  );
}
