import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/categories";
import { DEFAULT_TOOLS, TOOL_ALIASES } from "@/lib/default-tools";
import { getPosts, getServices } from "@/lib/content";

export const revalidate = 3600; // Cache and revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoqonyx.com";
  // Change this date when the content of the fixed pages and services really changes.
  const now = new Date("2026-11-27");

  // 1. Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/request-tool`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 2. Category SEO Hub routes
  // Skip categories with no live tools: their pages are noindex.
  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories()
    .filter((cat) =>
      DEFAULT_TOOLS.some((t) => t.isActive && !t.isComingSoon && cat.dbCategories.includes(t.category))
    )
    .map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. Tool routes - compiled safely with canonical resolution for active tools only
  const toolMap = new Map<string, { slug: string; updatedAt: Date }>();

  // Seed default catalog tools (active only)
  for (const t of DEFAULT_TOOLS) {
    if (t.isActive && !TOOL_ALIASES[t.slug]) {
      toolMap.set(t.slug, {
        slug: t.slug,
        updatedAt: now,
      });
    }
  }

  // Attempt to enrich with live DB timestamps if database is available
  try {
    const dbTools = await prisma.tool.findMany({
      where: { isActive: true, isComingSoon: false },
      select: { slug: true, updatedAt: true },
    });

    for (const t of dbTools) {
      const canonicalSlug = TOOL_ALIASES[t.slug] || t.slug;
      if (toolMap.has(canonicalSlug)) {
        toolMap.set(canonicalSlug, {
          slug: canonicalSlug,
          updatedAt: t.updatedAt || now,
        });
      }
    }
  } catch {
    // Database offline or during build - fallback catalog is already fully populated
  }

  const toolRoutes: MetadataRoute.Sitemap = Array.from(toolMap.values()).map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: tool.updatedAt,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // 4. Services and blog
  const [services, posts] = await Promise.all([getServices(), getPosts()]);
  const serviceRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: s.isHub ? 0.85 : 0.8,
    })),
  ];
  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/blog`, lastModified: posts[0]?.updatedAt ?? now, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...blogRoutes, ...toolRoutes];
}
