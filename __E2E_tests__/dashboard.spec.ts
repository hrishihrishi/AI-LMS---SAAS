import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage (already signed-in thanks to global setup)
    await page.goto('http://localhost:3000/companions', { waitUntil: 'networkidle' });
  });

  test('should display dashboard components and support search', async ({ page }) => {

    // await page.goto('http://localhost:3000/companions', { waitUntil: 'networkidle' });

    // 1. Verify page elements are loaded
    await expect(page.locator('input[id="search-companions"]')).toBeVisible();
    
    // 2. Test search functionality
    const searchInput = page.locator('input[id="search-companions"]');
    // await expect(searchInput).toBeVisible();
    await searchInput.fill('blah');
     
    // Check that search params are reflected in the URL
    await expect(page).toHaveURL(/.*topic=blah/);
  });

  // test('should gracefully handle empty or invalid search results (Error Handling)', async ({ page }) => {
  //   // Navigate directly to the companions page route
  //   await page.goto('http://localhost:3000/companions');

  //   const searchInput = page.locator('input[placeholder*="Search"]');
  //   await expect(searchInput).toBeVisible();

  //   // 1. Input a bizarre query that definitely won't exist in your database
  //   await searchInput.fill('XYZ_NonExistent_AI_Companion_12345');

  //   // 2. Error Handling UI Assertion:
  //   // Assert that your UI displays an empty state or fallback warning text
  //   // (Adjust the text selector below to match whatever UI element your app shows, e.g., "No companions found")
  //   const fallbackMessage = page.locator('text="No companions found"');
  //   await expect(fallbackMessage).toBeVisible();
  // });

  test('should toggle theme correctly', async ({ page }) => {
    const themeButton = page.locator('button[aria-label="Toggle Theme"]'); // Ensure your theme toggle has an ID
    await themeButton.click();
    
    // Verify dark mode class or attribute on HTML tag
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
  });
});
