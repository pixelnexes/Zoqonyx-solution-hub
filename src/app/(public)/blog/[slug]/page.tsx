import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, getServices } from "@/lib/content";
import { extractHeadings, readingMinutes, renderMarkdown } from "@/lib/markdown";
import { ContactSection } from "@/components/site/sections";
import { CoverArt } from "@/components/kit/cover-art";

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

      <section className="zq-banner">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-white/75">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
              <li aria-current="page" className="font-semibold text-white truncate max-w-[14rem] sm:max-w-md">
                {post.title}
              </li>
            </ol>
          </nav>
          <p className="mt-6 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">{post.category}</p>
          <h1 className="zq-in-solid zq-display mt-3 max-w-3xl text-3xl sm:text-5xl font-extrabold leading-[1.08]">{post.title}</h1>
          <p className="zq-in mt-4 max-w-2xl text-[18px] leading-relaxed zq-on-dark-muted">{post.excerpt}</p>
          <p className="mt-5 text-sm text-white/80">
            {fmt(post.publishedAt)} · {readingMinutes(post.content)} min read · {post.authorName}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 zq-section grid grid-cols-1 lg:grid-cols-[minmax(0,46rem)_1fr] gap-12">
        <article>
          <CoverArt seed={post.slug} className="w-full h-48 sm:h-64 rounded-2xl object-cover mb-8" />
          <div className="zq-prose text-[17px] leading-[1.75]">{renderMarkdown(post.content)}</div>
          <p className="mt-10 pt-5 border-t border-[#DFE3DA] text-sm text-[#4F5B57]">
            Written by {post.authorName}. Last updated {fmt(post.updatedAt)}.
          </p>
        </article>

        {headings.length >= 3 && (
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24 text-[15px] zq-card p-5">
              <p className="font-bold mb-2">On this page</p>
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
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section aria-labelledby="more-heading" className="zq-band-tint zq-section">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="more-heading" className="zq-display zq-h2">
              More from the blog
            </h2>
            <ul className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="zq-card zq-card-hover group flex h-full flex-col overflow-hidden">
                    <CoverArt seed={r.slug} className="w-full h-36 object-cover" />
                    <span className="p-5">
                      <span className="block text-[17px] font-bold leading-snug group-hover:text-[#0A5E44]">{r.title}</span>
                      <span className="block mt-1.5 text-sm text-[#4F5B57] line-clamp-2">{r.excerpt}</span>
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
