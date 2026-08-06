import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export interface ArticleFormData {
  title: string;
  description: string;
  body: string;
  tags?: string[];
}

export class EditorPage extends BasePage {
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.titleInput = page.getByPlaceholder('Article Title');
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.bodyInput = page.getByPlaceholder('Write your article (in markdown)');
    this.tagsInput = page.getByPlaceholder('Enter tags');
    this.publishButton = page.getByRole('button', { name: /Publish Article|Update Article/i });
    this.errorMessages = page.locator('.error-messages li');
  }

  async goto(): Promise<void> {
    await this.page.goto('/editor');
    await this.titleInput.waitFor({ state: 'visible' });
  }

  async fillArticle(data: ArticleFormData): Promise<void> {
    await this.titleInput.fill(data.title);
    await this.descriptionInput.fill(data.description);
    await this.bodyInput.fill(data.body);

    if (data.tags?.length) {
      for (const tag of data.tags) {
        await this.tagsInput.fill(tag);
        await this.tagsInput.press('Enter');
      }
    }
  }

  async publish(): Promise<void> {
    await this.publishButton.click();
  }

  async createArticle(data: ArticleFormData): Promise<void> {
    await this.fillArticle(data);
    await this.publish();
  }
}
