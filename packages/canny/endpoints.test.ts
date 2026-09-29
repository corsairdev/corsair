import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Boards, Comments, Posts, Votes } from './endpoints';
import type { CannyContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeCannyRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('Canny endpoints routing & event logging', () => {
	// Narrow assertion: safe because `jest.mock` above replaces both functions
	// with `jest.fn()` of the identical signature; the cast only recovers the
	// mock typing (`mockResolvedValue`, `toHaveBeenCalledWith`) and no
	// unvalidated data flows through it.
	const mockMakeCannyRequest = client.makeCannyRequest as jest.MockedFunction<
		typeof client.makeCannyRequest
	>;
	// Narrow assertion: same safety argument — `logEventFromContext` is mocked
	// with the real signature preserved via `jest.requireActual` spread.
	const mockLogEventFromContext = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	const mockBoard = {
		id: 'board_123',
		name: 'Feature Requests',
		created: '2026-01-01T00:00:00.000Z',
		isPrivate: false,
		postCount: 10,
		privateComments: false,
		url: 'https://example.canny.io/feature-requests',
	};

	const mockUser = {
		id: 'user_123',
		name: 'Jane Doe',
		created: '2026-01-01T00:00:00.000Z',
		email: 'jane@example.com',
		url: 'https://example.canny.io/users/jane',
		isAdmin: false,
	};

	const mockPost = {
		id: 'post_123',
		title: 'Dark Mode',
		details: 'Please add dark mode',
		score: 42,
		status: 'open',
		created: '2026-01-01T00:00:00.000Z',
		url: 'https://example.canny.io/p/dark-mode',
		commentCount: 2,
		author: mockUser,
		board: mockBoard,
	};

	const mockComment = {
		id: 'comment_123',
		value: 'Great idea!',
		created: '2026-01-01T00:00:00.000Z',
		author: mockUser,
		post: mockPost,
	};

	const mockVote = {
		id: 'vote_123',
		created: '2026-01-01T00:00:00.000Z',
		post: mockPost,
		voter: mockUser,
	};

	const ctx = {
		key: 'canny_test_api_key',
		db: {
			boards: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			posts: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			comments: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			votes: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
		},
		// Test-only narrow assertion: safe because endpoint handlers only read
		// `ctx.key`, `ctx.db.*`, and `logEventFromContext`; the mock provides
		// those members and no better static type exists for a partial test ctx.
	} as unknown as CannyContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Boards endpoints', () => {
		it('boards.list issues POST /boards/list and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce({
				boards: [mockBoard],
			});

			const result = await Boards.list(ctx, {});
			expect(result).toEqual({ boards: [mockBoard] });
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'boards/list',
				'canny_test_api_key',
				{
					method: 'POST',
					body: {},
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.boards.list',
				{},
				'completed',
			);
		});

		it('boards.retrieve issues POST /boards/retrieve and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce(mockBoard);

			const result = await Boards.retrieve(ctx, { id: 'board_123' });
			expect(result).toEqual(mockBoard);
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'boards/retrieve',
				'canny_test_api_key',
				{
					method: 'POST',
					body: { id: 'board_123' },
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.boards.retrieve',
				{ id: 'board_123' },
				'completed',
			);
		});
	});

	describe('Posts endpoints', () => {
		it('posts.list issues POST /posts/list and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce({
				hasMore: false,
				posts: [mockPost],
			});

			const result = await Posts.list(ctx, { limit: 10 });
			expect(result).toEqual({ hasMore: false, posts: [mockPost] });
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'posts/list',
				'canny_test_api_key',
				{
					method: 'POST',
					body: { limit: 10 },
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.posts.list',
				{ limit: 10 },
				'completed',
			);
		});

		it('posts.retrieve issues POST /posts/retrieve and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce(mockPost);

			const result = await Posts.retrieve(ctx, { id: 'post_123' });
			expect(result).toEqual(mockPost);
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'posts/retrieve',
				'canny_test_api_key',
				{
					method: 'POST',
					body: { id: 'post_123' },
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.posts.retrieve',
				{ id: 'post_123' },
				'completed',
			);
		});

		it('posts.retrieve supports boardID and urlName lookup', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce(mockPost);

			const input = {
				boardID: 'board_123',
				urlName: 'dark-mode',
			};
			const result = await Posts.retrieve(ctx, input);
			expect(result).toEqual(mockPost);
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'posts/retrieve',
				'canny_test_api_key',
				{
					method: 'POST',
					body: input,
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.posts.retrieve',
				input,
				'completed',
			);
		});

		it('posts.create issues POST /posts/create and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce({ id: 'post_123' });

			const input = {
				authorID: 'user_123',
				boardID: 'board_123',
				title: 'Dark Mode',
				details: 'Please add dark mode',
			};
			const result = await Posts.create(ctx, input);
			expect(result).toEqual({ id: 'post_123' });
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'posts/create',
				'canny_test_api_key',
				{
					method: 'POST',
					body: input,
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.posts.create',
				{ ...input, id: 'post_123' },
				'completed',
			);
		});

		it('posts.changeStatus issues POST /posts/change_status and logs event', async () => {
			const updatedPost = { ...mockPost, status: 'planned' };
			mockMakeCannyRequest.mockResolvedValueOnce(updatedPost);

			const input = {
				changerID: 'user_123',
				postID: 'post_123',
				status: 'planned' as const,
			};
			const result = await Posts.changeStatus(ctx, input);
			expect(result).toEqual(updatedPost);
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'posts/change_status',
				'canny_test_api_key',
				{
					method: 'POST',
					body: input,
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.posts.changeStatus',
				input,
				'completed',
			);
		});

		it('posts.delete issues POST /posts/delete and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce('success');

			const result = await Posts.delete(ctx, { postID: 'post_123' });
			expect(result).toBe('success');
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'posts/delete',
				'canny_test_api_key',
				{
					method: 'POST',
					body: { postID: 'post_123' },
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.posts.delete',
				{ postID: 'post_123' },
				'completed',
			);
		});
	});

	describe('Comments endpoints', () => {
		it('comments.list issues POST /comments/list and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce({
				comments: [mockComment],
				hasMore: false,
			});

			const result = await Comments.list(ctx, { postID: 'post_123' });
			expect(result).toEqual({
				comments: [mockComment],
				hasMore: false,
			});
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'comments/list',
				'canny_test_api_key',
				{
					method: 'POST',
					body: { postID: 'post_123' },
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.comments.list',
				{ postID: 'post_123' },
				'completed',
			);
		});

		it('comments.create issues POST /comments/create and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce({ id: 'comment_123' });

			const input = {
				authorID: 'user_123',
				postID: 'post_123',
				value: 'Great idea!',
			};
			const result = await Comments.create(ctx, input);
			expect(result).toEqual({ id: 'comment_123' });
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'comments/create',
				'canny_test_api_key',
				{
					method: 'POST',
					body: input,
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.comments.create',
				{ ...input, id: 'comment_123' },
				'completed',
			);
		});

		it('comments.delete issues POST /comments/delete and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce('success');

			const result = await Comments.delete(ctx, {
				commentID: 'comment_123',
			});
			expect(result).toBe('success');
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'comments/delete',
				'canny_test_api_key',
				{
					method: 'POST',
					body: { commentID: 'comment_123' },
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.comments.delete',
				{ commentID: 'comment_123' },
				'completed',
			);
		});
	});

	describe('Votes endpoints', () => {
		it('votes.list issues POST /votes/list and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce({
				hasMore: false,
				votes: [mockVote],
			});

			const result = await Votes.list(ctx, { postID: 'post_123' });
			expect(result).toEqual({ hasMore: false, votes: [mockVote] });
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'votes/list',
				'canny_test_api_key',
				{
					method: 'POST',
					body: { postID: 'post_123' },
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.votes.list',
				{ postID: 'post_123' },
				'completed',
			);
			expect(ctx.db.votes.upsertByEntityId).toHaveBeenCalledWith(
				'post_123_user_123',
				expect.objectContaining({ id: 'vote_123' }),
			);
		});

		it('votes.create issues POST /votes/create and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce('success');

			const input = {
				postID: 'post_123',
				voterID: 'user_123',
			};
			const result = await Votes.create(ctx, input);
			expect(result).toBe('success');
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'votes/create',
				'canny_test_api_key',
				{
					method: 'POST',
					body: input,
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.votes.create',
				input,
				'completed',
			);
		});

		it('votes.create forwards allowed votePriority values', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce('success');

			const input = {
				postID: 'post_123',
				voterID: 'user_123',
				votePriority: 10 as const,
			};
			const result = await Votes.create(ctx, input);
			expect(result).toBe('success');
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'votes/create',
				'canny_test_api_key',
				{
					method: 'POST',
					body: input,
				},
			);
		});

		it('votes.delete issues POST /votes/delete and logs event', async () => {
			mockMakeCannyRequest.mockResolvedValueOnce('success');

			const input = {
				postID: 'post_123',
				voterID: 'user_123',
			};
			const result = await Votes.delete(ctx, input);
			expect(result).toBe('success');
			expect(mockMakeCannyRequest).toHaveBeenCalledWith(
				'votes/delete',
				'canny_test_api_key',
				{
					method: 'POST',
					body: input,
				},
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.votes.delete',
				input,
				'completed',
			);
			expect(ctx.db.votes.deleteByEntityId).toHaveBeenCalledWith(
				'post_123_user_123',
			);
		});

		it('votes.delete rejects invalid input without voterID', async () => {
			await expect(
				Votes.delete(ctx, {
					postID: 'post_123',
					// Test-only narrow assertion: safe because the test intentionally
					// omits the required `voterID` to prove zod rejects it; the
					// object never reaches the provider.
				} as unknown as { postID: string; voterID: string }),
			).rejects.toThrow();
			expect(mockMakeCannyRequest).not.toHaveBeenCalled();
		});
	});
});
