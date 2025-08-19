import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("should display contact form", async ({ page }) => {
    // Check for form elements
    await expect(page.locator("form")).toBeVisible();
    await expect(
      page.locator('input[name="name"], input[id="name"]')
    ).toBeVisible();
    await expect(
      page.locator('input[name="email"], input[id="email"]')
    ).toBeVisible();
    await expect(
      page.locator('textarea[name="message"], textarea[id="message"]')
    ).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();

    // Check for validation messages
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const messageField = page.locator(
      'textarea[name="message"], textarea[id="message"]'
    );

    // Check HTML5 validation or custom validation messages
    await expect(nameField).toHaveAttribute("required");
    await expect(emailField).toHaveAttribute("required");
    await expect(messageField).toHaveAttribute("required");
  });

  test("should validate email format", async ({ page }) => {
    // Fill form with invalid email
    await page.locator('input[name="name"], input[id="name"]').fill("John Doe");
    await page
      .locator('input[name="email"], input[id="email"]')
      .fill("invalid-email");
    await page
      .locator('textarea[name="message"], textarea[id="message"]')
      .fill("Test message");

    await page.locator('button[type="submit"]').click();

    // Check for email validation
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const isInvalid = await emailField.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test("should submit form successfully with valid data", async ({ page }) => {
    // Mock the API response
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Message sent successfully",
        }),
      });
    });

    // Fill form with valid data
    await page.locator('input[name="name"], input[id="name"]').fill("John Doe");
    await page
      .locator('input[name="email"], input[id="email"]')
      .fill("john@example.com");
    await page
      .locator('textarea[name="message"], textarea[id="message"]')
      .fill("This is a test message");

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Check for success message
    await expect(
      page
        .locator('text=success, text=sent, [data-testid="success-message"]')
        .first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("should handle form submission errors", async ({ page }) => {
    // Mock API error response
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    // Fill and submit form
    await page.locator('input[name="name"], input[id="name"]').fill("John Doe");
    await page
      .locator('input[name="email"], input[id="email"]')
      .fill("john@example.com");
    await page
      .locator('textarea[name="message"], textarea[id="message"]')
      .fill("Test message");

    await page.locator('button[type="submit"]').click();

    // Check for error message
    await expect(
      page
        .locator('text=error, text=failed, [data-testid="error-message"]')
        .first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("should handle rate limiting", async ({ page }) => {
    // Mock rate limit response
    await page.route("/api/contact", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Rate limit exceeded. Please try again in 5 minutes.",
          code: "RATE_LIMIT_EXCEEDED",
        }),
      });
    });

    // Fill and submit form
    await page.locator('input[name="name"], input[id="name"]').fill("John Doe");
    await page
      .locator('input[name="email"], input[id="email"]')
      .fill("john@example.com");
    await page
      .locator('textarea[name="message"], textarea[id="message"]')
      .fill("Test message");

    await page.locator('button[type="submit"]').click();

    // Check for rate limit message
    await expect(
      page.locator("text=rate limit, text=try again").first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("should show loading state during submission", async ({ page }) => {
    // Mock slow API response
    await page.route("/api/contact", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Message sent successfully",
        }),
      });
    });

    // Fill form
    await page.locator('input[name="name"], input[id="name"]').fill("John Doe");
    await page
      .locator('input[name="email"], input[id="email"]')
      .fill("john@example.com");
    await page
      .locator('textarea[name="message"], textarea[id="message"]')
      .fill("Test message");

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Check for loading state
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();

    // Wait for completion
    await expect(page.locator("text=success, text=sent").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("should be accessible", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper form labels and ARIA attributes", async ({
    page,
  }) => {
    // Check that form fields have proper labels
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const messageField = page.locator(
      'textarea[name="message"], textarea[id="message"]'
    );

    // Check for labels or aria-label attributes
    await expect(nameField).toHaveAttribute("aria-label", /.+/);
    await expect(emailField).toHaveAttribute("aria-label", /.+/);
    await expect(messageField).toHaveAttribute("aria-label", /.+/);
  });

  test("should handle keyboard navigation", async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press("Tab");
    await expect(
      page.locator('input[name="name"], input[id="name"]')
    ).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(
      page.locator('input[name="email"], input[id="email"]')
    ).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(
      page.locator('textarea[name="message"], textarea[id="message"]')
    ).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });
});
