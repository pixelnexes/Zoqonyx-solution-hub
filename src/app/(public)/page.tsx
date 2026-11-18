import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ToolDrawer } from "@/components/home/tool-drawer";
import { ZQ_CSS } from "@/components/home/zq-styles";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";
import { getPosts, getServices, getTestimonials, groupServices } from "@/lib/content";
import type { Metadata } from "next";

import { DEFAULT_TOOLS } from "@/lib/default-tools";

export const metadata: Metadata = {
  title: {
    absolute: "Zoqonyx: Software Development & Free Online Tools",
  },
  description:
    "App, website and custom software development, digital marketing and AI services, plus free online tools for PDFs, images, code and text. Get a quote.",
  alternates: {
    canonical: "https://zoqonyx.com",
  },
  openGraph: {
    title: "Zoqonyx: Software Development & Free Online Tools",
    description: "App, website and custom software development, digital marketing and AI services, plus free online tools.",
    url: "https://zoqonyx.com",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const PROCESS = [
  { title: "Talk", text: "Tell us what you want to build or fix. We ask questions about your users, goals and limits." },
  { title: "Plan and estimate", text: "You get a written scope, a timeline and a cost, split into stages so you can start small." },
  { title: "Build in stages", text: "We deliver working versions regularly. You review each one and steer the next." },
  { title: "Launch and support", text: "We release, monitor and keep improving, with fixes and updates after go-live." },
];

const AUDIENCES = [
  {
    title: "Start-ups",
    text: "Turn an idea into a first version real users can try, then improve it with what you learn.",
    link: "/services/mobile-app-development",
    cta: "Mobile app development",
  },
  {
    title: "Growing businesses",
    text: "Replace spreadsheets and manual steps with websites, portals and systems that fit how you work.",
    link: "/services/custom-software-development",
    cta: "Custom software development",
  },
  {
    title: "Teams that need capacity",
    text: "Add developers and IT specialists to your team for the length of a project, on flexible terms.",
    link: "/services/staff-augmentation",
    cta: "Staff augmentation",
  },
];

const TECH = [
  { area: "Front end", items: "React, Next.js, TypeScript, Tailwind CSS" },
  { area: "Mobile", items: "Kotlin, Swift, Flutter, React Native" },
  { area: "Back end and data", items: "Node.js, Laravel, Python, PostgreSQL, MySQL" },
  { area: "Games and Web3", items: "Unity, Unreal Engine, Godot, Solidity" },
  { area: "AI and language", items: "LLM APIs, Python, vector search, spaCy" },
  { area: "Cloud and delivery", items: "AWS, Google Cloud, Docker, Cloudflare, CI/CD" },
];

const FEATURED_TOOLS = [
  { slug: "image-compressor", name: "Image Compressor", text: "Make JPG, PNG and WebP images smaller before you upload them." },
  { slug: "merge-pdf", name: "Merge PDF", text: "Combine several PDF files into one, in the order you choose." },
  { slug: "json-formatter", name: "JSON Formatter & Validator", text: "Format, validate and minify JSON, with errors shown by line." },
  { slug: "qr-code-generator", name: "QR Code Generator", text: "Create QR codes for links, Wi-Fi, contacts and more." },
  { slug: "backlink-checker", name: "Backlink Checker", text: "Audit a Search Console or Ahrefs export: domains, anchors and spam links." },
  { slug: "schema-markup-generator", name: "Schema Markup Generator", text: "Generate JSON-LD for FAQ, product, article and local business pages." },
];

const FAQS = [
  {
    q: "What does Zoqonyx do?",
    a: "We design and build mobile apps, websites, games and custom business software, offer digital marketing and AI development, add developers to your team, and run a library of free online tools.",
  },
  {
    q: "How do I get a quote?",
    a: "Use the form on this page or email hello@zoqonyx.com with a short description of your project. We reply with questions and, once we understand the scope, a written estimate.",
  },
  {
    q: "Do you work with small businesses and start-ups?",
    a: "Yes. Working in stages lets you begin with a small first version and add to it as your budget and needs grow.",
  },
  {
    q: "Who owns the code and designs?",
    a: "Ownership is written into the project agreement before work starts, so both sides know what you receive.",
  },
  {
    q: "Are the online tools really free?",
    a: "Yes. They are free to use with no sign-up. Most tools process your files in your browser. A few network tools, such as DNS lookup, IP lookup and SSL checker, contact a public service or our server to get their results.",
  },
];

export default async function HomePage() {
  let tools: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    isComingSoon: boolean;
    icon: string | null;
    order: number;
  }> = [];

  try {
    tools = await prisma.tool.findMany({
      where: { isActive: true, isComingSoon: false },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        isActive: true,
        isComingSoon: true,
        icon: true,
        order: true,
      },
    });
  } catch (error) {
    console.error("Error fetching tools for homepage:", error);
  }

  const defaultToolsFormatted = DEFAULT_TOOLS.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
    isActive: t.isActive,
    isComingSoon: t.isComingSoon,
    icon: t.icon,
    order: t.order,
  }));

  const canonicalMap = new Map(DEFAULT_TOOLS.map((t) => [t.slug, t]));

  if (tools.length === 0) {
    tools = defaultToolsFormatted;
  } else {
    // Reconcile DB tools against canonical catalog to eliminate corrupted names/categories
    tools = tools.map((t) => {
      const c = canonicalMap.get(t.slug);
      return c
        ? {
            ...t,
            name: c.name,
            category: c.category,
            description: c.description,
            icon: c.icon,
            isComingSoon: c.isComingSoon,
          }
        : t;
    });

    // Merge: ensure all catalog tools are always displayed even if DB has fewer rows
    const dbSlugs = new Set(tools.map((t) => t.slug));
    const missing = defaultToolsFormatted.filter((t) => !dbSlugs.has(t.slug));
    tools = [...tools, ...missing].sort((a, b) => a.order - b.order);
  }

  const liveCount = new Set(tools.filter((t) => t.isActive && !t.isComingSoon).map((t) => t.slug)).size;

  const [services, posts, testimonials] = await Promise.all([getServices(), getPosts(), getTestimonials()]);
  const groups = groupServices(services);
  const options = services.filter((s) => !s.isHub || s.slug === "nft-development").map((s) => ({ slug: s.slug, name: s.name }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Zoqonyx",
      url: "https://zoqonyx.com",
      logo: "https://zoqonyx.com/logo/zoqonyx-icon.png",
      email: "hello@zoqonyx.com",
      description: "Software, app and website development, digital marketing and free online tools.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Zoqonyx",
      url: "https://zoqonyx.com",
    },
  ];

  const h2 = "text-2xl sm:text-[1.75rem] font-bold tracking-[-0.015em] leading-tight";

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <style>{ZQ_CSS}</style>

      <div className="zq-home">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-20 space-y-20 sm:space-y-24">
          {/* 1. Hero */}
          <header className="max-w-[48rem]">
            <h1 className="zq-reveal-solid text-[2.25rem] sm:text-[3.25rem] leading-[1.05] font-bold tracking-[-0.025em]" style={{ color: "var(--zq-ink)" }}>
              Apps, websites and software built for your business.
            </h1>
            <p
              className="zq-reveal mt-4 text-[17px] sm:text-lg leading-relaxed max-w-[40rem]"
              style={{ color: "var(--zq-muted)", ["--zq-delay" as string]: "70ms" }}
            >
              Zoqonyx designs and develops mobile apps, websites, games and custom software, helps people find you with digital marketing, and runs{" "}
              {liveCount} free online tools for PDFs, images, code and text.
            </p>
            <div className="zq-reveal mt-7 flex flex-wrap gap-3" style={{ ["--zq-delay" as string]: "140ms" }}>
              <a
                href="#contact"
                className="zq-focus inline-flex items-center h-12 px-7 rounded-md text-[16px] font-semibold text-white"
                style={{ background: "var(--zq-ink)" }}
              >
                Get a quote
              </a>
              <Link
                href="/services"
                className="zq-focus inline-flex items-center h-12 px-7 rounded-md text-[16px] font-semibold border"
                style={{ borderColor: "var(--zq-ink)", color: "var(--zq-ink)" }}
              >
                See our services
              </Link>
              <a href="#tools" className="zq-focus zq-link inline-flex items-center h-12 px-2 text-[16px] font-semibold">
                Use the free tools
              </a>
            </div>
          </header>

          {/* 2. Services */}
          <section aria-labelledby="services-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b-2" style={{ borderColor: "var(--zq-ink)" }}>
              <h2 id="services-heading" className={h2}>
                What we build
              </h2>
              <Link href="/services" className="zq-focus zq-link text-[15px] font-semibold rounded-[2px]">
                All services
              </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {groups.map(({ hub }) => (
                <li key={hub.slug} className="border-b py-4" style={{ borderColor: "var(--zq-line)" }}>
                  <Link href={`/services/${hub.slug}`} className="zq-focus zq-row block rounded-[2px]">
                    <span className="block text-[17px] font-semibold">{hub.name}</span>
                    <span className="block mt-1 text-[15px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
                      {hub.shortDesc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Free tools */}
          <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-24">
            <h2 id="tools-heading" className={`${h2} mb-2`}>
              Free online tools
            </h2>
            <p className="mb-6 max-w-[40rem] text-[16px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
              Open a tool and use it. No sign-up and no account. Most tools run in your browser, so the files you add stay on your device.
            </p>
            <ToolDrawer tools={tools} />
          </section>

          {/* 4. How we work */}
          <section aria-labelledby="process-heading">
            <h2 id="process-heading" className={`${h2} pb-2 border-b-2`} style={{ borderColor: "var(--zq-ink)" }}>
              How we work
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10">
              {PROCESS.map((p, i) => (
                <li key={p.title} className="border-b py-5" style={{ borderColor: "var(--zq-line)" }}>
                  <p className="text-[1.375rem] font-bold tabular-nums">{i + 1}.</p>
                  <h3 className="mt-1 text-[17px] font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
                    {p.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* 5. Who we help */}
          <section aria-labelledby="audience-heading">
            <h2 id="audience-heading" className={`${h2} pb-2 border-b-2`} style={{ borderColor: "var(--zq-ink)" }}>
              Who we work with
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
              {AUDIENCES.map((a) => (
                <li key={a.title} className="border-b py-5" style={{ borderColor: "var(--zq-line)" }}>
                  <h3 className="text-[17px] font-semibold">{a.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
                    {a.text}
                  </p>
                  <Link href={a.link} className="zq-focus zq-link mt-2 inline-block text-[15px] font-semibold rounded-[2px]">
                    {a.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Technologies */}
          <section aria-labelledby="tech-heading">
            <h2 id="tech-heading" className={`${h2} pb-2 border-b-2`} style={{ borderColor: "var(--zq-ink)" }}>
              Technologies we use
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {TECH.map((t) => (
                <div key={t.area} className="border-b py-4" style={{ borderColor: "var(--zq-line)" }}>
                  <dt className="text-[16px] font-semibold">{t.area}</dt>
                  <dd className="mt-1 text-[15px]" style={{ color: "var(--zq-muted)" }}>
                    {t.items}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 7. Popular tools */}
          <section aria-labelledby="featured-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b-2" style={{ borderColor: "var(--zq-ink)" }}>
              <h2 id="featured-heading" className={h2}>
                Tools people use most
              </h2>
              <Link href="/tools" className="zq-focus zq-link text-[15px] font-semibold rounded-[2px]">
                Browse all {liveCount} tools
              </Link>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10">
              {FEATURED_TOOLS.map((t) => (
                <li key={t.slug} className="border-b" style={{ borderColor: "var(--zq-line)" }}>
                  <Link href={`/tools/${t.slug}`} className="zq-focus zq-row block py-4 rounded-[2px]">
                    <span className="block text-[16px] font-semibold">{t.name}</span>
                    <span className="block mt-1 text-[15px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
                      {t.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* 8. Blog */}
          {posts.length > 0 && (
            <section aria-labelledby="blog-heading">
              <div className="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b-2" style={{ borderColor: "var(--zq-ink)" }}>
                <h2 id="blog-heading" className={h2}>
                  From the blog
                </h2>
                <Link href="/blog" className="zq-focus zq-link text-[15px] font-semibold rounded-[2px]">
                  All posts
                </Link>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
                {posts.slice(0, 3).map((p) => (
                  <li key={p.slug} className="border-b" style={{ borderColor: "var(--zq-line)" }}>
                    <Link href={`/blog/${p.slug}`} className="zq-focus zq-row block py-4 rounded-[2px]">
                      <span className="block text-[16px] font-semibold leading-snug">{p.title}</span>
                      <span className="block mt-1.5 text-[15px] leading-relaxed line-clamp-3" style={{ color: "var(--zq-muted)" }}>
                        {p.excerpt}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Testimonials: shown only when real ones are published in the admin */}
          <TestimonialsSection items={testimonials} />

          {/* 9. FAQ */}
          <section aria-labelledby="faq-heading" className="max-w-[46rem]">
            <h2 id="faq-heading" className={h2}>
              Common questions
            </h2>
            <div className="mt-5 border-t" style={{ borderColor: "var(--zq-line)" }}>
              {FAQS.map((f) => (
                <div key={f.q} className="py-4 border-b" style={{ borderColor: "var(--zq-line)" }}>
                  <h3 className="text-[17px] font-semibold leading-snug">{f.q}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: "var(--zq-muted)" }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Contact */}
          <ContactSection services={options} />
        </div>
      </div>
    </>
  );
}
