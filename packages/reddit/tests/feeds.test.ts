import { makeRedditRequest } from '../client';
import { PostDataSchema } from '../endpoints/types';
import type { RedditListingRaw } from '../endpoints/types';

describe('Reddit JSON: /r/all.json', () => {
	it('returns a listing of t3 posts', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>('/r/all.json', {
			query: { limit: 3 },
		});
		expect(raw.kind).toBe('Listing');
		const t3 = raw.data.children.filter((c) => c.kind === 't3');
		expect(t3.length).toBeGreaterThan(0);
		for (const child of t3) {
			expect(() => PostDataSchema.parse(child.data)).not.toThrow();
		}
	});

	it('respects limit parameter', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>('/r/all.json', {
			query: { limit: 1 },
		});
		expect(raw.data.children.length).toBeLessThanOrEqual(1);
	});
});

describe('Reddit JSON: /r/popular.json', () => {
	it('returns a listing of t3 posts', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>('/r/popular.json', {
			query: { limit: 3 },
		});
		expect(raw.kind).toBe('Listing');
		const t3 = raw.data.children.filter((c) => c.kind === 't3');
		expect(t3.length).toBeGreaterThan(0);
		for (const child of t3) {
			expect(() => PostDataSchema.parse(child.data)).not.toThrow();
		}
	});
});
