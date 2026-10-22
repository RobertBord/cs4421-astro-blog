import { expect, it } from 'vitest';
import { editorialSchema } from './editorial-schema';

it('rejects unknown categories, empty image descriptions, and invalid source URLs', () => {
	expect(editorialSchema.safeParse({ category: 'Football' }).success).toBe(false);
	expect(editorialSchema.safeParse({ category: 'Circuits', heroAlt: '' }).success).toBe(false);
	expect(editorialSchema.safeParse({ category: 'Circuits', imageSource: 'not a URL' }).success).toBe(false);
	expect(editorialSchema.safeParse({}).success).toBe(false);
});

it('defaults optional publishing flags and accepts editorial metadata', () => {
	expect(editorialSchema.parse({ category: 'Circuits' })).toMatchObject({ draft: false, featured: false, tags: [] });
});