/**
 * Exercises all five endpoint wrappers: method and path, request bodies and
 * query, cache writes, error handling and the event log. Network access is
 * mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	cancelPost,
	createPost,
	getPost,
	listAccounts,
	listPosts,
} from './endpoints/handlers';
import {
	errorHandlers,
	isNonIdempotent,
	postonceErrorCode,
} from './error-handlers';
import { postonceEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof listAccounts>[0];

function makeCtx() {
	const db = {
		accounts: makeStore(),
		posts: makeStore(),
	};
	const ctx = {
		key: 'test-postonce-key',
		options: {},
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

const POST_ID = '2f1c7a4e-4d3b-4f5e-9a8b-1c2d3e4f5a6b';
const ACCOUNT_ID = '7b2d1c9e-0a4f-4c3b-8e2d-9f1a2b3c4d5e';

const ACCOUNT = {
	id: ACCOUNT_ID,
	platform: 'linkedin',
	username: 'corsair-test',
	avatar_url: null,
	status: 'active',
	capabilities: {
		connection_mode: 'oauth',
		destination: true,
		source: false,
		text: true,
		images: true,
		video: true,
	},
	media_requirements: {
		supported_formats: ['image/jpeg', 'image/png', 'video/mp4'],
		max_size_bytes: { image: 8388608, video: 209715200 },
		required_media: null,
		max_hashtags: null,
	},
	created_at: '2026-11-01T10:00:00.000Z',
	updated_at: '2026-11-10T10:00:00.000Z',
};

const POST = {
	id: POST_ID,
	content: 'Launching today',
	external_id: null,
	media: [{ url: 'https://example.com/launch.png', type: 'image' }],
	origin: 'api',
	publish_at: '2026-12-01T15:00:00.000Z',
	status: 'scheduled',
	created_at: '2026-11-17T09:00:00.000Z',
	targets: [
		{
			target_post_id: 'tp_1',
			account_id: ACCOUNT_ID,
			platform: 'linkedin',
			target_variant: null,
			username: 'corsair-test',
			status: 'scheduled',
			error: null,
			platform_post_id: null,
			platform_post_url: null,
			scheduled_time: '2026-12-01T15:00:00.000Z',
		},
	],
};

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;
let lastHeaders: Record<string, string> = {};

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	lastHeaders = {};
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				lastHeaders[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				lastHeaders[key.toLowerCase()] = value;
			}
		}
		const path = new URL(String(url)).pathname;
		let payload: unknown = {};
		let status = 200;
		if (path.endsWith('/accounts')) payload = { data: [ACCOUNT] };
		else if (path.endsWith('/cancel'))
			payload = { data: { ...POST, status: 'cancelled' } };
		else if (path.endsWith('/posts') && lastMethod === 'POST') {
			payload = { data: POST };
			status = 201;
		} else if (path.endsWith('/posts'))
			payload = { data: [POST], meta: { next_cursor: null } };
		else if (path.includes('/posts/')) payload = { data: POST };
		return {
			ok: true,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
});

const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	[
		'accounts.list',
		(c) => listAccounts(c, {}),
		'GET',
		'/api/public/v1/accounts',
	],
	[
		'posts.create',
		(c) =>
			createPost(c, {
				content: 'Launching today',
				targets: [{ account_id: ACCOUNT_ID }],
			}),
		'POST',
		'/api/public/v1/posts',
	],
	[
		'posts.get',
		(c) => getPost(c, { id: POST_ID }),
		'GET',
		`/api/public/v1/posts/${POST_ID}`,
	],
	['posts.list', (c) => listPosts(c, {}), 'GET', '/api/public/v1/posts'],
	[
		'posts.cancel',
		(c) => cancelPost(c, { id: POST_ID }),
		'POST',
		`/api/public/v1/posts/${POST_ID}/cancel`,
	],
];

describe('routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
			expect(lastHeaders.authorization).toBe('Bearer test-postonce-key');
		});
	}
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(postonceEndpointMeta).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(5);
	});

	it('marks publishing and cancelling destructive, reads read', () => {
		expect(postonceEndpointMeta['posts.create'].riskLevel).toBe('destructive');
		expect(postonceEndpointMeta['posts.cancel'].riskLevel).toBe('destructive');
		expect(postonceEndpointMeta['accounts.list'].riskLevel).toBe('read');
		expect(postonceEndpointMeta['posts.get'].riskLevel).toBe('read');
		expect(postonceEndpointMeta['posts.list'].riskLevel).toBe('read');
	});

	it('treats only the writes as non-idempotent', () => {
		expect(isNonIdempotent('posts.create')).toBe(true);
		expect(isNonIdempotent('posts.cancel')).toBe(true);
		expect(isNonIdempotent('posts.get')).toBe(false);
		expect(isNonIdempotent('posts.list')).toBe(false);
		expect(isNonIdempotent('accounts.list')).toBe(false);
	});
});

describe('request bodies and query', () => {
	it('sends a scheduled post with media and the idempotency key header', async () => {
		const { ctx } = makeCtx();
		await createPost(ctx, {
			content: 'Launching today',
			targets: [
				{
					account_id: ACCOUNT_ID,
					content_override: 'Launching today on LinkedIn',
					platform_options: { title: 'Launch' },
				},
			],
			media: [{ url: 'https://example.com/launch.png', type: 'image' }],
			publish_at: '2026-12-01T15:00:00Z',
			external_id: 'launch-42',
			idempotencyKey: 'launch-42',
		});

		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			content: 'Launching today',
			targets: [
				{
					account_id: ACCOUNT_ID,
					content_override: 'Launching today on LinkedIn',
					platform_options: { title: 'Launch' },
				},
			],
			media: [{ url: 'https://example.com/launch.png', type: 'image' }],
			publish_at: '2026-12-01T15:00:00Z',
			external_id: 'launch-42',
		});
		expect(lastHeaders['idempotency-key']).toBe('launch-42');
	});

	it('omits unset fields on an immediate post', async () => {
		const { ctx } = makeCtx();
		await createPost(ctx, {
			content: 'Now',
			targets: [{ account_id: ACCOUNT_ID }],
		});

		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			content: 'Now',
			targets: [{ account_id: ACCOUNT_ID }],
		});
		expect(lastHeaders['idempotency-key']).toBeUndefined();
	});

	it('sends the list cursor and limit', async () => {
		const { ctx } = makeCtx();
		await listPosts(ctx, { limit: 5, after: POST_ID });

		const url = new URL(lastUrl);
		expect(url.searchParams.get('limit')).toBe('5');
		expect(url.searchParams.get('after')).toBe(POST_ID);
	});

	it('returns the provider response unchanged', async () => {
		const { ctx } = makeCtx();
		const listed = await listPosts(ctx, {});
		expect(listed.data).toHaveLength(1);
		expect(listed.meta?.next_cursor).toBeNull();

		const cancelled = await cancelPost(ctx, { id: POST_ID });
		expect(cancelled.data.status).toBe('cancelled');
	});
});

describe('cache', () => {
	it('mirrors listed accounts under their id', async () => {
		const { ctx, db } = makeCtx();
		await listAccounts(ctx, {});

		expect(db.accounts.upsertByEntityId).toHaveBeenCalledWith(
			ACCOUNT_ID,
			expect.objectContaining({ id: ACCOUNT_ID, platform: 'linkedin' }),
		);
	});

	it('mirrors created, fetched and listed posts under their id', async () => {
		const { ctx, db } = makeCtx();
		await createPost(ctx, {
			content: 'Launching today',
			targets: [{ account_id: ACCOUNT_ID }],
		});
		await getPost(ctx, { id: POST_ID });
		await listPosts(ctx, {});

		expect(db.posts.upsertByEntityId).toHaveBeenCalledTimes(3);
		expect(db.posts.upsertByEntityId).toHaveBeenCalledWith(
			POST_ID,
			expect.objectContaining({ id: POST_ID, status: 'scheduled' }),
		);
	});

	it('keeps a cancelled post and records its new status', async () => {
		const { ctx, db } = makeCtx();
		await cancelPost(ctx, { id: POST_ID });

		expect(db.posts.deleteByEntityId).not.toHaveBeenCalled();
		expect(db.posts.upsertByEntityId).toHaveBeenCalledWith(
			POST_ID,
			expect.objectContaining({ status: 'cancelled' }),
		);
	});
});

describe('event log', () => {
	it('records the post id and field names, not the post text', async () => {
		const { ctx } = makeCtx();
		await createPost(ctx, {
			content: 'Secret launch copy',
			targets: [{ account_id: ACCOUNT_ID }],
			publish_at: '2026-12-01T15:00:00Z',
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(mockLogEvent.mock.calls.at(-1)?.[1]).toBe('postonce.posts.create');
		expect(payload).toEqual({
			publish_at: '2026-12-01T15:00:00Z',
			fields: ['content', 'targets', 'publish_at'],
			postId: POST_ID,
			targets: 1,
		});
		expect(JSON.stringify(payload)).not.toContain('Secret launch copy');
	});
});

function apiError(status: number, body: unknown, message = 'failed') {
	return new ApiError(
		{ method: 'GET', url: 'posts' },
		{
			url: 'https://postonce.to/api/public/v1/posts',
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		message,
	);
}

describe('error handlers', () => {
	it('reads the code from the error envelope', () => {
		expect(
			postonceErrorCode(
				apiError(404, {
					error: { code: 'post_not_found', message: 'Post not found.' },
				}),
			),
		).toBe('post_not_found');
		expect(postonceErrorCode(new Error('plain'))).toBeUndefined();
	});

	it('routes each status to its handler', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, {}))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(401, {}))).toBe(true);
		expect(
			errorHandlers.PERMISSION_ERROR.match(
				apiError(403, { error: { code: 'missing_scope', message: 'x' } }),
			),
		).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404, {}))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(400, {}))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(409, {}))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(502, {}))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(400, {}))).toBe(false);
	});

	it('does not stack a second 429 retry budget on the plugin layer', async () => {
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx on reads but never replays a write', async () => {
		const error = apiError(500, {});
		const read = await errorHandlers.SERVER_ERROR.handler(error, {
			operation: 'posts.get',
		} as Parameters<typeof errorHandlers.SERVER_ERROR.handler>[1]);
		const write = await errorHandlers.SERVER_ERROR.handler(error, {
			operation: 'posts.create',
		} as Parameters<typeof errorHandlers.SERVER_ERROR.handler>[1]);

		expect(read.maxRetries).toBe(2);
		expect(write.maxRetries).toBe(0);
	});
});
