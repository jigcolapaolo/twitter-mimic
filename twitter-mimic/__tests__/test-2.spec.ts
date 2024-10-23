import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const page15Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Login with GitHub' }).click();
  const page15 = await page15Promise;
  await page.goto('http://localhost:3000/home');
});