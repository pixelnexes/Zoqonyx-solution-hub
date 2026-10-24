import { test, expect } from "@playwright/test";

test.describe("Coming Soon Tools System", () => {
  test("Coming Soon page shows progress animation, notify form, and SEO content", async ({ page }) => {
    await page.goto("/tools/ai-background-remover-pro");
    await expect(page).toHaveTitle(/AI Background Remover Pro/);

    // Verify status indicator
    await expect(page.locator("text=Currently Under Active Development")).toBeVisible();
    await expect(page.locator("text=Development Progress")).toBeVisible();

    // Verify email subscription input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    await emailInput.fill("tester@zoqonyx.com");
    await page.locator('button:has-text("Notify Me")').click();

    // Verify success confirmation
    await expect(page.locator("text=You will be notified")).toBeVisible();

    // Verify SEO content blocks
    await expect(page.locator("h2:has-text('Professional AI Background Remover')")).toBeVisible();
  });
});
