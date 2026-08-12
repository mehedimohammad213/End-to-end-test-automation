import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { SettingsPage } from '../../src/pages/settingsPage';
import { generateUserBio } from '../../src/data/testDataGenerator';

let newBio: string;

Given('the user navigates to the settings page', async function (this: CustomWorld) {
  const settingsPage = new SettingsPage(this.page!);
  await settingsPage.goto();
});

When('the user updates their bio with new test data', async function (this: CustomWorld) {
  const settingsPage = new SettingsPage(this.page!);
  newBio = generateUserBio();
  await settingsPage.updateSettings({ bio: newBio });
});

Then(
  'the user should be redirected to their profile page',
  async function (this: CustomWorld) {
    await expect(this.page!).toHaveURL(/\/profile\//);
  },
);

Then(
  'the updated bio should be displayed on the profile page',
  async function (this: CustomWorld) {
    await expect(this.page!.locator('.user-info p').first()).toContainText(newBio);
  },
);

When('the user clicks the logout button', async function (this: CustomWorld) {
  await this.page!.getByRole('button', { name: /logout/i }).click();
  await expect(this.page!).toHaveURL(/\/(\?.*)?$/);
});

Then(
  'accessing the settings page should redirect away and prompt for sign in',
  async function (this: CustomWorld) {
    await this.page!.goto('/settings');
    await expect(this.page!).not.toHaveURL(/\/settings$/);
    await expect(this.page!.getByRole('link', { name: 'Sign in' })).toBeVisible();
  },
);
