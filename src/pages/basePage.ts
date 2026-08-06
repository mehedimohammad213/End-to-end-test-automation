import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly homeLink: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('nav.navbar');
    this.homeLink = this.navbar.getByRole('link', { name: 'Home' });
    this.newArticleLink = this.navbar.getByRole('link', { name: 'New Article' });
    this.settingsLink = this.navbar.getByRole('link', { name: 'Settings' });
    this.profileLink = this.navbar.locator('a[href*="/profile/"]');
  }

  async gotoHome(): Promise<void> {
    await this.homeLink.click();
    await this.page.waitForURL(/\/(\?.*)?$/);
  }

  async gotoNewArticle(): Promise<void> {
    await this.newArticleLink.click();
    await this.page.waitForURL('**/editor');
  }

  async gotoSettings(): Promise<void> {
    await this.settingsLink.click();
    await this.page.waitForURL('**/settings');
  }
}
