import { faker } from '@faker-js/faker';
import { ArticlePayload } from '../api/conduitApi';

export function generateArticle(overrides: Partial<ArticlePayload> = {}): ArticlePayload {
  const uniqueId = faker.string.alphanumeric(8).toLowerCase();

  return {
    title: overrides.title ?? `Test Article ${uniqueId}`,
    description: overrides.description ?? faker.lorem.sentence(),
    body: overrides.body ?? faker.lorem.paragraphs(2),
    tagList: overrides.tagList ?? [faker.word.noun(), `qa-${uniqueId}`],
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
  return faker.string.alphanumeric(10) + '@invalid';
}

export function generateNonExistentTag(): string {
  return `nonexistent-tag-${faker.string.alphanumeric(12).toLowerCase()}`;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
