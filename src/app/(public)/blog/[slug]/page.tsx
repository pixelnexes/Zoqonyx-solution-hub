import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, getServices } from "@/lib/content";
import { extractHeadings, readingMinutes, renderMarkdown } from "@/lib/markdown";
import { ContactSection } from "@/components/site/sections";

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
    <div className="bg-[#F3F5F8] text-[#14213D]">
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-16">
        <nav aria-label="Breadcrumb" className="text-sm text-[#4A5568]">
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
            <li aria-current="page" className="font-medium text-[#14213D] truncate max-w-[16rem] sm:max-w-none">
              {post.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,46rem)_1fr] gap-12 -mt-8">
          <article>
            <header>
              <p className="text-sm text-[#4A5568]">
                {post.category} · {fmt(post.publishedAt)} · {readingMinutes(post.content)} min read
              </p>
              <h1 className="mt-2 text-[2rem] sm:text-[2.5rem] leading-[1.1] font-bold tracking-[-0.02em]">{post.title}</h1>
              <p className="mt-4 text-[18px] leading-relaxed text-[#4A5568]">{post.excerpt}</p>
            </header>
            <div className="mt-8 text-[17px] leading-[1.75] text-[#2D3748]">{renderMarkdown(post.content)}</div>
            <p className="mt-10 pt-5 border-t border-[#D5DCE4] text-sm text-[#4A5568]">
              Written by {post.authorName}. Last updated {fmt(post.updatedAt)}.
            </p>
          </article>

          {headings.length >= 3 && (
            <aside className="hidden lg:block">
              <nav aria-label="On this page" className="sticky top-24 text-[15px]">
                <p className="font-semibold mb-2">On this page</p>
                <ul className="space-y-1.5 border-l border-[#D5DCE4]">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="block pl-3 text-[#4A5568] hover:text-[#14213D] hover:underline underline-offset-4">
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
          <section aria-labelledby="more-heading">
            <h2 id="more-heading" className="pb-2 border-b-2 border-[#14213D] text-2xl font-bold tracking-[-0.015em]">
              More from the blog
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
              {related.map((r) => (
                <li key={r.slug} className="border-b border-[#D5DCE4]">
                  <Link href={`/blog/${r.slug}`} className="block py-3.5 hover:bg-white">
                    <span className="block text-[16px] font-semibold leading-snug">{r.title}</span>
                    <span className="block mt-1 text-sm text-[#4A5568] line-clamp-2">{r.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ContactSection services={options} heading="Need help with this?" intro="Tell us what you are working on and we will reply with suggestions and next steps." />
      </div>
    </div>
  );
}
