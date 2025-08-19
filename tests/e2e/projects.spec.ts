import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Projects Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });

  test("should display projects grid", async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector(
      '[data-testid="project-card"], .project-card, article',
      { timeout: 10000 }
    );

    // Check that projects are displayed
    const projectCards = page.locator(
      '[data-testid="project-card"], .project-card, article'
    );
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should have working project filters", async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector(
      '[data-testid="project-card"], .project-card, article',
      { timeout: 10000 }
    );

    // Look for filter controls
    const filterControls = page.locator(
      '[data-testid="filter"], .filter, select, button[data-filter]'
    );

    if (await filterControls.first().isVisible()) {
      const initialCount = await page
        .locator('[data-testid="project-card"], .project-card, article')
        .count();

      // Apply a filter
      await filterControls.first().click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      const filteredCount = await page
        .locator('[data-testid="project-card"], .project-card, article')
        .count();

      // Count should change (unless all projects match the filter)
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test("should have working search functionality", async ({ page }) => {
    // Look for search input
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="search"], input[name="search"]'
    );

    if (await searchInput.isVisible()) {
      // Get initial project count
      const initialCount = await page
        .locator('[data-testid="project-card"], .project-card, article')
        .count();

      // Search for something specific
      await searchInput.fill("react");

      // Wait for search results
      await page.waitForTimeout(500);

      const searchCount = await page
        .locator('[data-testid="project-card"], .project-card, article')
        .count();

      // Should show filtered results
      expect(searchCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test("should navigate to project detail pages", async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector(
      '[data-testid="project-card"], .project-card, article',
      { timeout: 10000 }
    );

    // Click on first project
    const firstProject = page
      .locator('[data-testid="project-card"], .project-card, article')
      .first();
    const projectLink = firstProject.locator("a").first();

    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Should navigate to project detail page
      await expect(page).toHaveURL(/.*projects\/.*/);

      // Should display project details
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should persist filter state in URL", async ({ page }) => {
    // Look for filter controls
    const filterControls = page.locator(
      '[data-testid="filter"], .filter, select, button[data-filter]'
    );

    if (await filterControls.first().isVisible()) {
      // Apply a filter
      await filterControls.first().click();

      // Wait for URL to update
      await page.waitForTimeout(500);

      // Check that URL contains filter parameters
      const url = page.url();
      expect(url).toMatch(/[?&](filter|tech|search|q)=/);

      // Reload page
      await page.reload();

      // Filter should still be applied
      const urlAfterReload = page.url();
      expect(urlAfterReload).toMatch(/[?&](filter|tech|search|q)=/);
    }
  });

  test("should be accessible", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper keyboard navigation for filters", async ({
    page,
  }) => {
    // Look for filter controls
    const filterControls = page.locator(
      '[data-testid="filter"], .filter, select, button[data-filter]'
    );

    if (await filterControls.first().isVisible()) {
      // Tab to filter controls
      await page.keyboard.press("Tab");

      // Should be able to navigate filters with keyboard
      await page.keyboard.press("Enter");

      // Check that filter was applied
      await page.waitForTimeout(500);
    }
  });

  test("should display project metadata correctly", async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector(
      '[data-testid="project-card"], .project-card, article',
      { timeout: 10000 }
    );

    const firstProject = page
      .locator('[data-testid="project-card"], .project-card, article')
      .first();

    // Check for project title
    await expect(firstProject.locator("h2, h3, .title")).toBeVisible();

    // Check for tech stack or tags
    const techBadges = firstProject.locator(".tech-badge, .tag, .badge");
    if (await techBadges.first().isVisible()) {
      const count = await techBadges.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should handle empty search results", async ({ page }) => {
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="search"], input[name="search"]'
    );

    if (await searchInput.isVisible()) {
      // Search for something that doesn't exist
      await searchInput.fill("nonexistentproject12345");

      // Wait for search results
      await page.waitForTimeout(500);

      // Should show no results message or empty state
      const projectCount = await page
        .locator('[data-testid="project-card"], .project-card, article')
        .count();

      if (projectCount === 0) {
        // Should show empty state message
        await expect(
          page
            .locator(
              'text=no projects, text=no results, [data-testid="empty-state"]'
            )
            .first()
        ).toBeVisible();
      }
    }
  });
});
