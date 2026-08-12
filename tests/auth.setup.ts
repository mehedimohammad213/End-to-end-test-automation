import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/loginPage';
import { ConduitApi } from '../src/api/conduitApi';
import { faker } from 'fillup-fake-data';
import * as fs from 'fs';
import * as path from 'path';

const authFile = path.join('.auth', 'user.json');

setup('authenticate user', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const email = process.env.USER_EMAIL ?? 'test1212@gmail.com';
  const password = process.env.USER_PASSWORD ?? '12345678';

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);

  const loginFailed = await page
    .locator('.error-messages li')
    .filter({ hasText: /invalid/i })
    .isVisible()
    .catch(() => false);

  if (loginFailed) {
    const api = new ConduitApi();
    await api.init();

    const uniqueId = faker.internet.uuid().replace(/-/g, '').slice(0, 8).toLowerCase();
    const newEmail = `qatest${uniqueId}@test.com`;
    const newUsername = `qatest${uniqueId}`;
    const newPassword = 'Test123456!';

    await api.register(newUsername, newEmail, newPassword);
    await api.dispose();

    await loginPage.goto();
    await loginPage.login(newEmail, newPassword);
  }

  await expect(loginPage.newArticleLink).toBeVisible({ timeout: 15_000 });
  await expect(page).not.toHaveURL(/\/login/);

  await page.context().storageState({ path: authFile });
});
