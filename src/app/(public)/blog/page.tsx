import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { readingMinutes } from "@/lib/markdown";

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
    <div className="bg-[#F3F5F8] text-[#14213D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#4A5568]">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="hover:underline underline-offset-4">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-[#14213D]">
              Blog
            </li>
          </ol>
        </nav>
        <header className="max-w-[46rem] mb-10">
          <h1 className="text-[2rem] sm:text-[2.75rem] leading-[1.08] font-bold tracking-[-0.02em]">Blog</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#4A5568]">
            Guides on SEO, websites, mobile apps and the everyday tools on Zoqonyx, written to answer real questions.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {posts.map((p) => (
            <li key={p.slug} className="border-t border-[#D5DCE4] py-6">
              <p className="text-sm text-[#4A5568]">
                {p.category} · {fmt(p.publishedAt)} · {readingMinutes(p.content)} min read
              </p>
              <h2 className="mt-1.5 text-[1.375rem] font-bold leading-snug tracking-[-0.01em]">
                <Link href={`/blog/${p.slug}`} className="hover:underline underline-offset-4">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4A5568]">{p.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
