import { test, expect } from '@playwright/test';
import { EditorPage } from '../src/pages/editorPage';
import { ArticlePage } from '../src/pages/articlePage';
import { generateArticle } from '../src/data/testDataGenerator';
import { ConduitApi } from '../src/api/conduitApi';

test.describe('Create Article', () => {
  let api: ConduitApi;
  let createdSlug: string | undefined;

  test.beforeEach(async () => {
    api = new ConduitApi();
    await api.init();
    await api.login();
  });

  test.afterEach(async () => {
    if (createdSlug) {
      await api.deleteArticle(createdSlug);
      createdSlug = undefined;
    }
    await api.dispose();
  });

  test('should create a new article successfully @positive', async ({ page }) => {
    const articleData = generateArticle();
    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);

    await editorPage.goto();
    await editorPage.createArticle(articleData);

    await expect(page).toHaveURL(/\/article\/.+/);
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toContainText(articleData.body.slice(0, 50));

    createdSlug = page.url().split('/article/')[1];

    const persisted = await api.getArticle(createdSlug);
    expect(persisted?.title).toBe(articleData.title);
  });

  test('should show validation error when publishing without required fields @negative', async ({ page }) => {
    const editorPage = new EditorPage(page);

    await editorPage.goto();
    await editorPage.publish();

    await expect(editorPage.errorMessages.first()).toBeVisible();
    await expect(editorPage.errorMessages).toContainText(/can't be blank|should not be empty/i);
    await expect(page).toHaveURL(/\/editor$/);
  });
});
