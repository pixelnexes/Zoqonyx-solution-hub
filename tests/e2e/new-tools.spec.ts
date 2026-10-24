import { test, expect } from "@playwright/test";

test.describe("Newly Added AI and SEO Tools", () => {
  test("Open Graph & Social Preview Generator loads with simulator tabs and code exporter", async ({ page }) => {
    await page.goto("/tools/open-graph-generator");

    // Check title and hero
    await expect(page.locator("h1")).toContainText(/Open Graph/i);

    // Verify platform tabs
    await expect(page.locator('button:has-text("Twitter / X")')).toBeVisible();
    await expect(page.locator('button:has-text("Facebook")')).toBeVisible();
    await expect(page.locator('button:has-text("LinkedIn")')).toBeVisible();
    await expect(page.locator('button:has-text("Google SERP")')).toBeVisible();
    await expect(page.locator('button:has-text("WhatsApp")')).toBeVisible();
    await expect(page.locator('button:has-text("Discord")')).toBeVisible();

    // Verify code exporter tabs
    await expect(page.locator('button:has-text("HTML Meta Tags")')).toBeVisible();
    await expect(page.locator('button:has-text("Next.js Metadata")')).toBeVisible();
    await expect(page.locator('button:has-text("JSON-LD Schema")')).toBeVisible();

    // Check reactive input updates preview
    const titleInput = page.locator('input[value*="Zoqonyx Solution Hub"]').first();
    await titleInput.fill("Testing Custom Title");
    await expect(page.locator("text=Testing Custom Title").first()).toBeVisible();
  });

  test("AI Watermark Remover loads with canvas brush and upload area", async ({ page }) => {
    await page.goto("/tools/ai-watermark-remover");

    await expect(page.locator("h1")).toContainText(/AI Watermark Remover/i);
    await expect(page.locator("text=Drop an image or click to upload")).toBeVisible();
    await expect(page.locator("text=Watermarks").first()).toBeVisible();
    await expect(page.locator("text=AI Generation Logos").first()).toBeVisible();
  });

  test("Photo Object Remover loads with magic eraser mode", async ({ page }) => {
    await page.goto("/tools/object-remover-photo");

    await expect(page.locator("h1")).toContainText(/Photo Object Remover/i);
    await expect(page.locator("text=Drop an image or click to upload")).toBeVisible();
    await expect(page.locator("text=Photobombers & Clutter").first()).toBeVisible();
  });

  test("Revamped Contact Page has 5 clean form fields with no static info cards", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.locator("h1")).toContainText(/Contact/i);

    // Verify 5 fields
    await expect(page.locator('input[placeholder*="John Doe"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="name@example.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="+1 (555)"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Tool Request"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Write your message here"]')).toBeVisible();

    // Verify submit button
    await expect(page.locator('button:has-text("Send Message")')).toBeVisible();

    // Verify static info cards are removed
    await expect(page.locator("text=Direct Inquiries")).not.toBeVisible();
    await expect(page.locator("text=General Support")).not.toBeVisible();
  });
});

