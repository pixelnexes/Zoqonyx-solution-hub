import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getPosts } from "@/lib/content";
import { readingMinutes } from "@/lib/markdown";
import { Reveal } from "@/components/kit/reveal";
import { CtaBand, PageHero } from "@/components/kit/page-kit";
import { BlogCover } from "@/components/kit/tech-scene";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Blog: SEO, Web, App & Tool Guides | Zoqonyx" },
  description: "Practical guides on SEO, websites, mobile apps and everyday online tools, written to answer the questions people really ask.",
  alternates: { canonical: "https://zoqonyx.com/blog" },
  openGraph: {
    title: "Blog: SEO, Web, App & Tool Guides | Zoqonyx",
    description: "Practical guides on SEO, websites, mobile apps and everyday online tools.",
    url: "https://zoqonyx.com/blog",
    type: "website",
    images: [{ url: "https://zoqonyx.com/logo/zoqonyx-og-v2.png", width: 1200, height: 630, alt: "Zoqonyx: software studio and free online tools" }],
  },
};

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export default async function BlogPage() {
  const posts = await getPosts();
  const [first, ...rest] = posts;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Zoqonyx Blog",
    url: "https://zoqonyx.com/blog",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://zoqonyx.com/blog/${p.slug}`,
      datePublished: p.publishedAt.toISOString(),
    })),
  };

  return (
    <div className="zq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        title="Guides on SEO, websites, apps and tools"
        intro="Plain-language answers to the questions people ask us before they build, fix or promote something online."
        image="/photos/u-board.webp"
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section">
        {first && (
          <Reveal>
            <Link href={`/blog/${first.slug}`} className="zq-card zq-card-hover group -mt-24 grid grid-cols-1 overflow-hidden md:grid-cols-[1.1fr_1fr] relative">
              <BlogCover seed={first.slug} category={first.category} className="h-60 w-full md:h-full" />
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="w-fit rounded-md bg-[#161513] px-2.5 py-1 text-sm font-semibold text-white">{first.category}</span>
                <h2 className="zq-display mt-4 text-2xl sm:text-3xl font-semibold leading-tight group-hover:text-[#B02E0E]">{first.title}</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-[#5E5B55] line-clamp-3">{first.excerpt}</p>
                <p className="mt-5 flex items-center gap-2 text-sm text-[#5E5B55]">
                  <Clock className="h-4 w-4" aria-hidden="true" /> {readingMinutes(first.content)} min read
                  <span aria-hidden="true">·</span> {fmt(first.publishedAt)}
                </p>
              </div>
            </Link>
          </Reveal>
        )}

        <h2 className="zq-display zq-h2 mt-16">Latest articles</h2>
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
              <Link href={`/blog/${p.slug}`} className="zq-card zq-card-hover group flex h-full flex-col overflow-hidden">
                <span className="relative block">
                  <BlogCover seed={p.slug} category={p.category} className="h-48 w-full transition-transform duration-500" />
                  <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-sm font-semibold text-[#161513] shadow-sm">{p.category}</span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-[18px] font-semibold leading-snug group-hover:text-[#B02E0E]">{p.title}</span>
                  <span className="mt-2 flex-1 text-[15px] leading-relaxed text-[#5E5B55] line-clamp-3">{p.excerpt}</span>
                  <span className="mt-4 flex items-center justify-between text-sm text-[#5E5B55]">
                    <span>
                      {readingMinutes(p.content)} min read · {fmt(p.publishedAt)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#B02E0E] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>

      <CtaBand heading="Have a question we have not answered?" text="Tell us what you are trying to do. We reply with a straight answer and may write it up as a guide." cta="Ask us" href="/contact" />
    </div>
  );
}
