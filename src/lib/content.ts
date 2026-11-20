import { prisma } from "@/lib/prisma";
import { ensureContentTables } from "@/lib/content-db";
import { BLOG_SEEDS } from "@/lib/blog-seed";
import { SERVICE_SEEDS, SERVICE_GROUP_ORDER } from "@/lib/services-data";
import type { ServiceSeed, ServiceFaq } from "@/lib/services-types";

// Public content = built-in defaults (in code) + rows from the database.
// A database row with the same slug replaces the built-in one. If the
// database can't be reached, the built-in content is still served.

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  authorName: string;
  metaTitle: string | null;
  metaDesc: string | null;
  publishedAt: Date;
  updatedAt: Date;
}

export interface Service {
  slug: string;
  name: string;
  group: string;
  isHub: boolean;
  shortDesc: string;
  content: string; // Markdown
  faqs: ServiceFaq[];
  metaTitle: string | null;
  metaDesc: string | null;
  related: string[];
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  serviceSlug: string;
}

const BUILT_IN_DATE = new Date("2026-11-18T00:00:00Z");

// ---------- Blog ----------

function seedToPost(s: (typeof BLOG_SEEDS)[number]): Post {
  return {
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt,
    content: s.content,
    category: s.category,
    tags: s.tags,
    coverImage: null,
    authorName: "Zoqonyx Team",
    metaTitle: s.metaTitle,
    metaDesc: s.metaDesc,
    publishedAt: new Date(s.publishedAt + "T00:00:00Z"),
    updatedAt: new Date(s.publishedAt + "T00:00:00Z"),
  };
}

export async function getPosts(): Promise<Post[]> {
  const map = new Map<string, Post>(BLOG_SEEDS.map((s) => [s.slug, seedToPost(s)]));
  try {
    await ensureContentTables();
    const rows = await prisma.blogPost.findMany({ where: { status: "published" } });
    for (const r of rows) {
      map.set(r.slug, {
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        category: r.category,
        tags: r.tags ? r.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        coverImage: r.coverImage,
        authorName: r.authorName,
        metaTitle: r.metaTitle,
        metaDesc: r.metaDesc,
        publishedAt: r.publishedAt ?? r.createdAt,
        updatedAt: r.updatedAt,
      });
    }
  } catch {
    // Database unavailable: built-in posts only.
  }
  // Scheduled posts stay hidden until their publish date; links to hidden posts become plain text.
  const now = Date.now();
  const live = Array.from(map.values()).filter((p) => p.publishedAt.getTime() <= now);
  const slugs = new Set(live.map((p) => p.slug));
  for (const p of live) {
    p.content = p.content.replace(/\[([^\]]+)\]\(\/blog\/([a-z0-9-]+)\)/g, (m, text, slug) => (slugs.has(slug) ? m : text));
  }
  return live.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

// ---------- Services ----------

function bullets(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

export function seedToMarkdown(s: ServiceSeed): string {
  const parts: string[] = [];
  parts.push(s.intro.join("\n\n"));
  parts.push(`## What we deliver\n\n${bullets(s.includes)}`);
  parts.push(`## Technologies we use\n\n${bullets(s.tech)}`);
  parts.push(
    `## How we work\n\n${s.process.map((p, i) => `${i + 1}. **${p.title}.** ${p.text}`).join("\n")}`
  );
  return parts.join("\n\n");
}

function seedToService(s: ServiceSeed, order: number): Service {
  return {
    slug: s.slug,
    name: s.name,
    group: s.group,
    isHub: Boolean(s.isHub),
    shortDesc: s.shortDesc,
    content: seedToMarkdown(s),
    faqs: s.faqs,
    metaTitle: s.metaTitle,
    metaDesc: s.metaDesc,
    related: s.related ?? [],
    order,
  };
}

function parseFaqs(raw: string): ServiceFaq[] {
  if (!raw.trim()) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v)
      ? v.filter((f) => f && typeof f.question === "string" && typeof f.answer === "string")
      : [];
  } catch {
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  const map = new Map<string, Service>(SERVICE_SEEDS.map((s, i) => [s.slug, seedToService(s, i)]));
  try {
    await ensureContentTables();
    const rows = await prisma.service.findMany();
    for (const r of rows) {
      const base = map.get(r.slug);
      if (!r.isActive) {
        map.delete(r.slug);
        continue;
      }
      map.set(r.slug, {
        slug: r.slug,
        name: r.name,
        group: r.groupName || base?.group || "",
        isHub: base?.isHub ?? false,
        shortDesc: r.shortDesc,
        content: r.content,
        faqs: parseFaqs(r.faqs).length ? parseFaqs(r.faqs) : base?.faqs ?? [],
        metaTitle: r.metaTitle,
        metaDesc: r.metaDesc,
        related: base?.related ?? [],
        order: base ? base.order : 1000 + r.order,
      });
    }
  } catch {
    // Database unavailable: built-in services only.
  }
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

export async function getService(slug: string): Promise<Service | null> {
  return (await getServices()).find((s) => s.slug === slug) ?? null;
}

/** Groups services for the Services page: each hub with its child services. */
export function groupServices(all: Service[]) {
  const hubs = SERVICE_GROUP_ORDER.map((slug) => all.find((s) => s.slug === slug)).filter(Boolean) as Service[];
  return hubs.map((hub) => ({
    hub,
    children: all.filter((s) => s.group === hub.group && s.slug !== hub.slug),
  }));
}

// ---------- Testimonials ----------

export async function getTestimonials(serviceSlug?: string): Promise<TestimonialItem[]> {
  try {
    await ensureContentTables();
    const rows = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      company: r.company,
      quote: r.quote,
      rating: r.rating,
      serviceSlug: r.serviceSlug,
    }));
    if (!serviceSlug) return items;
    const matching = items.filter((t) => t.serviceSlug === serviceSlug);
    return matching.length ? matching : items;
  } catch {
    return [];
  }
}

export { BUILT_IN_DATE };
