import { describe, expect, it } from 'vitest';
import { categorySlug, publishedPosts, relatedPosts, selectLead } from './posts';

const entry = (id: string, date: string, extras = {}) => ({ id, data: { pubDate: new Date(date), category: 'Circuits' as const, ...extras } });

describe('editorial selection', () => {
	const older = entry('older', '2024-01-01');
	const newer = entry('newer', '2024-02-01');
	const draft = entry('draft', '2025-01-01', { draft: true, featured: true });
	it('excludes drafts and sorts newest first without mutating input', () => {
		const posts = [older, draft, newer];
		expect(publishedPosts(posts)).toEqual([newer, older]);
		expect(posts).toEqual([older, draft, newer]);
	});
	it('breaks equal-date ties by ID', () => expect(publishedPosts([entry('b', '2024-01-01'), entry('a', '2024-01-01')])[0].id).toBe('a'));
	it('selects a published featured post with a newest fallback', () => {
		expect(selectLead([older, draft, newer])).toEqual(newer);
		expect(selectLead([{ ...older, data: { ...older.data, featured: true } }, newer])?.id).toBe('older');
		expect(selectLead([])).toBeUndefined();
	});
	it('excludes current and draft posts from related stories', () => expect(relatedPosts([older, newer, draft], newer)).toEqual([older]));
	it('handles empty collections and category URLs', () => {
		expect(publishedPosts([])).toEqual([]);
		expect(categorySlug('Driver Market')).toBe('driver-market');
	});
});