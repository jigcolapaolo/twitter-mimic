/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";

const authFile = "playwright/.auth/loginState.json";
test.use({ storageState: authFile });

test.describe("Home page", () => {

  test("should run multiple assertions without reloading the page", async ({ page }) => {
    // Inicia sesión una vez
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.click('button:has-text("Login with GitHub")');
    await page.waitForURL("http://localhost:3000/home", { waitUntil: 'networkidle' });

    await test.step("Verify navigation buttons", async () => {
      const signOutButton = await page.locator('#sign-out-icon');
      const homeButton = await page.getByRole("link", { name: "HomeLink" }).locator('svg');
      const searchButton = await page.getByRole("link", { name: "SearchLink" }).locator('svg');
      const composeButton = await page.getByRole("link", { name: "ComposeLink" }).locator('svg');

      await expect(signOutButton).toBeVisible();
      await expect(homeButton).toBeVisible();
      await expect(searchButton).toBeVisible();
      await expect(composeButton).toBeVisible();
    });

    await test.step("Verify tweet elements", async () => {
      await page.waitForSelector('article', { timeout: 10000 });
  
      const avatar = await page.locator('article figure img').first();
      const name = await page.locator('article strong').first();
      const time = await page.locator('article time').first();
      const content = await page.locator('article').getByRole("paragraph").first();
      const tweetImage = await page.locator('img[alt="Tweet Image 1"]').first();
      const likeButton = await page.locator('footer button[aria-label="Like"]').first();
      const commentButton = await page.locator('footer button[aria-label="Comment"]').first();
      const retweetButton = await page.locator('footer button[aria-label="Retweet"]').first();
      const copyLinkButton = await page.locator('footer button[aria-label="CopyLink"]').first();
  
      await expect(avatar).toBeVisible();
      await expect(name).toBeVisible();
      await expect(time).toBeVisible();
      await expect(content).toBeVisible();
      await expect(tweetImage).toBeVisible();
      await expect(likeButton).toBeVisible();
      await expect(commentButton).toBeVisible();
      await expect(retweetButton).toBeVisible();
      await expect(copyLinkButton).toBeVisible();
    });

    await test.step("Verify copy message when copy link button is clicked", async () => {
      await page.locator('footer button[aria-label="CopyLink"]').first().click();
      page.getByText('Link copiado')
    })

    await test.step("Verify like button when like button is clicked", async () => {
      const likeButton = await page.locator('footer button[aria-label="Like"]').first();

      await expect(likeButton).toBeVisible();
      const svgLikeIconFilled = await likeButton.locator('svg[aria-label="like-icon-filled"]').first();
      const svgLikeIcon = await likeButton.locator('svg[aria-label="like-icon"]').first();
      const isFilledVisible = await svgLikeIconFilled.isVisible();

      await likeButton.click()

      if (isFilledVisible) {
        await expect(svgLikeIcon).toBeVisible();
        await expect(svgLikeIconFilled).toBeHidden();
      } else {
        await expect(svgLikeIconFilled).toBeVisible();
        await expect(svgLikeIcon).toBeHidden();
      }
    })
    
    await test.step("Verify tweet menu when button is clicked", async () => {

      const tweetMenuButton = await page.locator('div button[aria-label="tweetMenuIcon"]').first();
      await expect(tweetMenuButton).toBeVisible();

      const tweetMenu = await page.locator('div[aria-label="tweetMenu"]').first();
      await expect(tweetMenu).toHaveClass('home_opacityClosed__QR7Je');

      await tweetMenuButton.click();

      await expect(tweetMenu).toHaveClass('home_opacityOpen__vb5eG');

      const editTweetButton = await tweetMenu.locator('button[aria-label="tweetEdit"]');
      const deleteTweetButton = await tweetMenu.locator('button[aria-label="tweetDelete"]');

      await expect(editTweetButton).toBeVisible();
      await expect(deleteTweetButton).toBeVisible();

      await editTweetButton.click();

      await expect(page).toHaveURL(/http:\/\/localhost:3000\/status\/edit\/.*/);

      await page.goBack();
    })

    await test.step("Verify redirect to status/:id when tweet is clicked", async  () => {
      const tweet = await page.locator('article').first();

      await expect(tweet).toBeVisible();

      await tweet.click();

      await expect(page).toHaveURL(/http:\/\/localhost:3000\/status\/.*/);

      await page.goBack();
    })
    
    await test.step("Verify redirect to /compose when compose button is clicked", async () => {
      const composeButton = await page.locator('a[aria-label="ComposeLink"]');
      
      await expect(composeButton).toBeVisible();
      
      await composeButton.click();
      
      await expect(page).toHaveURL("http://localhost:3000/compose/tweet");

      await page.goBack();
    })

    await test.step("Verify redirect to /search when search button is clicked", async () => {
      const searchButton = await page.locator('a[aria-label="SearchLink"]');
      
      await expect(searchButton).toBeVisible();
      
      await searchButton.click();
      
      await expect(page).toHaveURL("http://localhost:3000/search");

      await page.goBack();
    })

        // await test.step("Verify retweet button when retweet button is clicked", async () => {

    //   const retweetButton = await page.locator('footer button[aria-label="Retweet"]').first();
    //   await expect(retweetButton).toBeVisible();
      
    //   const initialBackgroundColor = await retweetButton.evaluate(el => getComputedStyle(el).backgroundColor);

    //   await retweetButton.click();
    //   await page.waitForTimeout(500);
    
    //   const newBackgroundColor = await retweetButton.evaluate(el => getComputedStyle(el).backgroundColor);


    //   await initialBackgroundColor === 'rgba(0, 0, 0, 0)' ? 
    //     await expect(newBackgroundColor).toBe('rgb(176, 224, 230)') :
    //     await expect(newBackgroundColor).toBe('rgba(0, 0, 0, 0)');

    // })

    await test.step("Verify logout modal when logout button is clicked", async () => {
      const signoutButton = await page.locator('#sign-out-icon');
      const signoutButtonYes = page.getByRole("button", { name: /si/i });
      const signoutButtonNo = page.getByRole("button", { name: "No", exact: true });
      const signoutModal = await page.locator('section[aria-label="SignoutModal"]');
      
      await expect(signoutModal).toHaveClass(/opacityClosed/);
      
      await signoutButton.click();
      await expect(signoutModal).toHaveClass(/opacityOpen/);
      await expect(signoutButtonYes).toBeVisible();
      await expect(signoutButtonNo).toBeVisible();

      await signoutButtonNo.click();
      
      await signoutButtonYes.click();
      await page.waitForURL("http://localhost:3000/", { timeout: 10000 });
    })

  });
});