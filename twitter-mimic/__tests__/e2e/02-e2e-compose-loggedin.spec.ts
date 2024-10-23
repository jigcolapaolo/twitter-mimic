/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";

const authFile = "playwright/.auth/loginState.json";
test.use({ storageState: authFile });

test.describe("Compose Page", () => {
  test("should run multiple assertions and be able to work the home page flow correctly", async ({
    page,
  }) => {
    // Inicia sesión una vez
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.click('button:has-text("Login with GitHub")');
    await page.waitForURL("http://localhost:3000/home", {
      waitUntil: "networkidle",
    });
    // Navegar a compose
    const composeButton = await page
      .getByRole("link", { name: "ComposeLink" })
      .locator("svg");
    await composeButton.click();

    await page.waitForURL("http://localhost:3000/compose/tweet", {
      waitUntil: "networkidle",
    });

    await test.step("Verify page elements are visible", async () => {
      const returnButton = await page.locator(
        'header button[aria-label="return-button"]'
      );
      const avatar = await page.locator("figure");
      const tweetContent = page.getByPlaceholder("¿Qué esta pasando?");
      const tweetLength = page.getByText("0/280");
      const imgButton = await page.getByRole("button").nth(1);
      const tweetButton = await page
        .locator("div button")
        .filter({ hasText: /^Tweet$/ });

      await expect(returnButton).toBeVisible();
      await expect(avatar).toBeVisible();
      await expect(tweetContent).toBeVisible();
      await expect(tweetLength).toBeVisible();
      await expect(imgButton).toBeVisible();
      await expect(tweetButton).toBeVisible();
    });

    await test.step("Verify return button is working correctly", async () => {
      const returnButton = await page.locator(
        'header button[aria-label="return-button"]'
      );
      await expect(returnButton).toBeVisible();
      await returnButton.click();

      await page.waitForURL("http://localhost:3000/home", {
        waitUntil: "networkidle",
      });

      await page.goto("http://localhost:3000/compose/tweet");
    });

    await test.step("Verify tweet content is empty and tweet button is disabled", async () => {
      const tweetContent = page.getByPlaceholder("¿Qué esta pasando?");
      const tweetButton = await page
        .locator("div button")
        .filter({ hasText: /^Tweet$/ });

      await expect(tweetContent).toHaveValue("");
      await expect(tweetButton).toBeDisabled();
    });

    await test.step("Verify tweet button is enabled and tweet length is correct when tweet content is not empty", async () => {
      const tweetContent = page.getByPlaceholder("¿Qué esta pasando?");
      const tweetButton = await page
        .locator("div button")
        .filter({ hasText: /^Tweet$/ });
      const tweetLength = page.getByText("/280");

      await expect(tweetContent).toHaveValue("");
      await expect(tweetButton).toBeDisabled();
      await expect(tweetLength).toHaveText("0/280");

      await tweetContent.fill("Hola mundo");
      await expect(tweetContent).toHaveValue("Hola mundo");

      await expect(tweetLength).toHaveText("10/280");
      await expect(tweetButton).toBeEnabled();
    });

    await test.step("Verify image button is working correctly", async () => {
      const imgInput = await page.locator('input[type="file"]');
      await expect(imgInput).toBeHidden();

      const filePath = "public/Mountain_Bluebird.jpg";
      await imgInput.setInputFiles(filePath);

      const imgLoadedMsg = page.getByText("Imagen subida ✅");
      const uploadedImage = page.getByRole("img", { name: "Image to Upload" })
      const removeImgButton = page.getByRole("button", { name: "X" });
      await expect(imgLoadedMsg).toBeVisible();
      await expect(uploadedImage).toBeVisible();
      await expect(removeImgButton).toBeVisible();
    });

    await test.step("Verify tweet button is working correctly", async () => {
      const tweetButton = await page
        .locator("div button")
        .filter({ hasText: /^Tweet$/ });
      await expect(tweetButton).toBeEnabled();
      await tweetButton.click();

      await page.waitForURL("http://localhost:3000/home", { waitUntil: "load" });
    })

    // Home Page
    await test.step("Verify tweet was posted correctly", async () => {
        const newTweet = page.locator("article:has(p:has-text('Hola mundo'))");
        await expect(newTweet).toBeVisible();
    })

  });
});
