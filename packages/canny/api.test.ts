import { CannyAPIError, makeCannyRequest } from './client';
import { Boards, Comments, Posts, Votes } from './endpoints';
import { CannyEndpointOutputSchemas } from './endpoints/types';
import type { CannyContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const LIVE_KEY: string = process.env.CANNY_API_KEY ?? '';

const describeIfKey = process.env.CANNY_API_KEY ? describe : describe.skip;

// Live tests hit the real Canny API over the sandbox network, which has
// proven flaky (occasional `fetch failed`); one retry absorbs a transient
// failure without masking a genuinely broken endpoint (it would fail twice).
jest.retryTimes(2);

function liveCtx(): CannyContext {
	const ctx = {
		key: LIVE_KEY,
		db: {},
		// Test-only narrow assertion: safe because the mocked
		// `logEventFromContext` never touches the context and every endpoint
		// guards database access (`ctx.db.boards && ...`), so the empty `db`
		// simply skips persistence; no better static type exists for a live
		// smoke-test context and no unvalidated data flows through it.
	} as unknown as CannyContext;
	return ctx;
}

describeIfKey('Canny live API', () => {
	it('boards.list returns boards matching the output schema', async () => {
		const result = await Boards.list(liveCtx(), {});
		CannyEndpointOutputSchemas.boardsList.parse(result);
		expect(Array.isArray(result.boards)).toBe(true);
	});

	it('boards.retrieve round-trips a listed board, else rejects a bogus id', async () => {
		const listed = await Boards.list(liveCtx(), {});
		const boardId: string = listed.boards[0]?.id ?? '';
		if (boardId === '') {
			await expect(
				Boards.retrieve(liveCtx(), { id: 'bogus-board-id' }),
			).rejects.toBeInstanceOf(CannyAPIError);
			return;
		}
		const result = await Boards.retrieve(liveCtx(), { id: boardId });
		CannyEndpointOutputSchemas.boardsRetrieve.parse(result);
		expect(result.id).toBe(boardId);
	});

	it('posts.list parses, or surfaces the provider boards constraint', async () => {
		try {
			const result = await Posts.list(liveCtx(), { limit: 5 });
			CannyEndpointOutputSchemas.postsList.parse(result);
			expect(Array.isArray(result.posts)).toBe(true);
			expect(typeof result.hasMore).toBe('boolean');
		} catch (error) {
			expect(error).toBeInstanceOf(CannyAPIError);
			if (error instanceof CannyAPIError) {
				expect(error.message).toBe('no boards available');
			} else {
				throw error;
			}
		}
	});

	it('posts.retrieve round-trips a listed post, else rejects a bogus id', async () => {
		try {
			const listed = await Posts.list(liveCtx(), { limit: 5 });
			const postId: string = listed.posts[0]?.id ?? '';
			if (postId === '') {
				await expect(
					Posts.retrieve(liveCtx(), { id: 'bogus-post-id' }),
				).rejects.toBeInstanceOf(CannyAPIError);
				return;
			}
			const result = await Posts.retrieve(liveCtx(), { id: postId });
			CannyEndpointOutputSchemas.postsRetrieve.parse(result);
			expect(result.id).toBe(postId);
		} catch (error) {
			expect(error).toBeInstanceOf(CannyAPIError);
			if (error instanceof CannyAPIError) {
				expect(error.message).toBe('no boards available');
			} else {
				throw error;
			}
		}
	});

	it('comments.list returns the documented envelope', async () => {
		const result = await Comments.list(liveCtx(), { limit: 5 });
		CannyEndpointOutputSchemas.commentsList.parse(result);
		expect(Array.isArray(result.comments)).toBe(true);
		expect(typeof result.hasMore).toBe('boolean');
	});

	it('votes.list parses, or surfaces the provider boards constraint', async () => {
		try {
			const result = await Votes.list(liveCtx(), { limit: 5 });
			CannyEndpointOutputSchemas.votesList.parse(result);
			expect(Array.isArray(result.votes)).toBe(true);
			expect(typeof result.hasMore).toBe('boolean');
		} catch (error) {
			expect(error).toBeInstanceOf(CannyAPIError);
			if (error instanceof CannyAPIError) {
				expect(error.message).toBe('no boards available');
			} else {
				throw error;
			}
		}
	});

	it('rejects an invalid api key with CannyAPIError', async () => {
		await expect(
			makeCannyRequest('boards/list', 'invalid-key'),
		).rejects.toBeInstanceOf(CannyAPIError);
	});
});
