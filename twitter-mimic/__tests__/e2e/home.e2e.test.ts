import { test, expect } from '@playwright/test';

test('Home page shows login buttons when not logged in', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const githubLogin = await page.locator('text=Login with GitHub');
  const googleLogin = await page.locator('text=Login with Google');
  await expect(githubLogin).toBeVisible();
  await expect(googleLogin).toBeVisible();
});
