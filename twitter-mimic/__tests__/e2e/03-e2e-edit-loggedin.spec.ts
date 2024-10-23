/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";

const authFile = "playwright/.auth/loginState.json";
test.use({ storageState: authFile });

test.describe("Edit Page", () => {
  test("should run multiple assertions and be able to work the edit page flow correctly", async ({
    page,
  }) => {
    // Inicia sesión una vez
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.click('button:has-text("Login with GitHub")');
    await page.waitForURL("http://localhost:3000/home", {
      waitUntil: "networkidle",
    });
    // Navegar a edit

    const newTweet = page.locator("article:has(p:has-text('Hola mundo'))");

    const tweetMenuButton = await newTweet.locator(
      'div[aria-label="tweetMenuDiv"] button[aria-label="tweetMenuIcon"]'
    );
    await expect(tweetMenuButton).toBeVisible();

    const tweetMenu = await newTweet.locator('div[aria-label="tweetMenu"]');
    await expect(tweetMenu).toHaveClass("home_opacityClosed__QR7Je");

    await tweetMenuButton.click();

    await expect(tweetMenu).toHaveClass("home_opacityOpen__vb5eG");

    const editTweetButton = await tweetMenu.locator(
      'button[aria-label="tweetEdit"]'
    );
    const deleteTweetButton = await tweetMenu.locator(
      'button[aria-label="tweetDelete"]'
    );

    await expect(editTweetButton).toBeVisible();
    await expect(deleteTweetButton).toBeVisible();

    await editTweetButton.click();

    await expect(page).toHaveURL(/http:\/\/localhost:3000\/status\/edit\/.*/);

    await test.step("Verify page elements are visible", async () => {

      const returnButton = await page.locator(
        'header button[aria-label="return-button"]'
      );
      const avatar = await page.locator("figure");
      const tweetContent = page.getByText("Hola mundo");
      const tweetLength = page.getByText("10/280");
      const imgButton = await page.getByRole("button").nth(1);
      const saveButton = await page
        .locator("div button")
        .filter({ hasText: /^Guardar$/ });

      await expect(returnButton).toBeVisible();
      await expect(avatar).toBeVisible();
      await expect(tweetContent).toBeVisible();
      await expect(tweetContent).toHaveText("Hola mundo");
      await expect(tweetLength).toBeVisible();
      await expect(imgButton).toBeVisible();
      await expect(saveButton).toBeVisible();
    });

    await test.step("Verify save button is working correctly", async () => {
        const tweetContent = page.locator('textarea');
        const tweetLength = page.getByText("/280");
        const saveButton = page
        .locator("div button")
        .filter({ hasText: /^Guardar$/ });

        await tweetContent.fill("Hello world");
        await expect(tweetContent).toHaveValue("Hello world");
        await expect(tweetLength).toHaveText("11/280");

        await expect(saveButton).toBeEnabled();

        await saveButton.click();

        await page.waitForURL("http://localhost:3000/home", { waitUntil: "load" });

        await expect(page.getByText("Tweet actualizado exitosamente")).toBeVisible()
    })

    await test.step("Verify tweet was edited correctly", async () => {
        const newTweet = page.locator("article:has(p:has-text('Hello world'))");
        await expect(newTweet).toBeVisible();
    })
  });
});
