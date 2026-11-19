import { MetadataRoute } from "next";

// Search engines and AI answer engines are welcome on public pages; only admin and admin APIs are blocked.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoqonyx.com";
  const disallow = ["/admin/", "/api/admin/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
