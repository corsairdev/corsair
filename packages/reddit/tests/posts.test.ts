import { makeRedditRequest } from '../client';
import { PostDataSchema, CommentDataSchema } from '../endpoints/types';
import { TEST_SUBREDDIT } from '../endpoints/utils';
import type { RedditListingRaw } from '../endpoints/types';

describe('Reddit JSON: /by_id/{names}.json', () => {
	it('returns posts by fullname IDs', async () => {
		const listing = await makeRedditRequest<RedditListingRaw>(
			`/r/${TEST_SUBREDDIT}/hot.json`,
			{ query: { limit: 2 } },
		);
		const names = listing.data.children
			.map((c) => c.data.name as string)
			.join(',');

		const raw = await makeRedditRequest<RedditListingRaw>(
			`/by_id/${names}.json`,
		);
		expect(raw.kind).toBe('Listing');
		const t3 = raw.data.children.filter((c) => c.kind === 't3');
		expect(t3.length).toBeGreaterThan(0);
		for (const child of t3) {
			expect(() => PostDataSchema.parse(child.data)).not.toThrow();
		}
	});
});

type PostCommentsRaw = [RedditListingRaw, RedditListingRaw];

async function getTopPostId(): Promise<string> {
	const raw = await makeRedditRequest<RedditListingRaw>(
		'/r/AskReddit/top.json',
		{ query: { limit: 1, t: 'week' } },
	);
	const first = raw.data.children[0];
	if (!first) throw new Error('No posts found in AskReddit/top');
	return first.data.id as string;
}

describe('Reddit JSON: /comments/{post_id}.json', () => {
	it('returns an array of two listings [post, comments]', async () => {
		const postId = await getTopPostId();
		const raw = await makeRedditRequest<PostCommentsRaw>(
			`/comments/${postId}.json`,
			{
				query: { limit: 3, depth: 2 },
			},
		);
		expect(Array.isArray(raw)).toBe(true);
		expect(raw.length).toBe(2);
		expect(raw[0].kind).toBe('Listing');
		expect(raw[1].kind).toBe('Listing');
	});

	it('first listing contains the t3 post', async () => {
		const postId = await getTopPostId();
		const raw = await makeRedditRequest<PostCommentsRaw>(
			`/comments/${postId}.json`,
			{
				query: { limit: 1 },
			},
		);
		const t3 = raw[0].data.children.filter((c) => c.kind === 't3');
		expect(t3.length).toBe(1);
		expect(() => PostDataSchema.parse(t3[0]!.data)).not.toThrow();
	});

	it('second listing contains parseable t1 comments', async () => {
		const postId = await getTopPostId();
		const raw = await makeRedditRequest<PostCommentsRaw>(
			`/comments/${postId}.json`,
			{
				query: { limit: 5, depth: 2, sort: 'top' },
			},
		);
		const t1 = raw[1].data.children.filter((c) => c.kind === 't1');
		expect(t1.length).toBeGreaterThan(0);
		for (const child of t1) {
			expect(() => CommentDataSchema.parse(child.data)).not.toThrow();
		}
	});

	it('accepts sort parameter', async () => {
		const postId = await getTopPostId();
		const raw = await makeRedditRequest<PostCommentsRaw>(
			`/comments/${postId}.json`,
			{
				query: { limit: 2, sort: 'new' },
			},
		);
		expect(raw[1].kind).toBe('Listing');
	});
});
