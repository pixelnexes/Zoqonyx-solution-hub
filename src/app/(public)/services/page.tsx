import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServices, getTestimonials, groupServices } from "@/lib/content";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";
import { Reveal } from "@/components/kit/reveal";
import { serviceStyle } from "@/components/kit/icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Software, App & Digital Marketing Services | Zoqonyx" },
  description:
    "Game, app, website and custom software development, digital marketing, AI and NLP, NFT, staff augmentation and ERP/CRM services. Tell us about your project.",
  alternates: { canonical: "https://zoqonyx.com/services" },
  openGraph: {
    title: "Software, App & Digital Marketing Services | Zoqonyx",
    description: "Game, app, website and custom software development, digital marketing, AI, NFT, staff augmentation and ERP/CRM.",
    url: "https://zoqonyx.com/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  const [all, testimonials] = await Promise.all([getServices(), getTestimonials()]);
  const groups = groupServices(all);
  const options = all.filter((s) => !s.isHub || s.slug === "nft-development").map((s) => ({ slug: s.slug, name: s.name }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Zoqonyx services",
    url: "https://zoqonyx.com/services",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `https://zoqonyx.com/services/${s.slug}` })),
    },
  };

  return (
    <div className="zq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="zq-banner">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-white/75">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link href="/" className="hover:underline underline-offset-4">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-white">
                Services
              </li>
            </ol>
          </nav>
          <h1 className="zq-in-solid zq-display mt-5 text-4xl sm:text-6xl font-extrabold leading-[1.03]">Services</h1>
          <p className="zq-in mt-4 max-w-2xl text-[18px] leading-relaxed zq-on-dark-muted">
            We design and build games, apps, websites and business software, and help you get found with digital marketing. Choose a service to see what we deliver and how we work.
          </p>
          <a href="#contact" className="zq-btn zq-btn-sun mt-7">
            Tell us about your project <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section space-y-16">
        {groups.map(({ hub, children }) => {
          const { Icon, accent } = serviceStyle(hub.slug);
          return (
            <section key={hub.slug} aria-labelledby={`g-${hub.slug}`}>
              <div className="flex items-start gap-4">
                <span className={`zq-chip ${accent.chip}`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 id={`g-${hub.slug}`} className="zq-display text-2xl sm:text-3xl font-extrabold leading-tight">
                    <Link href={`/services/${hub.slug}`} className="hover:text-[#0A5E44]">
                      {hub.name}
                    </Link>
                  </h2>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-[#4F5B57] max-w-2xl">{hub.shortDesc}</p>
                </div>
              </div>
              {children.length > 0 ? (
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {children.map((c, i) => (
                    <Reveal as="li" key={c.slug} delay={i * 70}>
                      <Link href={`/services/${c.slug}`} className="zq-card group flex h-full flex-col p-5" style={{ borderTop: `3px solid ${accent.color}` }}>
                        <span className="text-[17px] font-bold leading-snug">{c.name}</span>
                        <span className="mt-1.5 text-sm leading-relaxed text-[#4F5B57] line-clamp-3 flex-1">{c.shortDesc}</span>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold" style={{ color: accent.color }}>
                          Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              ) : (
                <p className="mt-5">
                  <Link href={`/services/${hub.slug}`} className="zq-btn zq-btn-outline !h-11">
                    See details <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </p>
              )}
            </section>
          );
        })}
      </div>

      <TestimonialsSection items={testimonials} />
      <ContactSection services={options} />
    </div>
  );
}
