import { test, expect } from "@playwright/test";

test.describe("SEO & Indexability", () => {
  test("Homepage includes meta tags and WebSite JSON-LD", async ({ page }) => {
    await page.goto("/");

    // Verify title and description
    await expect(page).toHaveTitle(/Zoqonyx Solution Hub/);
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /Empowering creators/);

    // Verify JSON-LD script
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLd).toBeAttached();
    const content = await jsonLd.textContent();
    expect(content).toContain("schema.org");
    expect(content).toContain("Zoqonyx Solution Hub");
  });

  test("Tool page includes WebApplication JSON-LD and Open Graph tags", async ({ page }) => {
    await page.goto("/tools/image-compressor");

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Image Compressor/);

    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toContain("WebApplication");
    expect(content).toContain("image-compressor");
  });

  test("sitemap.xml returns valid XML with tools", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("tools/image-compressor");
  });

  test("robots.txt returns valid directives", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text.toLowerCase()).toContain("user-agent: *");
    expect(text).toContain("Disallow: /admin/");
    expect(text).toContain("sitemap.xml");
  });
});
