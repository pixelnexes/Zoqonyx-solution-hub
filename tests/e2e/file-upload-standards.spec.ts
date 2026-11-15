import { test, expect } from "@playwright/test";

test.describe("Standardized File Upload Limits & Safety Suite (100 Files & 1 GB)", () => {
  test("Standard uploader accepts 1 file and displays capacity stats", async ({ page }) => {
    await page.goto("/tools/bulk-image-compressor");
    await expect(page.locator("h1").first()).toContainText("Bulk Image Compressor");

    // Check capacity indicator in upload dropzone
    await expect(page.getByText("Up to 100 images, 1 GB combined capacity", { exact: false })).toBeVisible();

    // Create 1 valid image buffer and upload
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: "sample-test-1.png",
      mimeType: "image/png",
      buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"),
    });

    // Verify 1 file added
    await expect(page.getByText("1 / 100 files", { exact: false })).toBeVisible();
    await expect(page.getByText("sample-test-1.png")).toBeVisible();
  });

  test("Standard uploader accepts up to 100 files and updates capacity bar", async ({ page }) => {
    await page.goto("/tools/bulk-image-compressor");

    const fileInput = page.locator('input[type="file"]').first();
    const mockFiles = Array.from({ length: 100 }, (_, i) => ({
      name: `bulk-image-${i + 1}.png`,
      mimeType: "image/png",
      buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"),
    }));

    await fileInput.setInputFiles(mockFiles);

    // Verify 100/100 files accepted
    await expect(page.getByText("100 / 100 files", { exact: false })).toBeVisible();
    await expect(page.getByText("bulk-image-100.png")).toBeVisible();
  });

  test("Standard uploader rejects 101 files exceeding limit", async ({ page }) => {
    await page.goto("/tools/bulk-image-compressor");

    const fileInput = page.locator('input[type="file"]').first();
    const mockFiles = Array.from({ length: 101 }, (_, i) => ({
      name: `overflow-image-${i + 1}.png`,
      mimeType: "image/png",
      buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"),
    }));

    await fileInput.setInputFiles(mockFiles);

    // Verify error notification
    await expect(page.getByText(/File limit exceeded: Maximum allowed is 100 files/i)).toBeVisible();
  });

  test("Standard uploader rejects files exceeding 1 GB limit", async ({ page }) => {
    await page.goto("/tools/bulk-image-compressor");

    // Simulate oversized file through input dispatch
    await page.evaluate(() => {
      const dropzone = document.querySelector('input[type="file"]');
      if (!dropzone) return;

      const fakeLargeFile = new File(["dummy content"], "giant-file.png", {
        type: "image/png",
      });
      Object.defineProperty(fakeLargeFile, "size", {
        value: 1024 * 1024 * 1025, // 1025 MB (> 1 GB)
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(fakeLargeFile);
      (dropzone as HTMLInputElement).files = dataTransfer.files;
      dropzone.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Verify size error message
    await expect(page.getByText(/exceeds maximum single file limit of 1 GB/i)).toBeVisible();
  });

  test("Standard uploader rejects unsupported file formats", async ({ page }) => {
    await page.goto("/tools/bulk-image-compressor");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: "malicious-script.exe",
      mimeType: "application/x-msdownload",
      buffer: Buffer.from("MZ dummy binary executable content"),
    });

    // Verify unsupported format error
    await expect(page.getByText(/Unsupported format/i)).toBeVisible();
  });

  test("Standard uploader supports individual item removal and Clear All", async ({ page }) => {
    await page.goto("/tools/bulk-image-compressor");

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles([
      {
        name: "file-alpha.png",
        mimeType: "image/png",
        buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"),
      },
      {
        name: "file-beta.png",
        mimeType: "image/png",
        buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"),
      },
    ]);

    await expect(page.getByText("2 / 100 files", { exact: false })).toBeVisible();

    // Remove single file
    const removeBtn = page.getByTitle(/Remove file-alpha\.png/i);
    await removeBtn.click();

    await expect(page.getByText("1 / 100 files", { exact: false })).toBeVisible();
    await expect(page.getByText("file-alpha.png")).not.toBeVisible();
    await expect(page.getByText("file-beta.png")).toBeVisible();

    // Click Clear All
    const clearAllBtn = page.getByRole("button", { name: /Clear All/i });
    await clearAllBtn.click();

    await expect(page.getByText("file-beta.png")).not.toBeVisible();
    await expect(page.getByText("Up to 100 images, 1 GB combined capacity", { exact: false })).toBeVisible();
  });
});
