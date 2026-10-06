import { makeRedditRequest } from '../client';
import { getComments } from '../endpoints/posts';
import type { RedditListingRaw } from '../endpoints/types';

jest.mock('../client', () => ({
	makeRedditRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockRequest = makeRedditRequest as jest.MockedFunction<
	typeof makeRedditRequest
>;

const commentsListing: RedditListingRaw = {
	kind: 'Listing',
	data: {
		after: null,
		before: null,
		children: [
			{
				kind: 't1',
				data: {
					id: 'cmt456',
					name: 't1_cmt456',
					body: 'Test comment',
					body_html: '<p>Test comment</p>',
					author: 'commenter',
					subreddit: 'test',
					subreddit_name_prefixed: 'r/test',
					score: 10,
					ups: 10,
					downs: 0,
					controversiality: 0,
					edited: false,
					created_utc: 1700000001,
					permalink: '/r/test/comments/abc123/comment/cmt456',
					link_id: 't3_abc123',
					parent_id: 't3_abc123',
				},
			},
		],
	},
} as unknown as RedditListingRaw;

function postListing(children: unknown[]): RedditListingRaw {
	return {
		kind: 'Listing',
		data: { after: null, before: null, children },
	} as unknown as RedditListingRaw;
}

// No ctx.db: the endpoint skips persistence, so tests observe only the response.
const ctx = {} as never;

describe('posts.getComments', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('returns comments with a null post when the post is deleted or removed', async () => {
		mockRequest.mockResolvedValue([postListing([]), commentsListing]);
		const result = await getComments(ctx, { post_id: 'abc123' });

		expect(result.post).toBeNull();
		expect(result.comments).toHaveLength(1);
		expect(result.comments[0]?.id).toBe('cmt456');
	});

	it('returns the post alongside its comments', async () => {
		mockRequest.mockResolvedValue([
			postListing([
				{
					kind: 't3',
					data: {
						id: 'abc123',
						name: 't3_abc123',
						title: 'Test Post',
						selftext: '',
						url: 'https://reddit.com/r/test/comments/abc123',
						author: 'testuser',
						subreddit: 'test',
						subreddit_name_prefixed: 'r/test',
						score: 100,
						ups: 100,
						downs: 0,
						upvote_ratio: 1,
						num_comments: 1,
						over_18: false,
						spoiler: false,
						stickied: false,
						created_utc: 1700000000,
						permalink: '/r/test/comments/abc123',
						thumbnail: 'self',
					},
				},
			]),
			commentsListing,
		]);
		const result = await getComments(ctx, { post_id: 'abc123' });

		expect(result.post?.id).toBe('abc123');
		expect(result.comments).toHaveLength(1);
	});
});
