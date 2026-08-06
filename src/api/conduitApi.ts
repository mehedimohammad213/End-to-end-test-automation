import { APIRequestContext, request } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export interface ArticlePayload {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface CreatedArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export class ConduitApi {
  private readonly apiUrl: string;
  private context: APIRequestContext | null = null;
  private token: string | null = null;

  constructor(apiUrl = process.env.API_URL ?? 'https://conduit-api.bondaracademy.com/api') {
    this.apiUrl = apiUrl.replace(/\/$/, '');
  }

  private endpoint(path: string): string {
    return `${this.apiUrl}/${path.replace(/^\//, '')}`;
  }

  async init(): Promise<void> {
    this.context = await request.newContext({
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
  }

  async dispose(): Promise<void> {
    await this.context?.dispose();
    this.context = null;
    this.token = null;
  }

  async register(username: string, email: string, password: string): Promise<string> {
    if (!this.context) await this.init();

    const response = await this.context!.post(this.endpoint('users'), {
      data: { user: { username, email, password } },
    });

    if (!response.ok()) {
      throw new Error(`Registration failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    this.token = body.user.token;
    return this.token;
  }

  async login(email?: string, password?: string): Promise<string> {
    if (!this.context) await this.init();

    const response = await this.context!.post(this.endpoint('users/login'), {
      data: {
        user: {
          email: email ?? process.env.USER_EMAIL,
          password: password ?? process.env.USER_PASSWORD,
        },
      },
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    this.token = body.user.token;
    return this.token;
  }

  private authHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('Not authenticated. Call login() first.');
    }
    return { Authorization: `Token ${this.token}` };
  }

  async createArticle(payload: ArticlePayload): Promise<CreatedArticle> {
    if (!this.context) await this.init();
    if (!this.token) await this.login();

    const response = await this.context!.post(this.endpoint('articles'), {
      headers: this.authHeaders(),
      data: { article: payload },
    });

    if (!response.ok()) {
      throw new Error(`Create article failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    const article = body.article;
    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList ?? [],
    };
  }

  async deleteArticle(slug: string): Promise<void> {
    if (!this.context) await this.init();
    if (!this.token) await this.login();

    const response = await this.context!.delete(this.endpoint(`articles/${slug}`), {
      headers: this.authHeaders(),
    });

    if (!response.ok() && response.status() !== 404) {
      throw new Error(`Delete article failed: ${response.status()} ${await response.text()}`);
    }
  }

  async getArticle(slug: string): Promise<CreatedArticle | null> {
    if (!this.context) await this.init();

    const response = await this.context!.get(this.endpoint(`articles/${slug}`));
    if (response.status() === 404) return null;

    const body = await response.json();
    const article = body.article;
    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList ?? [],
    };
  }

  async getTags(): Promise<string[]> {
    if (!this.context) await this.init();

    const response = await this.context!.get(this.endpoint('tags'));
    const body = await response.json();
    return body.tags ?? [];
  }
}
