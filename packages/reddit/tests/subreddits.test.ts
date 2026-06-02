import { makeRedditRequest } from '../client';
import type {
	GetHotPostsResponse,
	RedditEntityEnvelopeRaw,
	RedditListingRaw,
} from '../endpoints/types';
import {
	PostDataSchema,
	RedditEndpointOutputSchemas,
	SubredditDataSchema,
} from '../endpoints/types';
import { extractPosts, TEST_SUBREDDIT } from '../endpoints/utils';

describe('Subreddit endpoints test suite', () => {
	describe('Reddit JSON: /r/{subreddit}/about.json', () => {
		it('returns subreddit metadata (t5)', async () => {
			const raw = await makeRedditRequest<RedditEntityEnvelopeRaw>(
				`/r/${TEST_SUBREDDIT}/about.json`,
			);
			expect(raw.kind).toBe('t5');
			const parsed = SubredditDataSchema.parse(raw.data);
			expect(parsed.display_name).toBeDefined();
			expect(typeof parsed.subscribers).toBe('number');
		});

		it('parses all required fields from live data', async () => {
			const raw = await makeRedditRequest<RedditEntityEnvelopeRaw>(
				`/r/${TEST_SUBREDDIT}/about.json`,
			);
			const parsed = SubredditDataSchema.parse(raw.data);
			expect(parsed.id).toBeTruthy();
			expect(parsed.name).toMatch(/^t5_/);
			expect(parsed.display_name_prefixed).toMatch(/^r\//);
			expect(typeof parsed.over18).toBe('boolean');
			expect(typeof parsed.quarantine).toBe('boolean');
			expect(typeof parsed.created_utc).toBe('number');
			expect(typeof parsed.lang).toBe('string');
		});
	});

	describe('Reddit JSON: /r/{subreddit}/controversial.json', () => {
		it('accepts time filter t=week', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/controversial.json`,
				{ query: { limit: 5, t: 'week' } },
			);
			expect(raw.kind).toBe('Listing');
			const posts = extractPosts(raw);
			expect(posts.length).toBeGreaterThan(0);
		});

		it('accepts time filter t=month', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/controversial.json`,
				{ query: { limit: 3, t: 'month' } },
			);
			const posts = extractPosts(raw);
			expect(posts.length).toBeGreaterThan(0);
		});
	});

	describe('Reddit JSON: /r/{subreddit}/hot.json', () => {
		it('output schema accepts live hot.json posts', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/hot.json`,
				{ query: { limit: 5 } },
			);

			const posts = extractPosts(raw);
			const result: GetHotPostsResponse = {
				posts,
				after: raw.data.after,
				before: raw.data.before,
				dist: raw.data.dist ?? posts.length,
			};

			const parsed = RedditEndpointOutputSchemas.subredditsGetHot.parse(result);
			expect(parsed.posts.length).toBeGreaterThan(0);
			expect(parsed.dist).toBe(parsed.posts.length);
		});

		it('passthrough preserves extra fields', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/hot.json`,
				{ query: { limit: 1 } },
			);

			const posts = extractPosts(raw);
			const resultWithExtra = {
				posts,
				after: raw.data.after,
				before: raw.data.before,
				dist: raw.data.dist ?? posts.length,
				extra_field: 'test',
			};

			const parsed =
				RedditEndpointOutputSchemas.subredditsGetHot.parse(resultWithExtra);
			expect((parsed as Record<string, unknown>).extra_field).toBe('test');
		});

		it('respects limit parameter', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/hot.json`,
				{ query: { limit: 2 } },
			);

			const posts = extractPosts(raw);
			expect(posts.length).toBeLessThanOrEqual(2);
		});
	});

	describe('Reddit JSON: /r/{subreddit}/new.json', () => {
		it('returns a listing with parseable t3 children', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/new.json`,
				{ query: { limit: 3 } },
			);
			expect(raw.kind).toBe('Listing');
			const t3 = raw.data.children.filter((c) => c.kind === 't3');
			expect(t3.length).toBeGreaterThan(0);
			for (const child of t3) {
				expect(() => PostDataSchema.parse(child.data)).not.toThrow();
			}
		});

		it('returns pagination tokens', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/new.json`,
				{ query: { limit: 1 } },
			);
			expect(raw.data.after).toBeDefined();
		});
	});

	describe('Reddit JSON: /r/{subreddit}/rising.json', () => {
		it('returns parseable t3 posts', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/rising.json`,
				{ query: { limit: 5 } },
			);
			expect(raw.kind).toBe('Listing');
			const t3 = raw.data.children.filter((c) => c.kind === 't3');
			expect(t3.length).toBeGreaterThan(0);
			for (const child of t3) {
				expect(() => PostDataSchema.parse(child.data)).not.toThrow();
			}
		});
	});

	describe('Reddit JSON: /r/{subreddit}/top.json', () => {
		it('accepts time filter t=week', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/top.json`,
				{ query: { limit: 3, t: 'week' } },
			);
			expect(raw.kind).toBe('Listing');
			const posts = extractPosts(raw);
			expect(posts.length).toBeGreaterThan(0);
		});

		it('accepts time filter t=month', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/top.json`,
				{ query: { limit: 2, t: 'month' } },
			);
			const posts = extractPosts(raw);
			expect(posts.length).toBeGreaterThan(0);
		});

		it('accepts time filter t=all', async () => {
			const raw = await makeRedditRequest<RedditListingRaw>(
				`/r/${TEST_SUBREDDIT}/top.json`,
				{ query: { limit: 2, t: 'all' } },
			);
			const posts = extractPosts(raw);
			expect(posts.length).toBeGreaterThan(0);
		});
	});
});
