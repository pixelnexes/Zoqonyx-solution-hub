import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown, Mail } from "lucide-react";
import { getService, getServices, getTestimonials } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";
import { Reveal } from "@/components/kit/reveal";
import { serviceStyle } from "@/components/kit/icons";

export const revalidate = 300;

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
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
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

  const url = `https://zoqonyx.com/services/${service.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.shortDesc,
      url,
      serviceType: service.group || service.name,
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

  return (
    <div className="zq-page">
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      {/* Banner */}
      <section className="zq-banner">
        <div aria-hidden="true" className="zq-blob zq-pulse" style={{ width: 340, height: 340, right: "-4%", top: "-30%", background: accent.color, opacity: 0.45 }} />
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-white/75">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:underline underline-offset-4">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:underline underline-offset-4">
                  Services
                </Link>
              </li>
              {hub && hub.slug !== service.slug && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/services/${hub.slug}`} className="hover:underline underline-offset-4">
                      {hub.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-white">
                {service.name}
              </li>
            </ol>
          </nav>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-start gap-5">
            <span className={`zq-chip ${accent.chip} !w-16 !h-16 !rounded-2xl zq-float`}>
              <Icon className="w-8 h-8" aria-hidden="true" />
            </span>
            <div className="max-w-3xl">
              <h1 className="zq-in-solid zq-display text-4xl sm:text-5xl font-extrabold leading-[1.05]">{service.name}</h1>
              <p className="zq-in mt-4 text-[18px] leading-relaxed zq-on-dark-muted">{service.shortDesc}</p>
              <div className="zq-in mt-7 flex flex-wrap gap-3" style={{ ["--d" as string]: "120ms" }}>
                <a href="#contact" className="zq-btn zq-btn-sun">
                  Get a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link href="/services" className="zq-btn zq-btn-ghost">
                  All services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
        <div className="space-y-12 min-w-0">
          <article className="zq-card p-6 sm:p-9 zq-prose">{renderMarkdown(service.content)}</article>

          {children.length > 0 && (
            <section aria-labelledby="children-heading">
              <h2 id="children-heading" className="zq-display text-2xl sm:text-3xl font-extrabold">
                {service.name} services
              </h2>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/services/${c.slug}`} className="zq-card group flex h-full flex-col p-5" style={{ borderTop: `3px solid ${accent.color}` }}>
                      <span className="text-[17px] font-bold">{c.name}</span>
                      <span className="mt-1.5 text-sm leading-relaxed text-[#4B557A] line-clamp-3 flex-1">{c.shortDesc}</span>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold" style={{ color: accent.color }}>
                        Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {service.faqs.length > 0 && (
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="zq-display text-2xl sm:text-3xl font-extrabold">
                Questions about {service.name}
              </h2>
              <div className="mt-5 space-y-3">
                {service.faqs.map((f, i) => (
                  <details key={i} className="zq-card group p-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                      {f.question}
                      <ChevronDown className="w-5 h-5 shrink-0 text-[#5B5BF0] transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#4B557A]">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[18px] p-6 text-white" style={{ background: "linear-gradient(145deg,#0B1026,#2A2FA8)" }}>
            <h2 className="zq-display text-xl font-extrabold leading-tight">Talk to us about {service.name}</h2>
            <p className="mt-2 text-[15px] leading-relaxed zq-on-dark-muted">Tell us what you need and we will reply with questions and next steps.</p>
            <a href="#contact" className="zq-btn zq-btn-sun mt-5 w-full">
              Get a quote
            </a>
            <a href="mailto:hello@zoqonyx.com" className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-white/90 hover:underline underline-offset-4">
              <Mail className="w-4 h-4" aria-hidden="true" /> hello@zoqonyx.com
            </a>
          </div>
          {related.length > 0 && (
            <div className="zq-card p-5">
              <h2 className="text-base font-bold">Related services</h2>
              <ul className="mt-3 space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/services/${r.slug}`} className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 -mx-2 text-[15px] font-semibold hover:bg-[#F3F5FB] hover:text-[#3F3FD0]">
                      {r.name} <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <TestimonialsSection items={testimonials} />
      <Reveal>
        <ContactSection
          services={options}
          defaultService={service.isHub && service.slug !== "nft-development" ? "" : service.name}
          heading={`Talk to us about ${service.name}`}
        />
      </Reveal>
    </div>
  );
}
