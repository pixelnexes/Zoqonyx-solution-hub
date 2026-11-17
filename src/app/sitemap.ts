import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/categories";
import { DEFAULT_TOOLS, TOOL_ALIASES } from "@/lib/default-tools";

export const revalidate = 3600; // Cache and revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoqonyx.com";
  const now = new Date();

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
  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
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

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
