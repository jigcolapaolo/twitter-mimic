/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";

const authFile = "playwright/.auth/loginState.json";
test.use({ storageState: authFile });

test.describe("Search Page", () => {
  test("should run multiple assertions and be able to work the search page flow correctly", async ({
    page,
  }) => {
    // Inicia sesión una vez
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.click('button:has-text("Login with GitHub")');
    await page.waitForURL("http://localhost:3000/home", {
      waitUntil: "networkidle",
    });

    await test.step("Navigate to the search page", async () => {
        const searchButton = await page.locator('a[aria-label="SearchLink"]');
        await expect(searchButton).toBeVisible();
        await searchButton.click();

        await page.waitForURL("http://localhost:3000/search");
    });

    await test.step("Verify page elements related to search and filters are visible", async () => {
        const searchInput = await page.locator('input[placeholder="Buscar usuarios..."]');
        const topFilterInput = await page.locator(`input[value=top]`);
        const recentFilterInput = await page.locator(`input[value=recent]`);
        const myTweetsFilterInput = await page.locator(`input[value=myTweets]`);

        const topFilterLabel = await page.locator('label:has-text("Top")');
        const recentFilterLabel = await page.locator('label:has-text("Recientes")');
        const myTweetsFilterLabel = await page.locator('label:has-text("Mis Tweets")');

        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveValue("");
        await expect(topFilterInput).toBeHidden();
        await expect(recentFilterInput).toBeHidden();
        await expect(myTweetsFilterInput).toBeHidden();

        await expect(topFilterLabel).toBeVisible();
        await expect(recentFilterLabel).toBeVisible();
        await expect(myTweetsFilterLabel).toBeVisible();

        await expect(topFilterInput).toBeChecked();
    });

    await test.step("Verify search input is working correctly", async () => {
        const searchInput = await page.locator('input[placeholder="Buscar usuarios..."]');
        await expect(searchInput).toHaveValue("");

        await searchInput.fill("Test user");

        await expect(searchInput).toHaveValue("Test user");
        await expect(page.getByText("No hay resultados")).toBeVisible();
    });

    await test.step("Verify delete search input button is working correctly", async () => {
        const searchInput = page.locator('input[placeholder="Buscar usuarios..."]');
        const deleteSearchInputBtn = page.getByRole("button", { name: "X" });

        await expect(searchInput).toHaveValue("Test user");

        await deleteSearchInputBtn.click();

        await expect(searchInput).toHaveValue("");
    });

    await test.step("Verify filters are working correctly", async () => {
        const topFilterInput = page.locator(`input[value=top]`);
        const recentFilterInput = page.locator(`input[value=recent]`);
        const myTweetsFilterInput = page.locator(`input[value=myTweets]`);

        const topFilterLabel = await page.locator('label:has-text("Top")');
        const recentFilterLabel = await page.locator('label:has-text("Recientes")');
        const myTweetsFilterLabel = await page.locator('label:has-text("Mis Tweets")');

        await expect(topFilterLabel).toBeVisible();
        await expect(recentFilterLabel).toBeVisible();
        await expect(myTweetsFilterLabel).toBeVisible();

        await expect(topFilterInput).toBeChecked();
        await expect(recentFilterInput).not.toBeChecked();
        await expect(myTweetsFilterInput).not.toBeChecked();

        await recentFilterLabel.click();

        await expect(topFilterInput).not.toBeChecked();
        await expect(recentFilterInput).toBeChecked();
        await expect(myTweetsFilterInput).not.toBeChecked();

        await myTweetsFilterLabel.click();

        await expect(topFilterInput).not.toBeChecked();
        await expect(recentFilterInput).not.toBeChecked();
        await expect(myTweetsFilterInput).toBeChecked();
    });

  });
});
