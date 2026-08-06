import { test, expect } from '@playwright/test';
import { SettingsPage } from '../src/pages/settingsPage';
import { generateUserBio } from '../src/data/testDataGenerator';

test.describe('Update User Settings', () => {
  test('should update user settings successfully @positive', async ({ page }) => {
    const settingsPage = new SettingsPage(page);
    const newBio = generateUserBio();

    await settingsPage.goto();
    await settingsPage.updateSettings({ bio: newBio });

    await expect(page).toHaveURL(/\/profile\//);
    await expect(page.locator('.user-info p').first()).toContainText(newBio);
  });

  test('should block settings access after logout @negative', async ({ page }) => {
    const settingsPage = new SettingsPage(page);

    await settingsPage.goto();
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/(\?.*)?$/);

    await page.goto('/settings');
    await expect(page).not.toHaveURL(/\/settings$/);
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });
});
