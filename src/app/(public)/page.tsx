import { AREAS_SERVED, PARENT_LD } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ToolDrawer } from "@/components/home/tool-drawer";
import { ToolHero } from "@/components/home/tool-hero";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";
import { ScrollProgress } from "@/components/kit/motion";
import { TechLogo, TechSprite } from "@/components/kit/tech-logo";
import { BlogCover, TechRow, TechScene } from "@/components/kit/tech-scene";
import { Reveal } from "@/components/kit/reveal";
import { Slider } from "@/components/kit/slider";
import { serviceStyle } from "@/components/kit/icons";
import { readingMinutes } from "@/lib/markdown";
import { ArrowRight, ChevronDown, Rocket, TrendingUp, Users } from "lucide-react";
import { getPosts, getServices, getTestimonials, groupServices } from "@/lib/content";
import type { Metadata } from "next";

import { DEFAULT_TOOLS } from "@/lib/default-tools";

export const metadata: Metadata = {
  title: {
    absolute: "Zoqonyx: Free Online Tools for Files, Images and Code",
  },
  description:
    "146 free online tools for images, PDFs, code and text, with no account. Our team also builds apps, websites and software.",
  alternates: {
    canonical: "https://zoqonyx.com",
  },
  openGraph: {
    title: "Zoqonyx: Free Online Tools for Files, Images and Code",
    description: "146 free online tools for images, PDFs, code and text, with no account. Apps, websites and software built by our team.",
    url: "https://zoqonyx.com",
    type: "website",
    images: [{ url: "https://zoqonyx.com/logo/zoqonyx-og-v2.png", width: 1200, height: 630, alt: "Zoqonyx: software studio and free online tools" }],
  },
};

export const revalidate = 300;

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

