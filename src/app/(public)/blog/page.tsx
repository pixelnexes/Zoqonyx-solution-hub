import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getPosts } from "@/lib/content";
import { readingMinutes } from "@/lib/markdown";
import { CoverArt } from "@/components/kit/cover-art";
import { Reveal } from "@/components/kit/reveal";

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
  },
};

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
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
                Blog
              </li>
            </ol>
          </nav>
          <h1 className="zq-in-solid zq-display mt-5 text-4xl sm:text-6xl font-extrabold leading-[1.03]">Blog</h1>
          <p className="zq-in mt-4 max-w-2xl text-[18px] leading-relaxed zq-on-dark-muted">
            Guides on SEO, websites, mobile apps and the everyday tools on Zoqonyx, written to answer real questions.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section space-y-10">
        {first && (
          <Reveal>
            <Link href={`/blog/${first.slug}`} className="zq-card zq-card-hover group grid grid-cols-1 md:grid-cols-2 overflow-hidden">
              <CoverArt seed={first.slug} className="w-full h-56 md:h-full object-cover" />
              <div className="p-6 sm:p-9 flex flex-col justify-center">
                <p className="text-sm font-semibold text-[#0A5E44]">{first.category}</p>
                <h2 className="zq-display mt-2 text-2xl sm:text-3xl font-extrabold leading-tight group-hover:text-[#0A5E44]">{first.title}</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-[#4F5B57] line-clamp-3">{first.excerpt}</p>
                <p className="mt-4 flex items-center gap-2 text-sm text-[#4F5B57]">
                  <Clock className="w-4 h-4" aria-hidden="true" /> {readingMinutes(first.content)} min read · {fmt(first.publishedAt)}
                </p>
              </div>
            </Link>
          </Reveal>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
              <Link href={`/blog/${p.slug}`} className="zq-card zq-card-hover group flex h-full flex-col overflow-hidden">
                <CoverArt seed={p.slug} className="w-full h-44 object-cover" />
                <div className="p-5 flex flex-1 flex-col">
                  <p className="text-sm font-semibold text-[#0A5E44]">{p.category}</p>
                  <h2 className="mt-1.5 text-[18px] font-bold leading-snug group-hover:text-[#0A5E44]">{p.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4F5B57] line-clamp-3 flex-1">{p.excerpt}</p>
                  <p className="mt-4 flex items-center justify-between text-sm text-[#4F5B57]">
                    <span>{readingMinutes(p.content)} min read</span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#0A5E44]">
                      Read <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}
