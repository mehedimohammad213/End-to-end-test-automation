import { test, expect } from '@playwright/test';
import { EditorPage } from '../src/pages/editorPage';
import { ArticlePage } from '../src/pages/articlePage';
import { generateArticle } from '../src/data/testDataGenerator';
import { ConduitApi } from '../src/api/conduitApi';
import { faker } from '@faker-js/faker';

test.describe('Edit Article', () => {
  let api: ConduitApi;
  let articleSlug: string;
  let originalTitle: string;

  test.beforeEach(async () => {
    api = new ConduitApi();
    await api.init();
    await api.login();
    const article = await api.createArticle(generateArticle());
    articleSlug = article.slug;
    originalTitle = article.title;
  });

  test.afterEach(async () => {
    await api.deleteArticle(articleSlug);
    await api.dispose();
  });

  test('should edit an existing article successfully @positive', async ({ page }) => {
    const updatedTitle = `Updated ${faker.string.alphanumeric(8)}`;
    const updatedBody = faker.lorem.paragraphs(1);

    const articlePage = new ArticlePage(page);
    const editorPage = new EditorPage(page);

    await articlePage.goto(articleSlug);
    await articlePage.editArticle();

    await expect(editorPage.titleInput).not.toHaveValue('');
    await editorPage.titleInput.fill(updatedTitle);
    await editorPage.bodyInput.fill(updatedBody);
    await editorPage.publish();

    await expect(page).toHaveURL(/\/article\/.+/);
    await expect(articlePage.articleTitle).toHaveText(updatedTitle);
    await expect(articlePage.articleBody).toContainText(updatedBody.slice(0, 40));
  });

  test('should not update article when title is cleared @negative', async ({ page }) => {
    const articlePage = new ArticlePage(page);
    const editorPage = new EditorPage(page);

    await articlePage.goto(articleSlug);
    await articlePage.editArticle();
    await editorPage.titleInput.fill('');
    await editorPage.publish();

    const article = await api.getArticle(articleSlug);
    expect(article?.title).toBe(originalTitle);
    await expect(articlePage.articleTitle).toHaveText(originalTitle);
  });
});
