import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  test("Admin login, dashboard navigation, and logout", async ({ page }) => {
    // 1. Visit admin login
    await page.goto("/admin/login");
    await expect(page.locator("h2")).toContainText("Sign In to Dashboard");

    // 2. Submit credentials
    await page.locator('input[placeholder*="admin"]').fill("admin");
    await page.locator('input[type="password"]').fill("AdminPassword2026!");
    await page.locator('button:has-text("Access Admin Panel")').click();

    // 3. Arrive at admin dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("h1")).toContainText("Platform Overview");
    await expect(page.locator("text=Total Catalog")).toBeVisible();

    // 4. Navigate to Tools Manager
    await page.goto("/admin/tools");
    await expect(page.locator("h1")).toContainText("Tools Manager");
    await expect(page.locator("text=Image Compressor")).toBeVisible();

    // 5. Navigate to Appearance
    await page.goto("/admin/appearance");
    await expect(page.locator("h1")).toContainText("Appearance & Brand Customizer");

    // 6. Sign out
    const signOutBtn = page.locator('button:has-text("Sign Out")');
    if (await signOutBtn.isVisible()) {
      await signOutBtn.click();
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });
});
