import { makeRedditRequest } from '../client';
import type { RedditListingRaw } from '../endpoints/types';
import { PostDataSchema, SubredditDataSchema } from '../endpoints/types';
import { TEST_SUBREDDIT } from '../endpoints/utils';

describe('Reddit JSON: /search.json', () => {
	it('returns search results for a query', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>('/search.json', {
			query: { q: 'javascript', limit: 3 },
		});
		expect(raw.kind).toBe('Listing');
		const t3 = raw.data.children.filter((c) => c.kind === 't3');
		expect(t3.length).toBeGreaterThan(0);
		for (const child of t3) {
			expect(() => PostDataSchema.parse(child.data)).not.toThrow();
		}
	});

	it('accepts sort and time filter', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>('/search.json', {
			query: { q: 'typescript', sort: 'top', t: 'month', limit: 2 },
		});
		expect(raw.kind).toBe('Listing');
	});

	it('searches within a subreddit', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>(
			`/r/${TEST_SUBREDDIT}/search.json`,
			{ query: { q: 'async', restrict_sr: true, limit: 3 } },
		);
		expect(raw.kind).toBe('Listing');
		const t3 = raw.data.children.filter((c) => c.kind === 't3');
		expect(t3.length).toBeGreaterThan(0);
		for (const child of t3) {
			expect(() => PostDataSchema.parse(child.data)).not.toThrow();
		}
	});

	it('accepts sort and time filter', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>(
			`/r/${TEST_SUBREDDIT}/search.json`,
			{
				query: {
					q: 'react',
					restrict_sr: true,
					sort: 'top',
					t: 'year',
					limit: 2,
				},
			},
		);
		expect(raw.kind).toBe('Listing');
	});

	it('returns subreddit results (t5)', async () => {
		const raw = await makeRedditRequest<RedditListingRaw>(
			'/subreddits/search.json',
			{ query: { q: 'programming', limit: 3 } },
		);
		expect(raw.kind).toBe('Listing');
		const t5 = raw.data.children.filter((c) => c.kind === 't5');
		expect(t5.length).toBeGreaterThan(0);
		for (const child of t5) {
			expect(() => SubredditDataSchema.parse(child.data)).not.toThrow();
		}
	});
});
