import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/loginPage';
import { ConduitApi } from '../src/api/conduitApi';
import { faker } from 'fillup-fake-data';
import * as fs from 'fs';
import * as path from 'path';

const authFile = path.join('.auth', 'user.json');

setup('authenticate user', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  let email = process.env.USER_EMAIL || 'qatest1786008503@test.com';
  let password = process.env.USER_PASSWORD || 'Test123456!';

  const api = new ConduitApi();
  await api.init();

  try {
    await api.login(email, password);
  } catch {
    const uniqueId = faker.internet.uuid().replace(/-/g, '').slice(0, 8).toLowerCase();
    email = `qatest${uniqueId}@test.com`;
    const username = `qatest${uniqueId}`;
    password = 'Test123456!';
    await api.register(username, email, password);
  } finally {
    await api.dispose();
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(loginPage.newArticleLink).toBeVisible({ timeout: 15_000 });
  await expect(page).not.toHaveURL(/\/login/);

  await page.context().storageState({ path: authFile });
});
