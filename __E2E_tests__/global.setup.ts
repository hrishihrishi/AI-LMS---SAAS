import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to Clerk sign-in page
  await page.goto('/sign-in');

  // Input credentials using robust user-facing locators
  await page.getByLabel('Email address or username').fill(process.env.E2E_TEST_EMAIL || 'test@gmail.com');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  
  await page.getByLabel('Password', { exact: true }).fill(process.env.E2E_TEST_PASSWORD || 'harekrishna');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  // Wait for redirect back to dashboard page
  await expect(page).toHaveURL(/\/sign-in\/factor-two|$/);
  
  // Waiting for the Clerk UserButton ensures the __session cookies are set
  await expect(page.locator('.cl-userButton-root')).toBeVisible();
  
  // Save credentials state to file
  await page.context().storageState({ path: authFile }); 
});
