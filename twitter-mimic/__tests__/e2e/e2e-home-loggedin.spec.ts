import { test, expect } from "@playwright/test";

const authFile = "playwright/.auth/loginState.json";
test.use({ storageState: authFile });

test.describe("Home page", () => {

  test.beforeEach(async ({ page }) => {

    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.click('button:has-text("Login with GitHub")');

    await page.waitForURL("http://localhost:3000/home", { waitUntil: 'networkidle' });
  })

  test("shows logout button when logged in", async ({ page }) => {

    await expect(page.locator('#sign-out-icon')).toBeVisible();
  });
});