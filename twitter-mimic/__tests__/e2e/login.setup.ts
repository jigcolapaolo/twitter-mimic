/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from "@playwright/test";
import { existsSync } from "fs";

const authFile = "playwright/.auth/loginState.json";
const authFileExists = existsSync(authFile);

if (authFileExists) test.use({ storageState: authFile });

test.describe("Login flow", () => {
  test("Login page should show login buttons", async ({ page }) => {
    await test.step("Navigate to the login page", async () => {
      await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    });

    await test.step("Check login buttons visibility", async () => {
      const githubLogin = await page.locator("text=Login with GitHub");
      const googleLogin = await page.locator("text=Login with Google");
      await expect(githubLogin).toBeVisible();
      await expect(googleLogin).toBeVisible();
    });
  });

  test("Login should let users log in and see the home page", async ({
    page,
  }) => {

  
    await page.goto("http://localhost:3000/");
    await page.click('button:has-text("Login with GitHub")');

    if (!authFileExists) {
      const popup = await page.waitForEvent("popup");
      await popup.waitForLoadState("networkidle");

      await popup
        .getByRole("textbox", { name: /Username or email address/i })
        .fill("");

      await popup.getByRole("textbox", { name: /password/i }).fill("");

      await popup.getByRole("button", { name: "Sign in", exact: true }).click();

      await page.context().storageState({ path: authFile });
    }

    await page.waitForURL("http://localhost:3000/home");
    await expect(page.locator("#sign-out-icon")).toBeVisible();
  });

  // test("Login with Google", async ({ page }) => {}
});
