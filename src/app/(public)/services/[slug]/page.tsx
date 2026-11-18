import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices, getTestimonials } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";

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
        ...(hub && hub.slug !== service.slug
          ? [{ "@type": "ListItem", position: 3, name: hub.name, item: `https://zoqonyx.com/services/${hub.slug}` }]
          : []),
        { "@type": "ListItem", position: hub && hub.slug !== service.slug ? 4 : 3, name: service.name, item: url },
      ],
    },
    ...(service.faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-[#F3F5F8] text-[#14213D]">
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-16">
        <nav aria-label="Breadcrumb" className="text-sm text-[#4A5568]">
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
            <li aria-current="page" className="font-medium text-[#14213D]">
              {service.name}
            </li>
          </ol>
        </nav>

        <header className="max-w-[46rem] -mt-8">
          <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.08] font-bold tracking-[-0.02em]">{service.name}</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#4A5568]">{service.shortDesc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center h-11 px-6 rounded-md bg-[#14213D] text-white text-[15px] font-semibold hover:bg-[#0F1A31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D]"
            >
              Get a quote
            </a>
            <Link
              href="/services"
              className="inline-flex items-center h-11 px-6 rounded-md border border-[#14213D] text-[15px] font-semibold hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D]"
            >
              All services
            </Link>
          </div>
        </header>

        <article className="max-w-[46rem] text-[16px] leading-[1.7] text-[#2D3748] -mt-4">{renderMarkdown(service.content)}</article>

        {children.length > 0 && (
          <section aria-labelledby="children-heading">
            <h2 id="children-heading" className="pb-2 border-b-2 border-[#14213D] text-2xl font-bold tracking-[-0.015em]">
              {service.name} services
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {children.map((c) => (
                <li key={c.slug} className="border-b border-[#D5DCE4]">
                  <Link href={`/services/${c.slug}`} className="block py-3.5 hover:bg-white">
                    <span className="block text-[16px] font-semibold">{c.name}</span>
                    <span className="block mt-0.5 text-sm leading-relaxed text-[#4A5568] line-clamp-2">{c.shortDesc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {service.faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className="max-w-[46rem]">
            <h2 id="faq-heading" className="text-2xl font-bold tracking-[-0.015em] leading-tight">
              Questions about {service.name.toLowerCase()}
            </h2>
            <div className="mt-5 border-t border-[#D5DCE4]">
              {service.faqs.map((f, i) => (
                <div key={i} className="py-4 border-b border-[#D5DCE4]">
                  <h3 className="text-[17px] font-semibold leading-snug">{f.question}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#4A5568]">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <TestimonialsSection items={testimonials} />

        <ContactSection
          services={options}
          defaultService={service.isHub && service.slug !== "nft-development" ? "" : service.name}
          heading={`Talk to us about ${service.name.toLowerCase()}`}
        />

        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="pb-2 border-b-2 border-[#14213D] text-2xl font-bold tracking-[-0.015em]">
              Related services
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {related.map((r) => (
                <li key={r.slug} className="border-b border-[#D5DCE4]">
                  <Link href={`/services/${r.slug}`} className="block py-3 text-[15px] font-semibold hover:bg-white">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
