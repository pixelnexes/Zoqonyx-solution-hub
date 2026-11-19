import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, getServices } from "@/lib/content";
import { extractHeadings, readingMinutes, renderMarkdown } from "@/lib/markdown";
import { ContactSection } from "@/components/site/sections";
import { photoFor } from "@/components/kit/page-kit";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: "Post not found | Zoqonyx" };
  const title = p.metaTitle || `${p.title} | Zoqonyx`;
  const description = p.metaDesc || p.excerpt.slice(0, 155);
  const url = `https://zoqonyx.com/blog/${p.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: p.publishedAt.toISOString(),
      modifiedTime: p.updatedAt.toISOString(),
      ...(p.coverImage ? { images: [p.coverImage] } : {}),
    },
    twitter: { card: p.coverImage ? "summary_large_image" : "summary", title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts, services] = await Promise.all([getPost(slug), getPosts(), getServices()]);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);
  const options = services.filter((s) => !s.isHub || s.slug === "nft-development").map((s) => ({ slug: s.slug, name: s.name }));
  const url = `https://zoqonyx.com/blog/${post.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDesc || post.excerpt,
      mainEntityOfPage: url,
      datePublished: post.publishedAt.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      author: { "@type": "Organization", name: post.authorName || "Zoqonyx Team", url: "https://zoqonyx.com" },
      publisher: {
        "@type": "Organization",
        name: "Zoqonyx",
        logo: { "@type": "ImageObject", url: "https://zoqonyx.com/logo/zoqonyx-icon.png" },
      },
      ...(post.coverImage ? { image: post.coverImage } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://zoqonyx.com" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://zoqonyx.com/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <div className="zq-page">
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="zq-hero-light">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-12 text-center">
          <nav aria-label="Breadcrumb" className="text-sm text-[#4F5B57]">
            <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="hover:underline underline-offset-4">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:underline underline-offset-4">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="max-w-[14rem] truncate font-semibold text-[#10181A] sm:max-w-md">
                {post.title}
              </li>
            </ol>
          </nav>
          <p className="mt-6 inline-flex rounded-md bg-[#0E7C5A] px-3 py-1 text-sm font-semibold text-white">{post.category}</p>
          <h1 className="zq-in-solid zq-display mt-4 text-3xl sm:text-5xl font-extrabold leading-[1.08] text-[#10181A]">{post.title}</h1>
          <p className="zq-in mx-auto mt-4 max-w-2xl text-[18px] leading-relaxed text-[#4F5B57]">{post.excerpt}</p>
          <p className="mt-5 text-sm text-[#4F5B57]">
            By {post.authorName} · {fmt(post.publishedAt)} · {readingMinutes(post.content)} min read
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,46rem)_1fr]">
        <article className="-mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoFor(post.slug)} alt="" width={960} height={640} fetchPriority="high" className="h-56 w-full rounded-xl object-cover shadow-[0_24px_60px_-34px_rgba(16,24,26,.5)] sm:h-80" />
          <div className="zq-prose mt-8 text-[17px] leading-[1.75]">{renderMarkdown(post.content)}</div>
          <p className="mt-10 border-t border-[#DFE3DA] pt-5 text-sm text-[#4F5B57]">
            Written by {post.authorName}. Last updated {fmt(post.updatedAt)}.
          </p>
        </article>

        <aside className="hidden lg:block pt-2">
          <div className="sticky top-24 space-y-5">
            {headings.length >= 3 && (
              <nav aria-label="On this page" className="zq-card p-5 text-[15px]">
                <p className="mb-2 font-bold">On this page</p>
                <ul className="space-y-1.5 border-l-2 border-[#DFE3DA]">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="block pl-3 text-[#4F5B57] hover:text-[#0A5E44] hover:underline underline-offset-4">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="rounded-xl bg-[#10181A] p-5 text-white">
              <p className="zq-display text-lg font-extrabold leading-snug">Need help with this?</p>
              <p className="mt-2 text-[15px] zq-on-dark-muted">Tell us what you are working on and we reply with next steps.</p>
              <a href="#contact" className="zq-btn zq-btn-sun mt-4 w-full">
                Get a quote
              </a>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="more-heading" className="zq-band-tint zq-section">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="more-heading" className="zq-display zq-h2">
              More from the blog
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="zq-card zq-card-hover group flex h-full flex-col overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoFor(r.slug)} alt="" width={640} height={427} loading="lazy" className="h-40 w-full object-cover" />
                    <span className="p-5">
                      <span className="block text-[17px] font-bold leading-snug group-hover:text-[#0A5E44]">{r.title}</span>
                      <span className="mt-1.5 block text-sm text-[#4F5B57] line-clamp-2">{r.excerpt}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ContactSection services={options} heading="Need help with this?" intro="Tell us what you are working on and we will reply with suggestions and next steps." />
    </div>
  );
}
