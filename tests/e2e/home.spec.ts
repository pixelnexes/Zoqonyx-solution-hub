import { test, expect } from "@playwright/test";

test.describe("Homepage & Navigation", () => {
  test("Homepage loads with hero, title, and search", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Zoqonyx Solution Hub/);

    // Verify hero headline
    await expect(page.locator("h1")).toContainText(/Tools/i);

    // Verify brand logo
    const logo = page.locator('header a[aria-label="Zoqonyx Solution Hub Home"]');
    await expect(logo).toBeVisible();

    // Verify search input
    const searchInput = page.locator('input[placeholder*="Search all"]');
    await expect(searchInput).toBeVisible();

    // Test instant search filtering
    await searchInput.fill("Border Radius");
    const toolCard = page.locator("text=Border Radius Generator");
    await expect(toolCard).toBeVisible();

    // Test clear search
    const clearBtn = page.locator("text=Clear");
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }
  });

  test("Category filtering updates visible tools", async ({ page }) => {
    await page.goto("/");
    const imageBtn = page.locator('button:has-text("Image Tools")');
    if (await imageBtn.isVisible()) {
      await imageBtn.click();
      await expect(page.locator("text=Image Compressor")).toBeVisible();
    }
  });

  test("Dark and Light mode toggle works", async ({ page }) => {
    await page.goto("/");
    const toggleBtn = page.locator('button[aria-label="Toggle dark mode"]').first();
    await expect(toggleBtn).toBeVisible();

    const html = page.locator("html");
    const isDarkInitial = await html.evaluate((el) => el.classList.contains("dark"));

    await toggleBtn.click();
    const isDarkAfter = await html.evaluate((el) => el.classList.contains("dark"));
    expect(isDarkAfter).not.toEqual(isDarkInitial);
  });

  test("Footer contains Newix Tech Solutions attribution credit", async ({ page }) => {
    await page.goto("/");
    const footerLink = page.locator('footer a[href="https://newixtechsolutions.com/"]');
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toContainText("Newix Tech Solutions");
  });
});
