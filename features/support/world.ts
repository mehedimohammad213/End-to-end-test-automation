import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { ConduitApi } from '../../src/api/conduitApi';

export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  api?: ConduitApi;
  articleSlug?: string;
  articleTitle?: string;
  createdSlug?: string;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  api?: ConduitApi;
  articleSlug?: string;
  articleTitle?: string;
  createdSlug?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
