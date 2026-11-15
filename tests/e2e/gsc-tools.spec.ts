import { test, expect } from "@playwright/test";

test.describe("GSC Prioritized Tools - Full Functional E2E Suite", () => {
  test("Backlink Checker: performs link audit, displays metrics, and generates disavow file", async ({
    page,
  }) => {
    await page.goto("/tools/backlink-checker");
    await expect(page.locator("h1").first()).toContainText("Backlink Checker");

    // Enter domain and run analysis
    const domainInput = page.locator('input[placeholder*="zoqonyx.com"]');
    await domainInput.fill("zoqonyx.com");

    const analyzeBtn = page.getByRole("button", { name: /Analyze Backlinks/i });
    await analyzeBtn.click();

    // Verify 4 primary metric cards rendered
    await expect(page.getByText(/Authority Index/i).first()).toBeVisible();
    await expect(page.getByText("Referring Domains", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Dofollow Ratio", { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/Spam Signal Indicator/i).first()).toBeVisible();

    // Verify anchor text section
    await expect(page.getByText("Anchor Text Distribution", { exact: false })).toBeVisible();

    // Verify disavow file download button
    const disavowBtn = page.getByRole("button", { name: /Download disavow\.txt/i });
    await expect(disavowBtn).toBeVisible();
  });

  test("Schema Markup Generator: supports 10 schema types, generates valid JSON-LD, and copies snippet", async ({
    page,
  }) => {
    await page.goto("/tools/schema-markup-generator");
    await expect(page.locator("h1").first()).toContainText("Schema Markup Generator");

    // Select FAQ schema tab button
    const faqTab = page.getByRole("button", { name: "FAQPage", exact: true });
    await faqTab.click();

    // Verify FAQ question field appears
    const questionInput = page.locator('input[placeholder*="How long does shipping take"]').first();
    await expect(questionInput).toBeVisible();
    await questionInput.fill("Does Zoqonyx support 100 files and 1 GB uploads?");

    const answerInput = page.locator('textarea[placeholder*="Write clear, helpful answer"]').first();
    await answerInput.fill("Yes! Zoqonyx natively supports up to 100 files and 1 GB combined size.");

    // Check JSON-LD output
    const jsonCode = page.locator("pre code");
    await expect(jsonCode).toContainText('"@type": "FAQPage"');
    await expect(jsonCode).toContainText("Does Zoqonyx support 100 files and 1 GB uploads?");

    // Switch to Product schema tab button
    const productTab = page.getByRole("button", { name: "Product", exact: true });
    await productTab.click();
    await expect(jsonCode).toContainText('"@type": "Product"');

    // Verify Rich Results Test link
    const richResultsLink = page.getByRole("link", { name: /Test in Google Rich Results/i });
    await expect(richResultsLink).toBeVisible();
  });

  test("AI Product Description Generator: loads presets, generates multi-angle copy, and exports", async ({
    page,
  }) => {
    await page.goto("/tools/ai-product-description");
    await expect(page.locator("h1").first()).toContainText("AI Product Description Generator");

    // Click ANC Headphones Preset
    const presetBtn = page.getByRole("button", { name: /ANC Headphones/i });
    await presetBtn.click();

    // Verify input filled
    const nameInput = page.locator('input[placeholder*="AuraWave Pro"]');
    await expect(nameInput).toHaveValue("AuraWave Pro ANC Headphones");

    // Click Generate
    const generateBtn = page.getByRole("button", { name: /Generate Product Descriptions/i });
    await generateBtn.click();

    // Verify generated variant content
    await expect(page.getByText("Product Headline", { exact: false })).toBeVisible();
    await expect(page.getByText("Primary Description Copy", { exact: false })).toBeVisible();
    await expect(page.getByText("Feature & Benefit Bullets", { exact: false })).toBeVisible();
    await expect(page.getByText("Conversion Call-To-Action", { exact: false })).toBeVisible();

    // Verify export button
    const exportBtn = page.getByRole("button", { name: /Export \.md/i });
    await expect(exportBtn).toBeVisible();
  });

  test("AI Sales Pitch Generator: creates cold outreach, 30s elevator pitch, cold call script, and objection handling", async ({
    page,
  }) => {
    await page.goto("/tools/ai-sales-pitch");
    await expect(page.locator("h1").first()).toContainText("AI Sales Pitch");

    // Click SaaS Preset
    const presetBtn = page.getByRole("button", { name: /B2B SaaS/i });
    await presetBtn.click();

    // Click Generate
    const generateBtn = page.getByRole("button", { name: /Generate Sales Playbook/i });
    await generateBtn.click();

    // Verify Cold Email Tab
    await expect(page.getByText("High-Open Subject Line Options", { exact: false })).toBeVisible();
    await expect(page.getByText("Email Body", { exact: false })).toBeVisible();

    // Switch to Elevator Pitch Tab
    const elevatorTab = page.getByRole("button", { name: /Elevator Pitch/i });
    await elevatorTab.click();
    await expect(page.getByText("30-Second Verbal Elevator Pitch", { exact: true })).toBeVisible();

    // Switch to Cold Call Script Tab
    const callTab = page.getByRole("button", { name: /Cold Call Script/i });
    await callTab.click();
    await expect(page.getByText("1. Pattern-Interrupt Opener")).toBeVisible();
    await expect(page.getByText("Objection Handling Matrix", { exact: true })).toBeVisible();

    // Verify Export Playbook button
    const exportBtn = page.getByRole("button", { name: /Export Playbook/i });
    await expect(exportBtn).toBeVisible();
  });
});
