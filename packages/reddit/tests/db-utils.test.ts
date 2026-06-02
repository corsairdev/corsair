import type {
	CommentData,
	PostData,
	SubredditAboutData,
	UserAboutData,
} from '../endpoints/types';
import {
	saveCommentsToDb,
	savePostsToDb,
	saveSubredditsToDb,
	saveUserToDb,
} from '../endpoints/utils';

const mockPost = {
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
	upvote_ratio: 1.0,
	num_comments: 5,
	over_18: false,
	spoiler: false,
	stickied: false,
	created_utc: 1700000000,
	permalink: '/r/test/comments/abc123',
	thumbnail: 'self',
} as unknown as PostData;

const mockComment = {
	id: 'cmt456',
	name: 't1_cmt456',
	body: 'Test comment',
	body_html: '<p>Test comment</p>',
	author: 'commenter',
	subreddit: 'test',
	subreddit_name_prefixed: 'r/test',
	subreddit_id: 't5_xyz',
	score: 10,
	ups: 10,
	downs: 0,
	created_utc: 1700000001,
	permalink: '/r/test/comments/abc123/comment/cmt456',
	link_id: 't3_abc123',
	parent_id: 't3_abc123',
	is_submitter: false,
	stickied: false,
	locked: false,
} as unknown as CommentData;

const mockSubreddit = {
	id: 'sub789',
	name: 't5_sub789',
	display_name: 'test',
	display_name_prefixed: 'r/test',
	title: 'Test Subreddit',
	public_description: 'A test subreddit',
	description: 'A longer description',
	subscribers: 50000,
	created_utc: 1600000000,
	over18: false,
	quarantine: false,
	lang: 'en',
} as unknown as SubredditAboutData;

const mockUser = {
	id: 'usr321',
	name: 'testuser',
	icon_img: 'https://reddit.com/icon.png',
	total_karma: 1000,
	link_karma: 500,
	comment_karma: 500,
	created_utc: 1500000000,
	is_mod: false,
	is_gold: false,
} as unknown as UserAboutData;

function makeCtx(overrides: Record<string, jest.Mock | undefined> = {}) {
	return {
		db: {
			posts:
				overrides.posts !== undefined
					? overrides.posts
						? { upsertByEntityId: overrides.posts }
						: undefined
					: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			comments:
				overrides.comments !== undefined
					? overrides.comments
						? { upsertByEntityId: overrides.comments }
						: undefined
					: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			subreddits:
				overrides.subreddits !== undefined
					? overrides.subreddits
						? { upsertByEntityId: overrides.subreddits }
						: undefined
					: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			users:
				overrides.users !== undefined
					? overrides.users
						? { upsertByEntityId: overrides.users }
						: undefined
					: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	};
}

// ── savePostsToDb ─────────────────────────────────────────────────────────────

describe('savePostsToDb', () => {
	it('calls upsertByEntityId for each post with string id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ posts: upsert });
		await savePostsToDb(ctx, [mockPost]);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith(
			'abc123',
			expect.objectContaining({ id: 'abc123' }),
		);
	});

	it('calls upsertByEntityId for every post in the array', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ posts: upsert });
		const secondPost = {
			...mockPost,
			id: 'def456',
			name: 't3_def456',
		} as unknown as PostData;
		await savePostsToDb(ctx, [mockPost, secondPost]);
		expect(upsert).toHaveBeenCalledTimes(2);
		expect(upsert).toHaveBeenNthCalledWith(
			1,
			'abc123',
			expect.objectContaining({ id: 'abc123' }),
		);
		expect(upsert).toHaveBeenNthCalledWith(
			2,
			'def456',
			expect.objectContaining({ id: 'def456' }),
		);
	});

	it('does nothing when ctx.db.posts is undefined', async () => {
		const ctx = makeCtx({ posts: undefined });
		// Should not throw
		await expect(savePostsToDb(ctx, [mockPost])).resolves.toBeUndefined();
	});

	it('does nothing when posts array is empty', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ posts: upsert });
		await savePostsToDb(ctx, []);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('catches and warns on upsert error without throwing', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('DB error'));
		const ctx = makeCtx({ posts: upsert });
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		await expect(savePostsToDb(ctx, [mockPost])).resolves.toBeUndefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to save post to database:',
			expect.any(Error),
		);
		warnSpy.mockRestore();
	});
});

// ── saveCommentsToDb ──────────────────────────────────────────────────────────

describe('saveCommentsToDb', () => {
	it('calls upsertByEntityId for each comment with string id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ comments: upsert });
		await saveCommentsToDb(ctx, [mockComment]);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith(
			'cmt456',
			expect.objectContaining({ id: 'cmt456' }),
		);
	});

	it('does nothing when ctx.db.comments is undefined', async () => {
		const ctx = makeCtx({ comments: undefined });
		await expect(saveCommentsToDb(ctx, [mockComment])).resolves.toBeUndefined();
	});

	it('does nothing when comments array is empty', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ comments: upsert });
		await saveCommentsToDb(ctx, []);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('catches and warns on upsert error without throwing', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('DB error'));
		const ctx = makeCtx({ comments: upsert });
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		await expect(saveCommentsToDb(ctx, [mockComment])).resolves.toBeUndefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to save comments to database:',
			expect.any(Error),
		);
		warnSpy.mockRestore();
	});
});

// ── saveSubredditsToDb ────────────────────────────────────────────────────────

describe('saveSubredditsToDb', () => {
	it('calls upsertByEntityId for each subreddit with string id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ subreddits: upsert });
		await saveSubredditsToDb(ctx, [mockSubreddit]);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith(
			'sub789',
			expect.objectContaining({ id: 'sub789' }),
		);
	});

	it('does nothing when ctx.db.subreddits is undefined', async () => {
		const ctx = makeCtx({ subreddits: undefined });
		await expect(
			saveSubredditsToDb(ctx, [mockSubreddit]),
		).resolves.toBeUndefined();
	});

	it('does nothing when subreddits array is empty', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ subreddits: upsert });
		await saveSubredditsToDb(ctx, []);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('catches and warns on upsert error without throwing', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('DB error'));
		const ctx = makeCtx({ subreddits: upsert });
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		await expect(
			saveSubredditsToDb(ctx, [mockSubreddit]),
		).resolves.toBeUndefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to save subreddit to database:',
			expect.any(Error),
		);
		warnSpy.mockRestore();
	});
});

// ── saveUserToDb ──────────────────────────────────────────────────────────────

describe('saveUserToDb', () => {
	it('calls upsertByEntityId with the user string id', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const ctx = makeCtx({ users: upsert });
		await saveUserToDb(ctx, mockUser);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith(
			'usr321',
			expect.objectContaining({ id: 'usr321' }),
		);
	});

	it('does nothing when ctx.db.users is undefined', async () => {
		const ctx = makeCtx({ users: undefined });
		await expect(saveUserToDb(ctx, mockUser)).resolves.toBeUndefined();
	});

	it('catches and warns on upsert error without throwing', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('DB error'));
		const ctx = makeCtx({ users: upsert });
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		await expect(saveUserToDb(ctx, mockUser)).resolves.toBeUndefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to save user to database:',
			expect.any(Error),
		);
		warnSpy.mockRestore();
	});
});
