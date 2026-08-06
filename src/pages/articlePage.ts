import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ArticlePage extends BasePage {
  readonly articleTitle: Locator;
  readonly articleBody: Locator;
  readonly articleTags: Locator;
  readonly editArticleLink: Locator;
  readonly deleteArticleButton: Locator;

  constructor(page: Page) {
    super(page);
    this.articleTitle = page.getByRole('heading', { level: 1 }).first();
    this.articleBody = page.locator('.article-page p, .article-content p').first();
    this.articleTags = page.locator('.article-page .tag-list li, .tag-list .tag-default');
    this.editArticleLink = page.getByRole('link', { name: /Edit Article/i }).first();
    this.deleteArticleButton = page.getByRole('button', { name: /Delete Article/i }).first();
  }

  async goto(slug: string): Promise<void> {
    await this.page.goto(`/article/${slug}`);
    await this.articleTitle.waitFor({ state: 'visible' });
  }

  async editArticle(): Promise<void> {
    await this.editArticleLink.click();
    await this.page.waitForURL('**/editor/**');
  }

  async deleteArticle(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.deleteArticleButton.click();
  }

  async cancelDeleteArticle(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.dismiss());
    await this.deleteArticleButton.click();
  }
}
