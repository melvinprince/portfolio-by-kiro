import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load and display hero section", async ({ page }) => {
    // Check for hero section
    await expect(page.locator("h1")).toBeVisible();

    // Check for main navigation
    await expect(page.locator("nav")).toBeVisible();

    // Check for primary CTA button
    await expect(
      page.locator('a[href*="projects"], button').first()
    ).toBeVisible();
  });

  test("should have proper meta tags", async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Portfolio|Home/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute("content", /.+/);
  });

  test("should display featured projects", async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector(
      '[data-testid="project-card"], .project-card, article',
      { timeout: 10000 }
    );

    // Check that at least one project is displayed
    const projectCards = page.locator(
      '[data-testid="project-card"], .project-card, article'
    );
    await expect(projectCards.first()).toBeVisible();
  });

  test("should display tech stack preview", async ({ page }) => {
    // Look for tech badges or skills section
    const techSection = page
      .locator('[data-testid="tech-preview"], .tech-badge, .skill-badge')
      .first();
    await expect(techSection).toBeVisible({ timeout: 10000 });
  });

  test("should have working navigation", async ({ page }) => {
    // Test navigation to projects
    const projectsLink = page
      .locator('nav a[href*="projects"], a[href="/projects"]')
      .first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await expect(page).toHaveURL(/.*projects.*/);
      await page.goBack();
    }

    // Test navigation to tech stack
    const techLink = page
      .locator('nav a[href*="tech"], a[href="/tech"]')
      .first();
    if (await techLink.isVisible()) {
      await techLink.click();
      await expect(page).toHaveURL(/.*tech.*/);
      await page.goBack();
    }
  });

  test("should respect reduced motion preferences", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();

    // Check that animations are disabled or minimal
    // This is a basic check - in a real app you'd test specific animation properties
    const animatedElements = page.locator(
      '[style*="transform"], [style*="opacity"]'
    );
    const count = await animatedElements.count();

    // With reduced motion, there should be fewer animated elements
    expect(count).toBeLessThan(10); // Adjust based on your implementation
  });

  test("should be accessible", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper keyboard navigation", async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press("Tab");

    // Check that focus is visible
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const currentFocus = page.locator(":focus");
      if (await currentFocus.isVisible()) {
        // Ensure focused element has proper focus styling
        const focusOutline = await currentFocus.evaluate(
          (el) => window.getComputedStyle(el).outline
        );
        // Should have some form of focus indication
        expect(focusOutline).not.toBe("none");
      }
    }
  });

  test("should load within performance budget", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/", { waitUntil: "networkidle" });

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds on fast connection
    expect(loadTime).toBeLessThan(3000);
  });

  test("should handle theme switching", async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page
      .locator(
        '[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]'
      )
      .first();

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );

      // Toggle theme
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(100);

      // Check that theme changed
      const newTheme = await page.evaluate(() =>
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );

      expect(newTheme).not.toBe(initialTheme);
    }
  });
});
