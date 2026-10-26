import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/categories";
import { DEFAULT_TOOLS } from "@/lib/default-tools";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoqonyx.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Category SEO Hub routes
  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  try {
    let tools = await prisma.tool.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true, isComingSoon: true },
    });

    const dbSlugs = new Set(tools.map((t) => t.slug));
    const missing = DEFAULT_TOOLS.filter((t) => !dbSlugs.has(t.slug)).map((t) => ({
      slug: t.slug,
      updatedAt: new Date(),
      isComingSoon: t.isComingSoon,
    }));
    const allTools = [...tools, ...missing];

    const toolRoutes: MetadataRoute.Sitemap = allTools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: tool.updatedAt,
      changeFrequency: tool.isComingSoon ? "weekly" : "daily",
      priority: tool.isComingSoon ? 0.7 : 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
  } catch (e) {
    console.error("Error generating sitemap:", e);
    const fallbackToolRoutes: MetadataRoute.Sitemap = DEFAULT_TOOLS.map((t) => ({
      url: `${baseUrl}/tools/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: t.isComingSoon ? "weekly" : "daily",
      priority: t.isComingSoon ? 0.7 : 0.9,
    }));
    return [...staticRoutes, ...categoryRoutes, ...fallbackToolRoutes];
  }
}
