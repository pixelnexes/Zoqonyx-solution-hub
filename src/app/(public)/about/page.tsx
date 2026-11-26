import { prisma } from "@/lib/prisma";
import { photoAlt } from "@/lib/photos";
import { PageHero } from "@/components/kit/page-kit";
import type { Metadata } from "next";
import { ShieldCheck, Zap, Lock, Cpu, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AREAS_SERVED, PARENT_LD } from "@/lib/company";
import { RequestTool } from "@/components/site/request-tool";
import { MarkdownRenderer } from "@/components/common/markdown-renderer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "About Zoqonyx, a Newix Tech Solutions Product",
  },
  description:
    "Zoqonyx is a product of Newix Tech Solutions, a Dubai company founded in 2020. 146 free online tools, no sign-up. Request the tool you need.",
  alternates: {
    canonical: "https://zoqonyx.com/about",
  },
};

const DEFAULT_ABOUT_CONTENT = `## Who makes Zoqonyx

Zoqonyx is a product of [Newix Tech Solutions](https://newixtechsolutions.com/), a company based in Dubai with a mostly remote team. Newix was founded in 2020 and worked offline at first. Its online presence started in 2024.

## What Newix does

- Builds, delivers and manages software products: web apps, websites, mobile apps and games
- Provides product management and team support for businesses
- Works as a white-label partner for agencies

Newix works with clients in the United States, the United Kingdom, Germany and other European countries, the Gulf and Asia. You can see its [project portfolio](https://newixtechsolutions.com/portfolio/) and follow the [company on LinkedIn](https://linkedin.com/company/newixtech).

## Why Zoqonyx exists

Zoqonyx gives developers and everyday users free tools for images, PDFs, code, text and calculations, with no account and no paid tier. Most tools run in your browser, so the files you add stay on your device. A few network tools, such as DNS lookup, IP lookup and the SSL checker, contact a public service or our server to get their results.

## Still growing

Zoqonyx is an ongoing project built by the whole team. If a tool you need is missing, or something does not work as you expect, tell us and we will look at adding or fixing it.`;

export default async function AboutPage() {
  let dbPage = null;
  try {
    dbPage = await prisma.page.findUnique({
      where: { slug: "about" },
    });
  } catch (e) {
    console.error("Error fetching about page:", e);
  }

  // The first seeded About text in the database is outdated; text edited later in the admin still wins.
  const edited = dbPage?.content && !dbPage.content.includes("Zero-Upload Browser Architecture");
  const content = edited ? dbPage!.content : DEFAULT_ABOUT_CONTENT;
  const title = "About Zoqonyx";

  const stats = [
    { v: "146", l: "Live free tools", g: "zq-g-indigo", I: Cpu },
    { v: "Browser", l: "Where most tools process your files", g: "zq-g-aqua", I: Globe },
    { v: "Free", l: "No login and no paid tier", g: "zq-g-emerald", I: ShieldCheck },
    { v: "No wait", l: "No upload queue for browser tools", g: "zq-g-sun", I: Zap },
  ];
  const features = [
    { I: Lock, g: "zq-g-violet", t: "Privacy by design", d: "Most tools process files in your browser, so what you add stays on your device." },
    { I: Zap, g: "zq-g-coral", t: "Fast bulk processing", d: "Process up to 100 photos or documents (1 GB combined) at once, with clear progress indicators." },
  ];

  const aboutLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://zoqonyx.com/about#page",
        url: "https://zoqonyx.com/about",
        name: "About Zoqonyx",
        about: { "@id": "https://zoqonyx.com/#organization" },
      },
      {
      "@type": "Organization",
      "@id": "https://zoqonyx.com/#organization",
      name: "Zoqonyx",
      url: "https://zoqonyx.com",
      logo: "https://zoqonyx.com/logo/zoqonyx-logo-v2.png",
      email: "hello@zoqonyx.com",
      areaServed: AREAS_SERVED,
      parentOrganization: PARENT_LD,
    },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://zoqonyx.com" },
          { "@type": "ListItem", position: 2, name: "About", item: "https://zoqonyx.com/about" },
        ],
      },
    ],
  };

  return (
    <div className="zq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} title={title} intro="Free online tools for developers and everyday users, made by Newix Tech Solutions in Dubai and a remote team." badge="Built by Newix Tech Solutions" image="/photos/u-office2.webp" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 zq-section space-y-10">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-6 relative">
          {stats.map((x) => (
            <li key={x.l} className="zq-card p-5">
              <span className={`zq-chip zq-chip-sm ${x.g}`} aria-hidden="true">
                <x.I className="w-[18px] h-[18px]" />
              </span>
              <p className="zq-display mt-3 text-2xl font-semibold">{x.v}</p>
              <p className="text-sm text-[#5E5B55]">{x.l}</p>
            </li>
          ))}
        </ul>

        <div className="grid gap-4 sm:grid-cols-3">
          {["u-team", "u-dev", "u-server"].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={`/photos/${n}.webp`} alt={photoAlt(n)} width={1200} height={800} loading="lazy" className="h-48 w-full rounded-xl object-cover" />
          ))}
        </div>

        <div className="zq-card p-6 sm:p-10">
          <MarkdownRenderer content={content} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.t} className="zq-card p-6">
              <span className={`zq-chip ${f.g}`} aria-hidden="true">
                <f.I className="w-6 h-6" />
              </span>
              <h2 className="mt-4 text-xl font-semibold">{f.t}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#5E5B55]">{f.d}</p>
            </div>
          ))}
        </div>

        <RequestTool />

        <div className="rounded-[22px] p-7 sm:p-9 text-white flex flex-col sm:flex-row items-center justify-between gap-5" style={{ background: "#161513" }}>
          <div>
            <p className="zq-display text-2xl font-semibold">Ready to try a tool?</p>
            <p className="mt-1 zq-on-dark-muted">Open any of the free tools. No sign-up needed.</p>
          </div>
          <Link href="/tools" className="zq-btn zq-btn-sun shrink-0">
            Explore all tools <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
