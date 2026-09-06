import { createHmac } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import type { CannyContext } from './index';
import { CommentWebhooks, PostWebhooks, VoteWebhooks } from './webhooks';
import {
	createCannyMatch,
	verifyCannyWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('Canny webhooks', () => {
	const secret = 'canny_secret_123';
	const nonce = 'random_nonce_abc';
	const validSignature = createHmac('sha256', secret)
		.update(nonce)
		.digest('base64');

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
		key: secret,
		db: {
			posts: {
				upsertByEntityId: jest.fn(),
			},
			comments: {
				upsertByEntityId: jest.fn(),
			},
			votes: {
				upsertByEntityId: jest.fn(),
			},
		},
	} as unknown as CannyContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('verifyCannyWebhookSignature', () => {
		it('accepts valid HMAC signature with nonce', () => {
			const req = {
				headers: {
					'canny-nonce': nonce,
					'canny-signature': validSignature,
					'canny-timestamp': Date.now().toString(),
				},
				body: '{}',
				rawBody: '{}',
				payload: {},
			};
			const res = verifyCannyWebhookSignature(req, secret);
			expect(res.valid).toBe(true);
		});

		it('rejects invalid signature', () => {
			const req = {
				headers: {
					'canny-nonce': nonce,
					'canny-signature': 'invalid_signature_base64=',
				},
				body: '{}',
				rawBody: '{}',
				payload: {},
			};
			const res = verifyCannyWebhookSignature(req, secret);
			expect(res.valid).toBe(false);
			expect(res.error).toBe('Invalid signature');
		});

		it('rejects missing secret', () => {
			const req = {
				headers: {
					'canny-nonce': nonce,
					'canny-signature': validSignature,
				},
				body: '{}',
				rawBody: '{}',
				payload: {},
			};
			const res = verifyCannyWebhookSignature(req, undefined);
			expect(res.valid).toBe(false);
			expect(res.error).toBe('Missing webhook secret or API key');
		});

		it('rejects missing nonce or signature header', () => {
			const req = {
				headers: {},
				body: '{}',
				rawBody: '{}',
				payload: {},
			};
			const res = verifyCannyWebhookSignature(req, secret);
			expect(res.valid).toBe(false);
			expect(res.error).toBe('Missing canny-signature or canny-nonce header');
		});
	});

	describe('createCannyMatch', () => {
		it('matches correct event type from json string body', () => {
			const matcher = createCannyMatch('post.created');
			expect(
				matcher({
					body: JSON.stringify({ type: 'post.created' }),
					headers: {},
				}),
			).toBe(true);
			expect(
				matcher({
					body: JSON.stringify({ type: 'comment.created' }),
					headers: {},
				}),
			).toBe(false);
		});
	});

	describe('post.created handler', () => {
		it('processes valid post.created event', async () => {
			const req = {
				headers: {
					'canny-nonce': nonce,
					'canny-signature': validSignature,
				},
				body: '',
				rawBody: '',
				payload: {
					created: '2026-01-01T00:00:00.000Z',
					objectType: 'post' as const,
					type: 'post.created' as const,
					object: mockPost,
				},
			};

			const res = await PostWebhooks.created.handler(ctx, req);
			expect(res.success).toBe(true);
			expect(ctx.db.posts.upsertByEntityId).toHaveBeenCalledWith(
				'post_123',
				expect.objectContaining({ id: 'post_123', title: 'Dark Mode' }),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.webhook.post.created',
				{ id: 'post_123', title: 'Dark Mode' },
				'completed',
			);
		});
	});

	describe('post.status_changed handler', () => {
		it('processes valid post.status_changed event', async () => {
			const req = {
				headers: {
					'canny-nonce': nonce,
					'canny-signature': validSignature,
				},
				body: '',
				rawBody: '',
				payload: {
					created: '2026-01-01T00:00:00.000Z',
					objectType: 'post' as const,
					type: 'post.status_changed' as const,
					object: { ...mockPost, status: 'in_progress' },
				},
			};

			const res = await PostWebhooks.statusChanged.handler(ctx, req);
			expect(res.success).toBe(true);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.webhook.post.status_changed',
				{ id: 'post_123', status: 'in_progress' },
				'completed',
			);
		});
	});

	describe('comment.created handler', () => {
		it('processes valid comment.created event', async () => {
			const req = {
				headers: {
					'canny-nonce': nonce,
					'canny-signature': validSignature,
				},
				body: '',
				rawBody: '',
				payload: {
					created: '2026-01-01T00:00:00.000Z',
					objectType: 'comment' as const,
					type: 'comment.created' as const,
					object: mockComment,
				},
			};

			const res = await CommentWebhooks.created.handler(ctx, req);
			expect(res.success).toBe(true);
			expect(ctx.db.comments.upsertByEntityId).toHaveBeenCalledWith(
				'comment_123',
				expect.objectContaining({
					id: 'comment_123',
					value: 'Great idea!',
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.webhook.comment.created',
				{ id: 'comment_123', postID: 'post_123' },
				'completed',
			);
		});
	});

	describe('vote.created handler', () => {
		it('processes valid vote.created event', async () => {
			const req = {
				headers: {
					'canny-nonce': nonce,
					'canny-signature': validSignature,
				},
				body: '',
				rawBody: '',
				payload: {
					created: '2026-01-01T00:00:00.000Z',
					objectType: 'vote' as const,
					type: 'vote.created' as const,
					object: mockVote,
				},
			};

			const res = await VoteWebhooks.created.handler(ctx, req);
			expect(res.success).toBe(true);
			expect(ctx.db.votes.upsertByEntityId).toHaveBeenCalledWith(
				'vote_123',
				expect.objectContaining({ id: 'vote_123' }),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'canny.webhook.vote.created',
				{ id: 'vote_123', postID: 'post_123', voterID: 'user_123' },
				'completed',
			);
		});
	});
});
