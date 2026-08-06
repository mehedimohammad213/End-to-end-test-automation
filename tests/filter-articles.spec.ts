import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/homePage';
import { generateArticle, generateNonExistentTag } from '../src/data/testDataGenerator';
import { ConduitApi } from '../src/api/conduitApi';

test.describe('Filter Articles by Tag', () => {
  let api: ConduitApi;
  let articleSlug: string;
  let articleTitle: string;
  const filterTag = 'Bondar Academy';

  test.beforeEach(async () => {
    api = new ConduitApi();
    await api.init();
    await api.login();

    const article = await api.createArticle(
      generateArticle({ tagList: [filterTag, 'automation'] }),
    );
    articleSlug = article.slug;
    articleTitle = article.title;
  });

  test.afterEach(async () => {
    await api.deleteArticle(articleSlug);
    await api.dispose();
  });

  test('should filter articles by tag successfully @positive', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.filterByTag(filterTag);

    await expect(homePage.articleByTitle(articleTitle).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.feed-toggle .nav-link.active').filter({ hasText: filterTag })).toBeVisible();
  });

  test('should redirect to home for non-existent tag route @negative', async ({ page }) => {
    const fakeTag = generateNonExistentTag();

    await page.goto(`/tag/${fakeTag}`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/(\?.*)?$/);
    await expect(page.getByRole('heading', { name: articleTitle })).toHaveCount(0);
  });
});
