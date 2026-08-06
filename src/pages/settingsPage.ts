import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export interface UserSettings {
  username?: string;
  email?: string;
  bio?: string;
  password?: string;
}

export class SettingsPage extends BasePage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly bioInput: Locator;
  readonly passwordInput: Locator;
  readonly updateSettingsButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.emailInput = page.getByPlaceholder('Email');
    this.bioInput = page.getByPlaceholder('Short bio about you');
    this.passwordInput = page.getByPlaceholder('New Password');
    this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
    this.errorMessages = page.locator('.error-messages li');
  }

  async goto(): Promise<void> {
    await this.page.goto('/settings');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async updateSettings(settings: UserSettings): Promise<void> {
    if (settings.username !== undefined) {
      await this.usernameInput.fill(settings.username);
    }
    if (settings.email !== undefined) {
      await this.emailInput.fill(settings.email);
    }
    if (settings.bio !== undefined) {
      await this.bioInput.fill(settings.bio);
    }
    if (settings.password !== undefined) {
      await this.passwordInput.fill(settings.password);
    }
    await this.updateSettingsButton.click();
  }

  async getCurrentEmail(): Promise<string> {
    return this.emailInput.inputValue();
  }

  async getCurrentBio(): Promise<string> {
    return this.bioInput.inputValue();
  }
}
