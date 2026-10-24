import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test("Submitting contact message succeeds", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toContainText("Contact");

    await page.locator('input[placeholder*="Alex Miller"]').fill("Jane Doe");
    await page.locator('input[type="email"]').fill("janedoe@example.com");
    await page.locator("textarea").fill("Hello, please add an SVG optimizer tool! Love Zoqonyx.");

    await page.locator('button:has-text("Send Message")').click();

    await expect(page.locator("text=Message Dispatched!")).toBeVisible();
  });
});
