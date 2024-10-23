import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('div').filter({ hasText: 'Twitter MimicConéctate y' }).click({
    button: 'right'
  });
  await page.getByRole('heading', { name: 'Twitter Mimic' }).click();
  await page.locator('div').filter({ hasText: 'Twitter MimicConéctate y' }).click({
    button: 'right'
  });
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Login with GitHub' }).click();
  const page1 = await page1Promise;
  await page.goto('http://localhost:3000/home');
});