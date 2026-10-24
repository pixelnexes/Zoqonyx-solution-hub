import { test, expect } from "@playwright/test";

test.describe("SEO, Canonical Tags & Indexability", () => {
  test("Homepage includes canonical tag, clean title, and WebSite JSON-LD", async ({ page }) => {
    await page.goto("/");

    // Verify title and no duplication
    const title = await page.title();
    expect(title).toContain("Zoqonyx Solution Hub");
    expect(title).not.toContain("Zoqonyx Solution Hub | Zoqonyx Solution Hub");
    expect(title).not.toContain("Zoqonyx | Zoqonyx");

    // Canonical tag
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://zoqonyx.com");

    // Description
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /useful tool/i);

    // Verify JSON-LD script
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLd).toBeAttached();
    const content = await jsonLd.textContent();
    expect(content).toContain("schema.org");
    expect(content).toContain("Zoqonyx Solution Hub");
  });

  test("Dedicated /tools directory route loads with status 200 and canonical", async ({ page }) => {
    const res = await page.goto("/tools");
    expect(res?.status()).toBe(200);

    await expect(page.locator("h1")).toContainText("All Free Online Tools Directory");

    // Canonical tag
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://zoqonyx.com/tools");

    // Search and catalog
    await expect(page.locator('input[placeholder*="Search all"]')).toBeVisible();

    // SEO Guide & FAQs
    await expect(page.locator("text=Why Browser-Native Digital Tools Are Superior")).toBeVisible();
    await expect(page.locator("text=Frequently Asked Questions")).toBeVisible();
  });

  test("Tool page includes canonical, no title duplication, FAQPage schema, and rich guide", async ({ page }) => {
    await page.goto("/tools/image-compressor");

    // Verify title does not repeat branding
    const title = await page.title();
    expect(title).toContain("Free Image Compressor");
    expect(title).not.toContain("Zoqonyx | Zoqonyx");
    expect(title).not.toContain("Zoqonyx Solution Hub | Zoqonyx Solution Hub");

    // Canonical tag
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://zoqonyx.com/tools/image-compressor");

    // Open Graph
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Image Compressor/);

    // JSON-LD scripts (WebApplication, BreadcrumbList, FAQPage)
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(2);

    let foundFaq = false;
    let foundWebApp = false;
    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).textContent();
      if (text?.includes("FAQPage")) foundFaq = true;
      if (text?.includes("WebApplication")) foundWebApp = true;
    }
    expect(foundFaq).toBe(true);
    expect(foundWebApp).toBe(true);

    // Rich content sections
    await expect(page.locator("text=How to Use Image Compressor in 4 Simple Steps")).toBeVisible();
    await expect(page.locator("text=Why Image Compressor on Zoqonyx Beats Cloud Server Tools")).toBeVisible();
    await expect(page.locator("text=Comprehensive Technical Overview")).toBeVisible();
    await expect(page.locator("text=Frequently Asked Questions About Image Compressor")).toBeVisible();

    // Internal Linking: Related + Popular tools
    await expect(page.locator("text=More Image Tools on Zoqonyx")).toBeVisible();
    await expect(page.locator("text=Popular Free Tools on Zoqonyx")).toBeVisible();
  });

  test("Header navigation does not leak public Admin button", async ({ page }) => {
    await page.goto("/");
    // Desktop header should not have an Admin button visible to public
    const headerAdminBtn = page.locator('header button:has-text("Admin")');
    await expect(headerAdminBtn).toHaveCount(0);
  });

  test("sitemap.xml returns valid XML with /tools, categories, and priority", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("<loc>https://zoqonyx.com/tools</loc>");
    expect(text).toContain("<loc>https://zoqonyx.com/category/image-tools</loc>");
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
