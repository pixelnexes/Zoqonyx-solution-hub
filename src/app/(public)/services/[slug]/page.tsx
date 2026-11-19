import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Mail } from "lucide-react";
import { getService, getServices, getTestimonials } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";
import { serviceStyle } from "@/components/kit/icons";
import { CtaBand, FaqBlock, PageHero, WorkSteps } from "@/components/kit/page-kit";
import { GROUP_TECH, TechScene } from "@/components/kit/tech-scene";
import { TechLogo } from "@/components/kit/tech-logo";
import { groupPhotoKey } from "@/lib/photos";
import LogoLoop from "@/components/reactbits/LogoLoop";

export const revalidate = 300;

const PROMISES = [
  { t: "A clear scope", d: "You get a written plan with stages and a fixed first step before any work starts." },
  { t: "Weekly progress", d: "Working builds you can open and comment on, not status reports." },
  { t: "You own it", d: "Code, designs and accounts belong to you from the first payment." },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Service not found | Zoqonyx" };
  const title = s.metaTitle || `${s.name} | Zoqonyx`;
  const description = s.metaDesc || s.shortDesc.slice(0, 155);
  const url = `https://zoqonyx.com/services/${s.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: [`https://zoqonyx.com/photos/${groupPhotoKey(s.group)}.jpg`] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, all] = await Promise.all([getService(slug), getServices()]);
  if (!service) notFound();
  const testimonials = await getTestimonials(service.slug);

  const hub = all.find((s) => s.isHub && s.group === service.group);
  const children = service.isHub ? all.filter((s) => s.group === service.group && s.slug !== service.slug) : [];
  const related = service.related.map((r) => all.find((s) => s.slug === r)).filter(Boolean) as typeof all;
  const options = all.filter((s) => !s.isHub || s.slug === "nft-development").map((s) => ({ slug: s.slug, name: s.name }));
  const { Icon, accent } = serviceStyle(service.group || service.slug);
  const tech = GROUP_TECH[service.group] || [];
  
  const url = `https://zoqonyx.com/services/${service.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.shortDesc,
      url,
      serviceType: service.group || service.name,
      image: `https://zoqonyx.com/photos/${groupPhotoKey(service.group)}.jpg`,
      areaServed: "Worldwide",
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".zq-lead-answer"] },
      provider: { "@type": "Organization", name: "Zoqonyx", url: "https://zoqonyx.com", email: "hello@zoqonyx.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://zoqonyx.com" },
        { "@type": "ListItem", position: 2, name: "Services", item: "https://zoqonyx.com/services" },
        ...(hub && hub.slug !== service.slug ? [{ "@type": "ListItem", position: 3, name: hub.name, item: `https://zoqonyx.com/services/${hub.slug}` }] : []),
        { "@type": "ListItem", position: hub && hub.slug !== service.slug ? 4 : 3, name: service.name, item: url },
      ],
    },
    ...(service.faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          },
        ]
      : []),
  ];

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    ...(hub && hub.slug !== service.slug ? [{ label: hub.name, href: `/services/${hub.slug}` }] : []),
    { label: service.name },
  ];

  return (
    <div className="zq-page">
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <PageHero
        crumbs={crumbs}
        title={service.name}
        intro={service.shortDesc}
        actions={
          <>
            <a href="#contact" className="zq-btn zq-btn-indigo">
              Get a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <Link href="/services" className="zq-btn zq-btn-outline">
              All services
            </Link>
          </>
        }
        image={`/photos/${groupPhotoKey(service.group)}.jpg`}
      />

      {tech.length > 0 && (
        <section aria-label="Technologies" className="zq-band-white border-b border-[#E7E1F6] py-6">
          <LogoLoop
            logos={tech.map((t) => ({ node: <span className="zq-pill"><TechLogo name={t} /></span>, title: t }))}
            speed={45}
            gap={16}
            logoHeight={44}
            pauseOnHover
            fadeOut
            fadeOutColor="#FFFFFF"
            ariaLabel={`Technologies for ${service.name}`}
          />
        </section>
      )}

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_330px] items-start">
        <article className="min-w-0">
          <div className="zq-prose text-[17px] leading-[1.75]">{renderMarkdown(service.content)}</div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {PROMISES.map((p) => (
              <li key={p.t} className="rounded-xl border border-[#E7E1F6] bg-white p-5">
                <span className={`zq-chip zq-chip-sm ${accent.chip}`}>
                  <Check className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[17px] font-bold">{p.t}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#5C5878]">{p.d}</p>
              </li>
            ))}
          </ul>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-xl bg-[#1B1340] p-6 text-white">
            <span className={`zq-chip ${accent.chip}`}>
              <Icon className="w-6 h-6" aria-hidden="true" />
            </span>
            <h2 className="zq-display mt-4 text-xl font-extrabold leading-tight">Talk to us about {service.name}</h2>
            <p className="mt-2 text-[15px] leading-relaxed zq-on-dark-muted">Tell us what you need and we reply with questions and next steps.</p>
            <a href="#contact" className="zq-btn zq-btn-sun mt-5 w-full">
              Get a quote
            </a>
            <a href="mailto:hello@zoqonyx.com" className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-white/90 hover:underline underline-offset-4">
              <Mail className="w-4 h-4" aria-hidden="true" /> hello@zoqonyx.com
            </a>
          </div>
          {children.length > 0 && (
            <div className="zq-card p-5">
              <h2 className="text-base font-bold">In this area</h2>
              <ul className="mt-3 space-y-1">
                {children.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/services/${c.slug}`} className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 -mx-2 text-[15px] font-semibold hover:bg-[#FAF8FF] hover:text-[#5B21B6]">
                      {c.name} <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <WorkSteps />
      <FaqBlock heading={`Questions about ${service.name}`} items={service.faqs} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="zq-band-tint zq-section">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="related-heading" className="zq-display zq-h2">
              Related services
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/services/${r.slug}`} className="zq-card zq-card-hover group flex h-full flex-col overflow-hidden">
                    <TechScene group={r.group} className="h-40 w-full !rounded-none" />
                    <span className="flex flex-1 flex-col p-5">
                      <span className="text-[18px] font-bold group-hover:text-[#5B21B6]">{r.name}</span>
                      <span className="mt-1.5 flex-1 text-[15px] leading-relaxed text-[#5C5878] line-clamp-3">{r.shortDesc}</span>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#5B21B6]">
                        Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <TestimonialsSection items={testimonials} />
      <CtaBand heading={`Start your ${service.name.toLowerCase()} project`} text="Share your idea, budget range and timeline. We reply with questions and a first step." />
      <ContactSection
        services={options}
        defaultService={service.isHub && service.slug !== "nft-development" ? "" : service.name}
        heading={`Talk to us about ${service.name}`}
      />
    </div>
  );
}