const SERVICE_PHOTO: Record<string, string> = {
  "game-development": "game",
  "app-development": "phone-app",
  "website-development": "code2",
  "custom-software": "developer",
  "digital-marketing": "marketing",
  "ai-nlp-development": "keyboard",
  "nft-development": "city",
  "staff-augmentation": "team",
  "erp-crm-development": "workspace",
};

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
      logo: "https://zoqonyx.com/logo/zoqonyx-logo-v2.png",
      email: "hello@zoqonyx.com",
      areaServed: AREAS_SERVED,
      parentOrganization: PARENT_LD,
      description: "Software, app and website development, digital marketing and free online tools.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Zoqonyx",
      url: "https://zoqonyx.com",
    },
  ];



  return (
    <div className="zq-page">
      <TechSprite />
      <ScrollProgress />
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <ToolHero tools={tools.map((t) => ({ ...t, description: t.description.slice(0, 90) }))} count={liveCount} />

      {/* 3. Services */}
      <section aria-labelledby="services-heading" className="zq-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="services-heading" className="zq-display zq-h2">
                What we build
              </h2>
              <p className="mt-3 zq-lead max-w-xl">Pick a service to see what we deliver and how we work.</p>
            </div>
            <Link href="/services" className="zq-btn zq-btn-outline !h-11">
              All services <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(({ hub, children }, i) => {
              const { Icon, accent } = serviceStyle(hub.slug);
              return (
                <Reveal as="li" key={hub.slug} delay={(i % 3) * 90}>
                  <Link href={`/services/${hub.slug}`} className="zq-card group relative flex h-full flex-col overflow-hidden">
                    <TechScene group={hub.group} className="h-40 w-full !rounded-none" />
                    <div className="flex flex-1 flex-col p-6 -mt-10 relative">
                    <span className={`zq-chip ${accent.chip} ring-4 ring-white`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <h3 className="zq-display mt-4 text-[1.35rem] font-semibold leading-tight">{hub.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#5E5B55]">{hub.shortDesc}</p>
                    <div className="mt-3 flex-1"><TechRow group={hub.group} /></div>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: accent.color }}>
                      {children.length > 0 ? `${children.length} services` : "Learn more"} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 4. Free tools by category */}
      <section aria-labelledby="tools-heading" className="zq-band-tint zq-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="tools-heading" className="zq-display zq-h2">
            Every tool by category
          </h2>
          <p className="mt-3 mb-8 zq-lead max-w-2xl">Most tools run in your browser, so the files you add stay on your device.</p>
          <ToolDrawer hideSearch tools={tools.map((t) => ({ ...t, description: "" }))} />
        </div>
      </section>

      {/* 4b. Why Zoqonyx */}
      <section aria-labelledby="why-heading" className="zq-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <Reveal>
            <TechScene photo="/photos/u-dev.webp" techs={["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare", "Docker"]} className="h-72 w-full lg:h-[26rem]" />
          </Reveal>
          <div>
            <h2 id="why-heading" className="zq-display zq-h2">
              One team for the build, the launch and the search traffic
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                ["We plan before we build", "A short written plan with scope, steps and a fixed first stage, so you know what happens next."],
                ["You see progress every week", "Working builds you can click through, not status reports."],
                ["You own the result", "Code, designs and accounts are yours from the first payment."],
              ].map(([t, d]) => (
                <li key={t} className="border-l-4 border-[#D63A14] pl-4">
                  <p className="text-[18px] font-semibold">{t}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#5E5B55]">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. How we work */}
      <section aria-labelledby="process-heading" className="zq-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="process-heading" className="zq-display zq-h2">
            How we work
          </h2>
          <ol className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 90}>
                <div className="zq-card h-full p-6 relative">
                  <span className="zq-chip zq-g-indigo zq-display text-xl font-semibold" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[18px] font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#5E5B55]">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5b. Engagement models */}
      <section aria-labelledby="models-heading" className="zq-band-tint zq-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="models-heading" className="zq-display zq-h2 max-w-2xl">
            Three ways to work with us
          </h2>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Fixed-scope project", d: "A clear scope, timeline and price for an app, website or tool. Best when you know what you want built.", href: "/services", cta: "See services", dark: false },
              { t: "Dedicated team", d: "A small team that works only on your product month after month, with weekly demos.", href: "/services/custom-software", cta: "Custom software", dark: true },
              { t: "Extra developers", d: "Add one or more developers to your own team for as long as the work needs them.", href: "/services/staff-augmentation", cta: "Staff augmentation", dark: false },
            ].map((m, i) => (
              <Reveal as="li" key={m.t} delay={i * 90}>
                <div className={`flex h-full flex-col rounded-xl border p-7 ${m.dark ? "border-[#161513] bg-[#161513] text-white" : "border-[#E5E2DC] bg-white text-[#161513]"}`}>
                  <h3 className="zq-display text-2xl font-semibold">{m.t}</h3>
                  <p className={`mt-3 flex-1 text-[16px] leading-relaxed ${m.dark ? "zq-on-dark-muted" : "text-[#5E5B55]"}`}>{m.d}</p>
                  <Link href={m.href} className={`mt-6 inline-flex items-center gap-1.5 font-semibold ${m.dark ? "text-white underline underline-offset-4" : "text-[#B02E0E]"}`}>
                    {m.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Who we work with */}
      <section aria-labelledby="audience-heading" className="zq-band-dark">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center">
            <div>
              <h2 id="audience-heading" className="zq-display zq-h2">
                Who we work with
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed zq-on-dark-muted max-w-md">Founders, growing companies and teams that need extra hands. We start with a call, a plain-language plan and a fixed first step.</p>
            </div>
            <TechScene photo="/photos/u-team.webp" techs={["React", "Node.js", "Python", "Docker", "PostgreSQL"]} className="h-56 w-full lg:h-72" />
          </div>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIENCES.map((a, i) => {
              const icons = [Rocket, TrendingUp, Users];
              const Icon = icons[i];
              const chip = ["zq-g-slate", "zq-g-slate", "zq-g-slate"][i];
              return (
                <Reveal as="li" key={a.title} delay={i * 100}>
                  <div className="h-full rounded-xl border border-white/15 bg-white/[0.06] p-6">
                    <span className={`zq-chip ${chip}`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-[20px] font-semibold">{a.title}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed zq-on-dark-muted">{a.text}</p>
                    <Link href={a.link} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-white underline underline-offset-4">
                      {a.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 8. Blog slider */}
      {posts.length > 0 && (
        <section aria-labelledby="blog-heading" className="zq-band-tint zq-section">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
              <h2 id="blog-heading" className="zq-display zq-h2">
                From the blog
              </h2>
              <Link href="/blog" className="font-semibold text-[#B02E0E] hover:underline underline-offset-4">
                All posts
              </Link>
            </div>
            <Slider label="blog posts">
              {posts.slice(0, 8).map((p) => (
                <div key={p.slug} className="zq-slide">
                  <Link href={`/blog/${p.slug}`} className="zq-card group flex h-full flex-col overflow-hidden">
                    <BlogCover seed={p.slug} category={p.category} className="aspect-[16/9] w-full transition-transform duration-500" />
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-sm font-semibold text-[#B02E0E]">
                        {p.category} · {readingMinutes(p.content)} min read
                      </p>
                      <h3 className="mt-1.5 text-[17px] font-semibold leading-snug">{p.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#5E5B55] line-clamp-3">{p.excerpt}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}

      {/* Testimonials: shown only when real ones are published in the admin */}
      <TestimonialsSection items={testimonials} />

      {/* 9. FAQ */}
      <section aria-labelledby="faq-heading" className="zq-section">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="zq-display zq-h2 text-center">
            Common questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="zq-card group p-0 open:shadow-[0_14px_36px_-18px_rgba(22,21,19,.35)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="w-5 h-5 shrink-0 text-[#D63A14] transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#5E5B55]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Contact */}
      <ContactSection services={options} />
    </div>
  );
}
