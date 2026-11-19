import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getServices, getTestimonials, groupServices } from "@/lib/content";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";
import { Reveal } from "@/components/kit/reveal";
import { serviceStyle } from "@/components/kit/icons";
import { CtaBand, PageHero, WorkSteps, groupPhoto } from "@/components/kit/page-kit";

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

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title="Software, apps and growth for your business"
        intro="We design and build games, apps, websites and business software, and help you get found with digital marketing."
        actions={
          <>
            <a href="#contact" className="zq-btn zq-btn-indigo">
              Tell us about your project <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="#all-services" className="zq-btn zq-btn-outline">
              Browse services
            </a>
          </>
        }
        photos={["/photos/phone-app.jpg", "/photos/coworking.jpg", "/photos/marketing.jpg"]}
      />

      <div id="all-services" className="scroll-mt-20">
        {groups.map(({ hub, children }, i) => {
          const { Icon, accent } = serviceStyle(hub.slug);
          const flip = i % 2 === 1;
          return (
            <section key={hub.slug} aria-labelledby={`g-${hub.slug}`} className={i % 2 === 0 ? "bg-white" : "bg-[#FAF8FF]"}>
              <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal className={flip ? "lg:order-2" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={groupPhoto(hub.group)} alt="" width={960} height={640} loading="lazy" className="h-72 w-full rounded-xl object-cover shadow-[0_24px_60px_-34px_rgba(27,19,64,.5)] sm:h-96" />
                </Reveal>
                <div>
                  <span className={`zq-chip ${accent.chip}`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <h2 id={`g-${hub.slug}`} className="zq-display mt-4 text-3xl sm:text-4xl font-extrabold leading-tight">
                    {hub.name}
                  </h2>
                  <p className="mt-3 text-[17px] leading-relaxed text-[#5C5878]">{hub.shortDesc}</p>
                  {children.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {children.map((c) => (
                        <li key={c.slug} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: accent.color }} aria-hidden="true" />
                          <Link href={`/services/${c.slug}`} className="text-[16px] font-semibold hover:text-[#5B21B6] hover:underline underline-offset-4">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={`/services/${hub.slug}`} className="zq-btn zq-btn-outline mt-7 !h-11">
                    Explore {hub.name.toLowerCase()} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <WorkSteps />
      <TestimonialsSection items={testimonials} />
      <CtaBand heading="Ready to start your project?" text="Send us a few lines about what you want to build. We reply with questions and a first step." />
      <ContactSection services={options} />
    </div>
  );
}
