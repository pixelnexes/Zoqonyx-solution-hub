import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ToolDrawer } from "@/components/home/tool-drawer";
import { ContactSection, TestimonialsSection } from "@/components/site/sections";
import { ParallaxImg, ScrollProgress, CountUp } from "@/components/kit/motion";
import { TechLogo } from "@/components/kit/tech-logo";
import LogoLoop from "@/components/reactbits/LogoLoop";
import LightRays from "@/components/reactbits/LightRays";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { Reveal } from "@/components/kit/reveal";
import { Slider } from "@/components/kit/slider";
import { CoverArt } from "@/components/kit/cover-art";
import { serviceStyle, categoryStyle } from "@/components/kit/icons";
import { readingMinutes } from "@/lib/markdown";
import { ArrowRight, ChevronDown, Rocket, TrendingUp, Users } from "lucide-react";
import { ToolIcon } from "@/components/common/tool-icon";
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


  const TECH_PILLS = TECH.flatMap((t) => t.items.split(", "));

  return (
    <div className="zq-page">
      <ScrollProgress />
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      {/* 1. Hero */}
      <section className="zq-hero-light">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 text-center">
          <p className="zq-in inline-flex rounded-md border border-[#0B1F3A]/20 bg-white/70 px-3 py-1 text-sm font-semibold">Software studio and free online tools</p>
          <h1 className="zq-in-solid zq-display mx-auto mt-5 max-w-4xl text-[2.5rem] sm:text-6xl lg:text-[3.75rem] font-extrabold leading-[1.03] text-[#0B1F3A]">
            Apps, websites and software built for your business.
          </h1>
          <p className="zq-in mx-auto mt-5 max-w-2xl text-[18px] leading-relaxed text-[#51607A]" style={{ ["--d" as string]: "90ms" }}>
            Zoqonyx designs and develops mobile apps, websites, games and custom software, helps people find you with digital marketing, and runs {liveCount} free online tools.
          </p>
          <div className="zq-in mt-8 flex flex-wrap justify-center gap-3" style={{ ["--d" as string]: "180ms" }}>
            <a href="#contact" className="zq-btn zq-btn-indigo">
              Get a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <Link href="/services" className="zq-btn zq-btn-outline">
              See our services
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#51607A]">
            Or <a href="#tools" className="font-semibold text-[#067A57] underline underline-offset-4">use the free tools</a>. No sign-up.
          </p>

          {/* Real screenshots of our own tools */}
          <div className="zq-in relative mx-auto mt-12 max-w-5xl pb-0" style={{ ["--d" as string]: "260ms" }}>
            <div className="overflow-hidden rounded-t-2xl border border-b-0 border-[#0B1F3A]/15 bg-white shadow-[0_30px_80px_-30px_rgba(11,31,58,.45)]">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-4 py-2.5 text-left text-sm text-[#51607A]">
                <span className="rounded-md bg-[#F5F8FB] px-3 py-1 font-mono text-[13px]">zoqonyx.com/tools/json-formatter</span>
              </div>
              <img src="/shots/json.png" alt="The JSON formatter tool showing formatted output" width={1088} height={515} fetchPriority="high" className="w-full" />
            </div>
            <div className="zq-float absolute -left-4 bottom-8 hidden w-64 overflow-hidden rounded-xl border border-[#0B1F3A]/15 bg-white shadow-[0_24px_60px_-24px_rgba(11,31,58,.5)] lg:block" style={{ ["--r" as string]: "-3deg" }}>
              <img src="/shots/compress.png" alt="The image compressor tool" width={1088} height={384} loading="lazy" className="w-full" />
            </div>
            <div className="zq-float absolute -right-4 top-16 hidden w-56 overflow-hidden rounded-xl border border-[#0B1F3A]/15 bg-white shadow-[0_24px_60px_-24px_rgba(11,31,58,.5)] lg:block" style={{ ["--r" as string]: "3deg", ["--d" as string]: "-2s" }}>
              <img src="/shots/qr.png" alt="The QR code generator tool" width={1088} height={640} loading="lazy" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Technologies marquee */}
      <section aria-label="Technologies we use" className="zq-band-white border-b border-[#E2E8F0] py-6">
        <LogoLoop
          logos={Array.from(new Set(TECH_PILLS)).map((t) => ({ node: <span className="zq-pill"><TechLogo name={t} /></span>, title: t }))}
          speed={55}
          gap={16}
          logoHeight={44}
          pauseOnHover
          fadeOut
          fadeOutColor="#FFFFFF"
          ariaLabel="Technologies we use"
        />
      </section>

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
                    <span className="zq-duo block h-40 w-full">
                      <img src={`/photos/${SERVICE_PHOTO[hub.slug] || "developer"}.jpg`} alt="" width={640} height={427} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span className="zq-duo-tint" style={{ background: accent.color }} />
                    </span>
                    <div className="flex flex-1 flex-col p-6 -mt-10 relative">
                    <span className={`zq-chip ${accent.chip} ring-4 ring-white`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <h3 className="zq-display mt-4 text-[1.35rem] font-extrabold leading-tight">{hub.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#51607A] flex-1">{hub.shortDesc}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: accent.color }}>
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

      {/* 3b. Numbers */}
      <section aria-label="Zoqonyx in numbers" className="bg-[#0B1F3A] text-white">
        <ul className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-y-8 py-10">
          {[
            { n: liveCount, s: "", l: "free online tools" },
            { n: services.length, s: "", l: "services you can hire" },
            { n: posts.length, s: "", l: "guides on the blog" },
            { n: groups.length, s: "", l: "service areas" },
          ].map((x) => (
            <li key={x.l} className="px-2 md:border-l md:border-white/15 md:pl-8 first:border-0 first:pl-2">
              <p className="zq-display text-4xl sm:text-5xl font-extrabold text-[#F2A81D]">
                <CountUp to={x.n} suffix={x.s} />
              </p>
              <p className="mt-1 text-[15px] zq-on-dark-muted">{x.l}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Free tools */}
      <section id="tools" aria-labelledby="tools-heading" className="zq-band-tint zq-section scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="tools-heading" className="zq-display zq-h2">
            Free online tools
          </h2>
          <p className="mt-3 mb-8 zq-lead max-w-2xl">Open a tool and use it. No sign-up and no account. Most tools run in your browser, so the files you add stay on your device.</p>
          <ToolDrawer tools={tools} />
        </div>
      </section>

      {/* 4b. Why Zoqonyx */}
      <section aria-labelledby="why-heading" className="zq-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <Reveal>
            <ParallaxImg src="/photos/workspace.jpg" alt="A tidy desk with a laptop and a plant" className="h-72 lg:h-[26rem] rounded-xl" />
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
                <li key={t} className="border-l-4 border-[#0E9F6E] pl-4">
                  <p className="text-[18px] font-bold">{t}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#51607A]">{d}</p>
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
                  <span className="zq-chip zq-g-indigo zq-display text-xl font-extrabold" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[18px] font-bold">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#51607A]">{p.text}</p>
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
                <SpotlightCard theme={m.dark ? "dark" : "light"} spotlightColor="#4ADE9F" className={`flex h-full flex-col p-7 ${m.dark ? "text-white" : "text-[#0B1F3A]"}`}>
                  <h3 className="zq-display text-2xl font-extrabold">{m.t}</h3>
                  <p className={`mt-3 flex-1 text-[16px] leading-relaxed ${m.dark ? "zq-on-dark-muted" : "text-[#51607A]"}`}>{m.d}</p>
                  <Link href={m.href} className={`mt-6 inline-flex items-center gap-1.5 font-bold ${m.dark ? "text-[#F2A81D]" : "text-[#067A57]"}`}>
                    {m.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Who we work with */}
      <section aria-labelledby="audience-heading" className="zq-band-dark">
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-70">
          <LightRays raysOrigin="top-center" raysColor="#4ADE9F" raysSpeed={0.8} lightSpread={0.9} rayLength={1.4} followMouse mouseInfluence={0.08} />
        </div>
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center">
            <div>
              <h2 id="audience-heading" className="zq-display zq-h2">
                Who we work with
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed zq-on-dark-muted max-w-md">Founders, growing companies and teams that need extra hands. We start with a call, a plain-language plan and a fixed first step.</p>
            </div>
            <img src="/photos/team.jpg" alt="People working around a table with notebooks and laptops" width={960} height={640} loading="lazy" className="w-full h-56 lg:h-72 rounded-xl object-cover" />
          </div>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIENCES.map((a, i) => {
              const icons = [Rocket, TrendingUp, Users];
              const Icon = icons[i];
              const chip = ["zq-g-sun", "zq-g-aqua", "zq-g-coral"][i];
              return (
                <Reveal as="li" key={a.title} delay={i * 100}>
                  <div className="h-full rounded-xl border border-white/15 bg-white/[0.06] p-6">
                    <span className={`zq-chip ${chip}`}>
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-[20px] font-bold">{a.title}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed zq-on-dark-muted">{a.text}</p>
                    <Link href={a.link} className="mt-4 inline-flex items-center gap-1.5 font-bold text-[#F2A81D] hover:underline underline-offset-4">
                      {a.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 6b. Apps band with parallax photo */}
      <section aria-labelledby="apps-heading" className="relative isolate overflow-hidden text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <ParallaxImg src="/photos/city.jpg" className="h-full w-full" speed={0.2} />
          <div className="absolute inset-0 bg-[#0B1F3A]/75" />
        </div>
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <h2 id="apps-heading" className="zq-display zq-h2">
              Have an app or website idea? Let us scope it.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed zq-on-dark-muted max-w-xl">Tell us what you want to build. We reply with questions, a rough plan and the first step.</p>
            <a href="#contact" className="zq-btn zq-btn-sun mt-7">
              Get a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
          <Reveal>
            <img src="/photos/phone-app.jpg" alt="A phone showing an app home screen" width={960} height={640} loading="lazy" className="h-64 w-full rounded-xl object-cover" />
          </Reveal>
        </div>
      </section>

      {/* 7. Popular tools slider */}
      <section aria-labelledby="featured-heading" className="zq-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
            <h2 id="featured-heading" className="zq-display zq-h2">
              Tools people use most
            </h2>
            <Link href="/tools" className="font-bold text-[#067A57] hover:underline underline-offset-4">
              Browse all {liveCount} tools
            </Link>
          </div>
          <Slider label="popular tools">
            {FEATURED_TOOLS.map((t) => {
              const tool = tools.find((x) => x.slug === t.slug);
              const { accent } = categoryStyle(tool?.category || "");
              return (
                <div key={t.slug} className="zq-slide">
                  <Link href={`/tools/${t.slug}`} className="zq-card group flex h-full flex-col p-6" style={{ minHeight: 210 }}>
                    <span className={`zq-chip ${accent.chip}`} aria-hidden="true">
                      <ToolIcon name={tool?.icon ?? null} className="w-6 h-6" strokeWidth={2} />
                    </span>
                    <h3 className="mt-4 text-[18px] font-bold">{t.name}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[#51607A] flex-1">{t.text}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: accent.color }}>
                      Open tool <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              );
            })}
          </Slider>
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
              <Link href="/blog" className="font-bold text-[#067A57] hover:underline underline-offset-4">
                All posts
              </Link>
            </div>
            <Slider label="blog posts">
              {posts.slice(0, 8).map((p) => (
                <div key={p.slug} className="zq-slide">
                  <Link href={`/blog/${p.slug}`} className="zq-card group flex h-full flex-col overflow-hidden">
                    <CoverArt seed={p.slug} className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-sm font-semibold text-[#067A57]">
                        {p.category} · {readingMinutes(p.content)} min read
                      </p>
                      <h3 className="mt-1.5 text-[17px] font-bold leading-snug">{p.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#51607A] line-clamp-3">{p.excerpt}</p>
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
              <details key={f.q} className="zq-card group p-0 open:shadow-[0_14px_36px_-18px_rgba(11,31,58,.35)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="w-5 h-5 shrink-0 text-[#0E9F6E] transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 text-[16px] leading-relaxed text-[#51607A]">{f.a}</p>
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
