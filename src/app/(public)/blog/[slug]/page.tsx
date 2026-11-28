import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, getServices } from "@/lib/content";
import { extractHeadings, readingMinutes, renderMarkdown } from "@/lib/markdown";
import { ContactSection } from "@/components/site/sections";
import { BlogCover } from "@/components/kit/tech-scene";
import { blogPhotoKey } from "@/lib/photos";
import { ServiceCta } from "@/components/site/service-cta";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    return (await getPosts()).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: { absolute: "Post not found | Zoqonyx" }, robots: { index: false } };
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
      images: [p.coverImage || `https://zoqonyx.com/photos/${blogPhotoKey(p.slug, p.category)}.jpg`],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts, services] = await Promise.all([getPost(slug), getPosts(), getServices()]);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  // One post from the same category, then the posts that follow this one, so every post gets links.
  const others = posts.filter((p) => p.slug !== post.slug);
  const at = posts.findIndex((p) => p.slug === post.slug);
  const following = posts.slice(at + 1).concat(posts.slice(0, Math.max(at, 0)));
  const sameCategory = others.find((p) => p.category === post.category);
  const related = [sameCategory, ...following]
    .filter((p, i, all): p is (typeof posts)[number] => Boolean(p) && all.findIndex((x) => x?.slug === p!.slug) === i)
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
        logo: { "@type": "ImageObject", url: "https://zoqonyx.com/logo/zoqonyx-logo-v2.png" },
      },
      image: post.coverImage || `https://zoqonyx.com/photos/${blogPhotoKey(post.slug, post.category)}.jpg`,
      articleSection: post.category,
      inLanguage: "en",
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".zq-lead-answer"] },
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
          <nav aria-label="Breadcrumb" className="text-sm text-[#5E5B55]">
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
              <li aria-current="page" className="max-w-[14rem] truncate font-semibold text-[#161513] sm:max-w-md">
                {post.title}
              </li>
            </ol>
          </nav>
          <p className="mt-6 inline-flex rounded-md bg-[#161513] px-3 py-1 text-sm font-semibold text-white">{post.category}</p>
          <h1 className="zq-in-solid zq-display mt-4 text-4xl sm:text-5xl font-semibold leading-[1.06] text-[#161513]">{post.title}</h1>
          <p className="zq-in zq-lead-answer mx-auto mt-4 max-w-2xl text-[18px] leading-relaxed text-[#5E5B55]">{post.excerpt}</p>
          <p className="mt-5 text-sm text-[#5E5B55]">
            By {post.authorName} · {fmt(post.publishedAt)} · {readingMinutes(post.content)} min read
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,46rem)_1fr]">
        <article className="-mt-2">
          <BlogCover seed={post.slug} category={post.category} className="h-56 w-full rounded-xl shadow-[0_24px_60px_-34px_rgba(22,21,19,.55)] sm:h-80" />
          <div className="zq-prose mt-8 text-[17px] leading-[1.75]">{renderMarkdown(post.content)}</div>
          {!post.content.includes("(/services/") && (
            <div className="mt-10">
              <ServiceCta topic={`${post.category} ${post.slug}`} />
            </div>
          )}
          <p className="mt-10 border-t border-[#E5E2DC] pt-5 text-sm text-[#5E5B55]">
            Written by {post.authorName}. Last updated {fmt(post.updatedAt)}.
          </p>
        </article>

        <aside className="hidden lg:block pt-2">
          <div className="sticky top-24 space-y-5">
            {headings.length >= 3 && (
              <nav aria-label="On this page" className="zq-card p-5 text-[15px]">
                <p className="mb-2 font-semibold">On this page</p>
                <ul className="space-y-1.5 border-l-2 border-[#E5E2DC]">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="block pl-3 text-[#5E5B55] hover:text-[#B02E0E] hover:underline underline-offset-4">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="rounded-xl bg-[#161513] p-5 text-white">
              <p className="zq-display text-lg font-semibold leading-snug">Need help with this?</p>
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
                    <BlogCover seed={r.slug} category={r.category} className="h-40 w-full" />
                    <span className="p-5">
                      <span className="block text-[17px] font-semibold leading-snug group-hover:text-[#B02E0E]">{r.title}</span>
                      <span className="mt-1.5 block text-sm text-[#5E5B55] line-clamp-2">{r.excerpt}</span>
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
