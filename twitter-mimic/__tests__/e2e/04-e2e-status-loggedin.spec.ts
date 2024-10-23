/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";

const authFile = "playwright/.auth/loginState.json";
test.use({ storageState: authFile });

test.describe("Status Page", () => {
  test("should run multiple assertions and be able to work the status page flow correctly", async ({
    page,
  }) => {
    // Inicia sesión una vez
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.click('button:has-text("Login with GitHub")');
    await page.waitForURL("http://localhost:3000/home", {
      waitUntil: "networkidle",
    });

    await test.step("Navigate to the status page", async () => {
      const newTweet = page.locator("article:has(p:has-text('Hello world'))");

      await expect(newTweet).toBeVisible();
      await newTweet.click();

      await page.waitForURL(/http:\/\/localhost:3000\/status\/.*/);
    });

    await test.step("Verify page elements are visible", async () => {
      const returnButton = await page.locator(
        'header button[aria-label="return-button"]'
      );
      const tweetContent = page.getByText("Hello world");
      const commentContent = page.getByPlaceholder("Escribe un comentario");
      const commentLength = page.getByText("0/280");
      const commentButton = page.getByRole("button", { name: "Comentar" });
      const noComments = page.getByText("No hay comentarios");

      await expect(returnButton).toBeVisible();
      await expect(tweetContent).toBeVisible();
      await expect(commentContent).toBeVisible();
      await expect(commentLength).toBeVisible();
      await expect(commentButton).toBeVisible();
      await expect(noComments).toBeVisible();
    });

    await test.step("Verify comment content is empty and comment button is disabled", async () => {
      const commentContent = page.getByPlaceholder("Escribe un comentario");
      const commentButton = page.getByRole("button", { name: "Comentar" });

      await expect(commentContent).toHaveValue("");
      await expect(commentButton).toBeDisabled();
    });

    await test.step("Verify comment button is enabled and comment length is correct when comment content is not empty", async () => {
      const commentContent = page.getByPlaceholder("Escribe un comentario");
      const commentButton = page.getByRole("button", { name: "Comentar" });
      const commentLength = page.getByText("/280");

      await expect(commentContent).toHaveValue("");
      await expect(commentButton).toBeDisabled();
      await expect(commentLength).toHaveText("0/280");

      await commentContent.fill("Test comentario 1");

      await expect(commentContent).toHaveValue("Test comentario 1");
      await expect(commentButton).toBeEnabled();
      await expect(commentLength).toHaveText("17/280");
    });

    await test.step("Verify comment button is working correctly", async () => {
      const commentContent = page.getByPlaceholder("Escribe un comentario");
      const commentButton = page.getByRole("button", { name: "Comentar" });

      await expect(commentContent).toHaveValue("Test comentario 1");
      await expect(commentButton).toBeEnabled();

      await commentButton.click();

      await expect(commentContent).toHaveValue("");
      await expect(commentButton).toBeDisabled();

      const newComment = page.locator(
        "article:has(p:has-text('Test comentario 1'))"
      );

      await expect(newComment).toBeVisible();
    });

    await test.step("Verify comment menu is working correctly", async () => {
      const commentMenuBtn = page.locator(
        "div[aria-label='CommentMenuDiv'] button[aria-label='CommentMenuBtn']"
      );
      const commentMenu = page.locator("div[aria-label='CommentMenuModal']");

      await expect(commentMenuBtn).toBeVisible();
      await expect(commentMenu).toHaveClass(/^commentMenu_opacityClosed__.*/);

      await commentMenuBtn.click();

      await expect(commentMenu).toHaveClass(/^commentMenu_opacityOpen__.*/);
      const editCommentButton = page.getByRole("button", { name: "Editar" });
      const deleteCommentButton = page.getByRole("button", {
        name: "Eliminar",
      });

      await expect(editCommentButton).toBeVisible();
      await expect(deleteCommentButton).toBeVisible();
    });

    await test.step("Verify edit comment button is working correctly", async () => {
      const saveEditedCommentBtn = page.locator("button:has-text('Guardar')");
      const editCommentMenuBtn = page.getByRole("button", { name: "Editar" });
      const editCommentLength = page.getByText("/280").nth(1);
      const commentContent = page
        .getByPlaceholder("Escribe un comentario")
        .nth(1);

      await expect(editCommentMenuBtn).toBeVisible();
      await editCommentMenuBtn.click();

      await expect(saveEditedCommentBtn).toBeVisible();
      await expect(saveEditedCommentBtn).toBeEnabled();
      await expect(editCommentLength).toHaveText("17/280");
      await expect(commentContent).toHaveValue("Test comentario 1");

      await commentContent.fill("Test comentario editado");

      await expect(commentContent).toHaveValue("Test comentario editado");
      await expect(saveEditedCommentBtn).toBeEnabled();
      await expect(editCommentLength).toHaveText("23/280");

      await saveEditedCommentBtn.click();

      const newComment = page.locator(
        "article:has(p:has-text('Test comentario editado'))"
      );

      await expect(newComment).toBeVisible();
    });

    await test.step("Verify delete comment button is working correctly", async () => {
      const commentMenuBtn = page.locator(
        "div[aria-label='CommentMenuDiv'] button[aria-label='CommentMenuBtn']"
      );
      const commentMenu = page.locator("div[aria-label='CommentMenuModal']");

      await expect(commentMenuBtn).toBeVisible();
      await expect(commentMenu).toHaveClass(/^commentMenu_opacityClosed__.*/);

      await commentMenuBtn.click();

      await expect(commentMenu).toHaveClass(/^commentMenu_opacityOpen__.*/);
      const editCommentButton = page.getByRole("button", { name: "Editar" });
      const deleteCommentButton = page.getByRole("button", {
        name: "Eliminar",
      });

      await expect(editCommentButton).toBeVisible();
      await expect(deleteCommentButton).toBeVisible();

      await deleteCommentButton.click();

      const noComments = page.getByText("No hay comentarios");
      await expect(noComments).toBeVisible();
    });

    await test.step("Return to home and delete test tweet, verifying that delete tweet button works", async () => {
      const newTweet = page.locator("article:has(p:has-text('Hello world'))");

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

      await deleteTweetButton.click();
      await expect(
        page.getByText("Tweet eliminado exitosamente")
      ).toBeVisible();
    });
  });
});
