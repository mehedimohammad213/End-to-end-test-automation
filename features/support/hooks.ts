import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { CustomWorld } from './world';
import { ConduitApi } from '../../src/api/conduitApi';
import * as fs from 'fs';
import * as path from 'path';

setDefaultTimeout(30000);

let browser: Browser;

BeforeAll(async function () {
  const headless = process.env.HEADLESS !== 'false';
  browser = await chromium.launch({ headless });
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

Before(async function (this: CustomWorld) {
  const authFile = path.join('.auth', 'user.json');
  const storageState = fs.existsSync(authFile) ? authFile : undefined;
  const baseURL = process.env.BASE_URL || 'https://conduit.bondaracademy.com';

  this.browser = browser;
  this.context = await browser.newContext({ storageState, baseURL });
  this.page = await this.context.newPage();

  this.api = new ConduitApi();
  await this.api.init();
  await this.api.login();
});

After(async function (this: CustomWorld) {
  if (this.createdSlug && this.api) {
    await this.api.deleteArticle(this.createdSlug).catch(() => {});
    this.createdSlug = undefined;
  }
  if (this.articleSlug && this.api) {
    await this.api.deleteArticle(this.articleSlug).catch(() => {});
    this.articleSlug = undefined;
  }
  if (this.api) {
    await this.api.dispose().catch(() => {});
  }
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});
