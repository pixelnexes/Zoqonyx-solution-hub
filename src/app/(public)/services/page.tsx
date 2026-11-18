import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getTestimonials, groupServices } from "@/lib/content";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";

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
      itemListElement: all.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        url: `https://zoqonyx.com/services/${s.slug}`,
      })),
    },
  };

  return (
    <div className="bg-[#F3F5F8] text-[#14213D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-16">
        <nav aria-label="Breadcrumb" className="text-sm text-[#4A5568]">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="hover:underline underline-offset-4">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-[#14213D]">
              Services
            </li>
          </ol>
        </nav>

        <header className="max-w-[46rem] -mt-8">
          <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.08] font-bold tracking-[-0.02em]">Services</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#4A5568]">
            We design and build games, apps, websites and business software, and help you get found with digital marketing. Choose a service to see what we
            deliver and how we work, or{" "}
            <a href="#contact" className="text-[#0F766E] underline underline-offset-[3px]">
              tell us about your project
            </a>
            .
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {groups.map(({ hub, children }) => (
            <section key={hub.slug} aria-labelledby={`g-${hub.slug}`}>
              <h2 id={`g-${hub.slug}`} className="pb-2 border-b-2 border-[#14213D] text-xl font-bold tracking-[-0.01em]">
                <Link href={`/services/${hub.slug}`} className="hover:underline underline-offset-4">
                  {hub.name}
                </Link>
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4A5568]">{hub.shortDesc}</p>
              {children.length > 0 && (
                <ul className="mt-3">
                  {children.map((c) => (
                    <li key={c.slug} className="border-b border-[#D5DCE4]">
                      <Link href={`/services/${c.slug}`} className="block py-2.5 text-[15px] font-medium hover:bg-white">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <TestimonialsSection items={testimonials} />
        <ContactSection services={options} />
      </div>
    </div>
  );
}
