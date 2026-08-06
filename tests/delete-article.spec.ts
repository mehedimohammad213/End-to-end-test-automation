import { test, expect, request } from '@playwright/test';
import { ArticlePage } from '../src/pages/articlePage';
import { generateArticle } from '../src/data/testDataGenerator';
import { ConduitApi } from '../src/api/conduitApi';

test.describe('Delete Article', () => {
  let api: ConduitApi;
  let articleSlug: string;
  let articleTitle: string;

  test.beforeEach(async () => {
    api = new ConduitApi();
    await api.init();
    await api.login();
    const article = await api.createArticle(generateArticle());
    articleSlug = article.slug;
    articleTitle = article.title;
  });

  test.afterEach(async () => {
    await api.deleteArticle(articleSlug);
    await api.dispose();
  });

  test('should delete an article successfully @positive', async ({ page }) => {
    const articlePage = new ArticlePage(page);

    await articlePage.goto(articleSlug);
    await expect(articlePage.articleTitle).toHaveText(articleTitle);

    await articlePage.deleteArticle();
    await expect(page).toHaveURL(/\/(\?.*)?$/);

    const deleted = await api.getArticle(articleSlug);
    expect(deleted).toBeNull();

    articleSlug = '';
  });

  test('should reject unauthenticated delete requests @negative', async () => {
    const apiUrl = process.env.API_URL ?? 'https://conduit-api.bondaracademy.com/api';
    const ctx = await request.newContext();

    const response = await ctx.delete(`${apiUrl}/articles/${articleSlug}`);
    expect(response.status()).toBeGreaterThanOrEqual(401);

    const stillExists = await api.getArticle(articleSlug);
    expect(stillExists).not.toBeNull();

    await ctx.dispose();
  });
});
