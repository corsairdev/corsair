import { makeRedditRequest } from '../client';
import { SubredditDataSchema } from '../endpoints/types';
import type { RedditListingRaw } from '../endpoints/types';

describe('Reddit JSON: /subreddits/new.json', () => {
	it('returns a listing of t5 subreddits', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>(
			'/subreddits/new.json',
			{ query: { limit: 3 } },
		);
		expect(raw.kind).toBe('Listing');
		const t5 = raw.data.children.filter((c) => c.kind === 't5');
		expect(t5.length).toBeGreaterThan(0);
		for (const child of t5) {
			expect(() => SubredditDataSchema.parse(child.data)).not.toThrow();
		}
	});
});

describe('Reddit JSON: /subreddits/popular.json', () => {
	it('returns a listing of t5 subreddits', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>(
			'/subreddits/popular.json',
			{ query: { limit: 3 } },
		);
		expect(raw.kind).toBe('Listing');
		const t5 = raw.data.children.filter((c) => c.kind === 't5');
		expect(t5.length).toBeGreaterThan(0);
		for (const child of t5) {
			expect(() => SubredditDataSchema.parse(child.data)).not.toThrow();
		}
	});
});
