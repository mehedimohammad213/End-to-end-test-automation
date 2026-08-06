import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  readonly feedToggle: Locator;
  readonly globalFeedTab: Locator;
  readonly yourFeedTab: Locator;
  readonly articlePreviews: Locator;
  readonly tagLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.feedToggle = page.locator('.feed-toggle');
    this.globalFeedTab = this.feedToggle.getByText('Global Feed', { exact: true });
    this.yourFeedTab = this.feedToggle.getByText('Your Feed', { exact: true });
    this.articlePreviews = page.locator('.article-preview');
    this.tagLinks = page.locator('.sidebar .tag-list a.tag-default');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.feedToggle.waitFor({ state: 'visible' });
  }

  async openGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
  }

  async filterByTag(tag: string): Promise<void> {
    await this.tagLinks.filter({ hasText: tag }).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  articleByTitle(title: string): Locator {
    return this.page.locator('.article-preview, a[href*="/article/"]').filter({ hasText: title });
  }

  async getVisibleArticleTitles(): Promise<string[]> {
    return this.articlePreviews.locator('h1').allTextContents();
  }
}
