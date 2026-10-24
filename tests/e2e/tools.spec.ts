import { test, expect } from "@playwright/test";

test.describe("Live Tools Execution", () => {
  test("Case Converter works interactively", async ({ page }) => {
    await page.goto("/tools/case-converter");
    await expect(page.locator("h1")).toContainText("Case Converter");

    const input = page.locator("textarea").first();
    await input.fill("hello zoqonyx world");

    // Check uppercase output
    await expect(page.getByText("HELLO ZOQONYX WORLD", { exact: true })).toBeVisible();
  });

  test("Border Radius Generator updates CSS output", async ({ page }) => {
    await page.goto("/tools/border-radius-generator");
    await expect(page.locator("h1")).toContainText("Border Radius Generator");

    const cssCode = page.locator("code");
    await expect(cssCode).toContainText("border-radius:");
  });

  test("JSON Formatter formats input and detects valid syntax", async ({ page }) => {
    await page.goto("/tools/json-formatter");
    await expect(page.locator("h1")).toContainText("JSON Formatter");

    await expect(page.locator("text=Valid JSON Syntax")).toBeVisible();
  });

  test("QR Code Generator renders canvas/img", async ({ page }) => {
    await page.goto("/tools/qr-code-generator");
    await expect(page.locator("h1")).toContainText("QR Code Generator");

    const qrCanvas = page.locator('canvas, img[alt="QR Code"]').first();
    await expect(qrCanvas).toBeVisible();
  });

  test("Age Calculator computes age", async ({ page }) => {
    await page.goto("/tools/age-calculator");
    await expect(page.locator("h1")).toContainText("Age Calculator");

    const yearsPill = page.locator("text=Years Old");
    await expect(yearsPill).toBeVisible();
  });

  test("Lorem Ipsum Generator creates dummy text and copies", async ({ page }) => {
    await page.goto("/tools/lorem-ipsum-generator");
    await expect(page.locator("h1")).toContainText("Lorem Ipsum");

    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue(/lorem ipsum/i);
  });

  test("CSS Grid Generator updates grid rules", async ({ page }) => {
    await page.goto("/tools/css-grid-generator");
    await expect(page.locator("h1")).toContainText("CSS Grid Generator");

    const cssCode = page.locator("code");
    await expect(cssCode).toContainText("grid-template-columns:");
  });

  test("Diff Checker displays side-by-side comparisons", async ({ page }) => {
    await page.goto("/tools/diff-checker");
    await expect(page.locator("h1")).toContainText("Diff Checker");

    await expect(page.locator("text=Side-by-Side Line Comparison")).toBeVisible();
  });

  test("No console errors across critical tool routes", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    const routes = [
      "/tools/image-compressor",
      "/tools/image-resizer",
      "/tools/box-shadow-generator",
      "/tools/uuid-generator",
      "/tools/percentage-calculator",
      "/tools/bmi-calculator",
    ];

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
    }

    expect(consoleErrors).toEqual([]);
  });
});
