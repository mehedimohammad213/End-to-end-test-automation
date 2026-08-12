import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { EditorPage } from '../../src/pages/editorPage';
import { ArticlePage } from '../../src/pages/articlePage';
import { HomePage } from '../../src/pages/homePage';
import { generateArticle } from '../../src/data/testDataGenerator';
import { faker } from 'fillup-fake-data';

let currentArticleData: ReturnType<typeof generateArticle>;
let updatedTitle: string;
let updatedBody: string;

Given('the user navigates to the article editor page', async function (this: CustomWorld) {
  const editorPage = new EditorPage(this.page!);
  await editorPage.goto();
});

When('the user creates a new article with valid data', async function (this: CustomWorld) {
  currentArticleData = generateArticle();
  const editorPage = new EditorPage(this.page!);
  await editorPage.createArticle(currentArticleData);
});

Then(
  'the user should see the newly created article page with matching title and body',
  async function (this: CustomWorld) {
    const articlePage = new ArticlePage(this.page!);
    await expect(this.page!).toHaveURL(/\/article\/.+/);
    this.createdSlug = this.page!.url().split('/article/')[1].split('?')[0].split('#')[0];
    await expect(articlePage.articleTitle).toHaveText(currentArticleData.title);
    await expect(articlePage.articleBody).toContainText(currentArticleData.body.slice(0, 50));
  },
);

Then('the article should exist in the system backend', async function (this: CustomWorld) {
  const persisted = await this.api!.getArticle(this.createdSlug!);
  expect(persisted?.title).toBe(currentArticleData.title);
});

When('the user clicks publish without filling any fields', async function (this: CustomWorld) {
  const editorPage = new EditorPage(this.page!);
  await editorPage.publish();
});

Then('a validation error message should be displayed', async function (this: CustomWorld) {
  const editorPage = new EditorPage(this.page!);
  await expect(editorPage.errorMessages.first()).toBeVisible();
  await expect(editorPage.errorMessages).toContainText(/can't be blank|should not be empty/i);
});

Then('the user should remain on the editor page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/\/editor$/);
});

Given('an article exists in the system', async function (this: CustomWorld) {
  const article = await this.api!.createArticle(generateArticle());
  this.articleSlug = article.slug;
  this.articleTitle = article.title;
});

Given(
  'an article exists with tag {string}',
  async function (this: CustomWorld, tag: string) {
    const article = await this.api!.createArticle(
      generateArticle({ tagList: [tag, 'automation'] }),
    );
    this.articleSlug = article.slug;
    this.articleTitle = article.title;
  },
);

When('the user navigates to edit the article', async function (this: CustomWorld) {
  const articlePage = new ArticlePage(this.page!);
  await articlePage.goto(this.articleSlug!);
  await articlePage.editArticle();
});

When(
  'the user updates the title and body with new values',
  async function (this: CustomWorld) {
    updatedTitle = `Updated ${faker.internet.uuid().replace(/-/g, '').slice(0, 8)}`;
    updatedBody = faker.text.loremParagraph(1);

    const editorPage = new EditorPage(this.page!);
    await expect(editorPage.titleInput).not.toHaveValue('');
    await editorPage.titleInput.fill(updatedTitle);
    await editorPage.bodyInput.fill(updatedBody);
    await editorPage.publish();
  },
);

Then(
  'the article page should display the updated title and body',
  async function (this: CustomWorld) {
    const articlePage = new ArticlePage(this.page!);
    await expect(this.page!).toHaveURL(/\/article\/.+/);
    await expect(articlePage.articleTitle).toHaveText(updatedTitle);
    await expect(articlePage.articleBody).toContainText(updatedBody.slice(0, 40));
  },
);

When(
  'the user clears the title and attempts to publish',
  async function (this: CustomWorld) {
    const editorPage = new EditorPage(this.page!);
    await editorPage.titleInput.fill('');
    await editorPage.publish();
  },
);

Then('the article title should remain unchanged', async function (this: CustomWorld) {
  const articlePage = new ArticlePage(this.page!);
  const article = await this.api!.getArticle(this.articleSlug!);
  expect(article?.title).toBe(this.articleTitle);
  await expect(articlePage.articleTitle).toHaveText(this.articleTitle!);
});

When('the user views the article and clicks delete', async function (this: CustomWorld) {
  const articlePage = new ArticlePage(this.page!);
  await articlePage.goto(this.articleSlug!);
  await expect(articlePage.articleTitle).toHaveText(this.articleTitle!);
  await articlePage.deleteArticle();
});

Then('the user should be redirected to the home page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/\/(\?.*)?$/);
});

Then(
  'the article should no longer exist in the system backend',
  async function (this: CustomWorld) {
    const deleted = await this.api!.getArticle(this.articleSlug!);
    expect(deleted).toBeNull();
    this.articleSlug = undefined;
  },
);

When('the user navigates to the home page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page!);
  await homePage.goto();
});

When(
  'the user filters articles by tag {string}',
  async function (this: CustomWorld, tag: string) {
    const homePage = new HomePage(this.page!);
    await homePage.filterByTag(tag);
  },
);

Then(
  'the article should be visible in the filtered feed',
  async function (this: CustomWorld) {
    const homePage = new HomePage(this.page!);
    await expect(homePage.articleByTitle(this.articleTitle!).first()).toBeVisible({
      timeout: 15_000,
    });
  },
);
