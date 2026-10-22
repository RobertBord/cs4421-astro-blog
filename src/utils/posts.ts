export const CATEGORIES = ['Driver Market', 'Race Analysis', 'Circuits'] as const;
export type Category = (typeof CATEGORIES)[number];

export const categorySlug = (category: string) => category.toLowerCase().replaceAll(' ', '-');

interface EditorialEntry {
	id: string;
	data: { draft?: boolean; pubDate: Date; category: Category; featured?: boolean };
}

export function publishedPosts<Entry extends EditorialEntry>(entries: Entry[]): Entry[] {
	return entries.filter(entry => !entry.data.draft).sort((first, second) =>
		second.data.pubDate.valueOf() - first.data.pubDate.valueOf() || first.id.localeCompare(second.id));
}

export function selectLead<Entry extends EditorialEntry>(entries: Entry[]): Entry | undefined {
	const posts = publishedPosts(entries);
	return posts.find(post => post.data.featured) ?? posts[0];
}

export function relatedPosts<Entry extends EditorialEntry>(entries: Entry[], current: Entry): Entry[] {
	return publishedPosts(entries).filter(post => post.id !== current.id)
		.sort((first, second) => Number(second.data.category === current.data.category) - Number(first.data.category === current.data.category))
		.slice(0, 2);
}