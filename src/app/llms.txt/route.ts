import { getPosts, getServices } from "@/lib/content";

// llms.txt: a plain-text map of the site for AI assistants and answer engines.
export const revalidate = 3600;

export async function GET() {
  const base = "https://zoqonyx.com";
  let services: { name: string; slug: string; shortDesc: string; isHub: boolean }[] = [];
  let posts: { title: string; slug: string; excerpt: string }[] = [];
  try {
    services = await getServices();
    posts = await getPosts();
  } catch {
    // The static part below is still useful without the database.
  }

  const lines: string[] = [
    "# Zoqonyx",
    "",
    "> Zoqonyx is a software studio that builds mobile apps, websites, games and custom software, offers digital marketing, AI and NLP, NFT, staff augmentation and ERP/CRM services, and runs 140+ free online tools for PDFs, images, code, text, CSS and calculators. Most tools run in the browser, so files stay on the user's device. Contact: hello@zoqonyx.com",
    "",
    "## Services",
    ...services.filter((s) => s.isHub).map((s) => `- [${s.name}](${base}/services/${s.slug}): ${s.shortDesc}`),
    "",
    "## Individual service pages",
    ...services.filter((s) => !s.isHub).map((s) => `- [${s.name}](${base}/services/${s.slug}): ${s.shortDesc}`),
    "",
    "## Free tools",
    `- [All tools](${base}/tools): Directory of every free tool, by category.`,
    `- [Images](${base}/category/image-tools), [PDF](${base}/category/pdf-documents), [Developer and SEO](${base}/category/developer-seo), [Text and code](${base}/category/text-code), [CSS and design](${base}/category/css-design), [Calculators](${base}/category/calculators)`,
    "",
    "## Guides",
    ...posts.map((p) => `- [${p.title}](${base}/blog/${p.slug}): ${p.excerpt}`),
    "",
    "## Company",
    `- [About](${base}/about)`,
    `- [Contact](${base}/contact)`,
    `- [Privacy policy](${base}/privacy-policy)`,
    `- [Terms](${base}/terms)`,
    "",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
