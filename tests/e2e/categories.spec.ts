import { test, expect } from "@playwright/test";

test.describe("Category SEO Hub Pages", () => {
  test("Image Tools Hub renders hero, tool cards, guide, and FAQs", async ({ page }) => {
    await page.goto("/category/image-tools");
    await expect(page.locator("h1")).toContainText("Image & Photo Tools");

    // Breadcrumbs
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toContainText("Image & Photo Tools");

    // Tools rendered
    await expect(page.locator("text=Image Compressor Pro")).toBeVisible();
    await expect(page.locator("text=Image Resizer Pro")).toBeVisible();
    await expect(page.locator("text=QR Code Generator Pro")).toBeVisible();

    // SEO content & FAQs
    await expect(page.locator("text=Key Advantages & Architectural Features")).toBeVisible();
    await expect(page.locator("text=Frequently Asked Questions")).toBeVisible();
  });

  test("CSS & Design Hub renders pro generators", async ({ page }) => {
    await page.goto("/category/css-design");
    await expect(page.locator("h1")).toContainText("CSS & Design Generators");
    await expect(page.locator("text=Box Shadow Generator Pro")).toBeVisible();
    await expect(page.locator("text=CSS Gradient Generator Pro")).toBeVisible();
  });

  test("Text & Code Hub renders diff checker and JSON formatter", async ({ page }) => {
    await page.goto("/category/text-code");
    await expect(page.locator("h1")).toContainText("Text & Code Utilities");
    await expect(page.locator("text=JSON Formatter & Validator Pro")).toBeVisible();
    await expect(page.locator("text=Diff Checker Pro")).toBeVisible();
  });

  test("Calculators Hub renders BMI and age calculators", async ({ page }) => {
    await page.goto("/category/calculators");
    await expect(page.locator("h1")).toContainText("Calculators & Math Tools");
    await expect(page.getByRole("link", { name: "Age Calculator", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "BMI Calculator", exact: true })).toBeVisible();
  });
});

test.describe("Upgraded Competitor-Grade Tools", () => {
  test("QR Code Generator Pro has logos, gradient styles, and type tabs", async ({ page }) => {
    await page.goto("/tools/qr-code-generator");
    await expect(page.locator("h1")).toContainText("QR Code Generator");

    // Check content types
    await expect(page.locator("button:has-text('Wi-Fi')").first()).toBeVisible();
    await expect(page.locator("button:has-text('WhatsApp')").first()).toBeVisible();
    await expect(page.locator("button:has-text('vCard')").first()).toBeVisible();

    // Check export resolution options
    await expect(page.locator("text=Print-Ready Resolution").first()).toBeVisible();
  });

  test("Image Resizer Pro displays interactive canvas and social presets", async ({ page }) => {
    await page.goto("/tools/image-resizer");
    await expect(page.locator("h1")).toContainText("Image Resizer");

    // Presets showcase text
    await expect(page.locator("text=Instagram Square").first()).toBeVisible();
    await expect(page.locator("text=YouTube Thumbnail").first()).toBeVisible();
    await expect(page.locator("text=Instagram Story / Reel").first()).toBeVisible();
  });

  test("CSS Gradient Generator Pro displays linear, radial, conic and presets", async ({ page }) => {
    await page.goto("/tools/css-gradient-generator");
    await expect(page.locator("h1")).toContainText("CSS Gradient Generator");

    await expect(page.getByRole("button", { name: "Linear", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Conic", exact: true })).toBeVisible();
    await expect(page.locator("text=Zoqonyx Electric")).toBeVisible();
  });

  test("Diff Checker Pro switches between Side-by-Side and Unified views", async ({ page }) => {
    await page.goto("/tools/diff-checker");
    await expect(page.locator("h1")).toContainText("Diff Checker");

    await expect(page.locator("button:has-text('Side-by-Side')")).toBeVisible();
    const unifiedBtn = page.locator("button:has-text('Unified View')");
    await expect(unifiedBtn).toBeVisible();
    await unifiedBtn.click();
    await expect(page.locator("text=Unified Difference View")).toBeVisible();
  });
});
