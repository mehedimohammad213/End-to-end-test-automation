import { faker } from 'fillup-fake-data';
import { ArticlePayload } from '../api/conduitApi';

export function generateArticle(overrides: Partial<ArticlePayload> = {}): ArticlePayload {
  const uniqueId = faker.internet.uuid().replace(/-/g, '').slice(0, 8).toLowerCase();

  return {
    title: overrides.title ?? `Test Article ${uniqueId}`,
    description: overrides.description ?? faker.text.loremSentence(),
    body: overrides.body ?? faker.text.loremParagraph(2),
    tagList: overrides.tagList ?? [faker.text.word(), `qa-${uniqueId}`],
  };
}

export function generateInvalidArticle(): Partial<ArticlePayload> {
  return {
    title: '',
    description: '',
    body: '',
  };
}

export function generateUserBio(): string {
  return faker.person.bio();
}

export function generateInvalidEmail(): string {
  return faker.internet.uuid().replace(/-/g, '').slice(0, 10) + '@invalid';
}

export function generateNonExistentTag(): string {
  return `nonexistent-tag-${faker.internet.uuid().replace(/-/g, '').slice(0, 12).toLowerCase()}`;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
