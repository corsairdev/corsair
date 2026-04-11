import { makeRedditSubredditRequest } from './client';
import type { GetHotPostsResponse } from './endpoints/types';
import { RedditEndpointOutputSchemas } from './endpoints/types';

const TEST_SUBREDDIT = process.env.TEST_REDDIT_SUBREDDIT ?? 'javascript';

type RedditListingRaw = {
	kind: 'Listing';
	data: {
		modhash: string | null;
		dist: number | null;
		after: string | null;
		before: string | null;
		children: Array<{ kind: string; data: Record<string, any> }>;
	};
};

describe('Reddit API Type Tests', () => {
	describe('subreddits', () => {
		it('subredditsGetHot returns correct type', async () => {
			const raw = await makeRedditSubredditRequest<RedditListingRaw>(
				TEST_SUBREDDIT,
				'hot',
				{ query: { limit: 5 } },
			);

			const posts = raw.data.children
				.filter((child) => child.kind === 't3')
				.map((child) => child.data);

			const result: GetHotPostsResponse = {
				posts: posts as any,
				after: raw.data.after,
				before: raw.data.before,
				dist: raw.data.dist ?? posts.length,
			};

			const parsed = RedditEndpointOutputSchemas.subredditsGetHot.parse(result);
			expect(parsed.posts.length).toBeGreaterThan(0);
			expect(parsed.dist).toBe(parsed.posts.length);
		});

		it('passthrough preserves extra fields on hot posts response', async () => {
			const raw = await makeRedditSubredditRequest<RedditListingRaw>(
				TEST_SUBREDDIT,
				'hot',
				{ query: { limit: 1 } },
			);

			const posts = raw.data.children
				.filter((child) => child.kind === 't3')
				.map((child) => child.data);

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
	});
});
