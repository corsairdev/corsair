/**
 * Exercises every endpoint wrapper: method and path, request bodies and
 * query, cache writes, input validation and the event log. Network access is
 * mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	completeMedia,
	createMediaUpload,
	createPost,
	createWebhook,
	deleteMedia,
	deletePost,
	deleteWebhook,
	getContext,
	getPost,
	listAccounts,
	listPosts,
	listWebhooks,
	updatePost,
	updateWebhook,
} from './endpoints/handlers';
import { publoraEndpointMeta, publoraEndpointSchemas } from './index';

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
	const db = { accounts: makeStore(), posts: makeStore() };
	const ctx = {
		key: 'sk_test.publora',
		options: {},
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

const GROUP_ID = '507f1f77bcf86cd799439011';
const MEDIA_ID = '507f1f77bcf86cd799439013';
const WEBHOOK_ID = '507f1f77bcf86cd799439099';
const CONNECTION = 'linkedin-ABC123';

const ACCOUNT = {
	platformId: CONNECTION,
	username: 'jane',
	displayName: 'Jane Doe',
	profileImageUrl: null,
	profileUrl: 'https://www.linkedin.com/in/jane',
	accessTokenExpiresAt: '2027-01-15T10:30:00.000Z',
	tokenStatus: 'valid',
	connectionStatus: 'active',
	tokenExpiresIn: '51 days',
	lastSuccessfulPost: null,
	lastError: null,
	subscriptionType: null,
};

const GROUP = {
	success: true,
	postGroupId: GROUP_ID,
	status: 'scheduled',
	scheduledTime: '2026-12-01T15:00:00.000Z',
	platformSettings: {},
	firstComment: null,
	firstComments: [],
	platforms: [CONNECTION],
	posts: [
		{
			platform: 'linkedin',
			platformId: 'ABC123',
			content: 'Launching today',
			status: 'scheduled',
			postedId: null,
			permalink: null,
			isThread: false,
			threadParts: [],
			firstCommentResult: null,
			firstCommentResults: [],
		},
	],
	media: [],
};

const LIST_ITEM = {
	postGroupId: GROUP_ID,
	content: 'Launching today',
	status: 'scheduled',
	scheduledTime: '2026-12-01T15:00:00.000Z',
	createdAt: '2026-11-25T09:00:00.000Z',
	updatedAt: '2026-11-25T09:00:00.000Z',
	platforms: [
		{ platformId: 'ABC123', platform: 'linkedin', status: 'scheduled' },
	],
	mediaUrls: [],
};

const WEBHOOK = {
	_id: WEBHOOK_ID,
	name: 'Production',
	url: 'https://example.com/publora-events',
	events: ['post.published', 'post.failed'],
	isActive: true,
	createdAt: '2026-11-25T09:00:00.000Z',
	updatedAt: '2026-11-25T09:00:00.000Z',
};

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;
let lastHeaders: Record<string, string> = {};

function replyFor(path: string, method: string): unknown {
	if (path.endsWith('/platform-connections'))
		return { success: true, connections: [ACCOUNT] };
	if (path.endsWith('/account-context'))
		return {
			success: true,
			context: {
				plane: 'personal',
				plan: { key: 'starter', name: 'Starter' },
				features: { publishing: true, apiAccess: true },
				quotas: {
					monthlyPosts: { limit: 15, used: 3, remaining: 12 },
					scheduledPosts: { limit: 3, used: 1, remaining: 2 },
					scheduleHorizon: {
						limit: 7,
						maxScheduledDate: '2026-12-02T09:00:00.000Z',
					},
				},
				allowedPlatforms: null,
				advisory: true,
			},
		};
	if (path.endsWith('/create-post'))
		return {
			success: true,
			postGroupId: GROUP_ID,
			scheduledTime: '2026-12-01T15:00:00.000Z',
		};
	if (path.includes('/get-post/')) return GROUP;
	if (path.endsWith('/list-posts'))
		return {
			success: true,
			posts: [LIST_ITEM],
			pagination: {
				page: 1,
				limit: 20,
				totalItems: 1,
				totalPages: 1,
				hasNextPage: false,
				hasPrevPage: false,
			},
		};
	if (path.includes('/update-post/'))
		return {
			success: true,
			message: 'Post updated successfully',
			scheduledTime: '2026-12-02T15:00:00.000Z',
			postGroup: {
				_id: GROUP_ID,
				status: 'scheduled',
				content: 'Launching tomorrow',
				platforms: [CONNECTION],
			},
		};
	if (path.endsWith('/get-upload-url'))
		return {
			success: true,
			uploadUrl: 'https://s3.example.com/upload?sig=x',
			fileUrl: 'https://cdn.example.com/launch.png',
			mediaId: MEDIA_ID,
		};
	if (path.includes('/complete-media/'))
		return {
			success: true,
			mediaFile: {
				_id: MEDIA_ID,
				type: 'image',
				mimeType: 'image/png',
				status: 'ready',
			},
		};
	if (path.endsWith('/webhooks') && method === 'POST')
		return {
			success: true,
			webhook: { ...WEBHOOK, secret: 'whsec_shown_once' },
		};
	if (path.endsWith('/webhooks')) return { success: true, webhooks: [WEBHOOK] };
	if (path.includes('/webhooks/') && method === 'PATCH')
		return { success: true, webhook: { ...WEBHOOK, isActive: false } };
	return { success: true };
}

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
		const payload = replyFor(new URL(String(url)).pathname, lastMethod);
		return {
			ok: true,
			status: 200,
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
		'/api/v1/platform-connections',
	],
	[
		'accounts.getContext',
		(c) => getContext(c, {}),
		'GET',
		'/api/v1/account-context',
	],
	[
		'posts.create',
		(c) =>
			createPost(c, { content: 'Launching today', platforms: [CONNECTION] }),
		'POST',
		'/api/v1/create-post',
	],
	[
		'posts.get',
		(c) => getPost(c, { postGroupId: GROUP_ID }),
		'GET',
		`/api/v1/get-post/${GROUP_ID}`,
	],
	['posts.list', (c) => listPosts(c, {}), 'GET', '/api/v1/list-posts'],
	[
		'posts.update',
		(c) =>
			updatePost(c, { postGroupId: GROUP_ID, content: 'Launching tomorrow' }),
		'PUT',
		`/api/v1/update-post/${GROUP_ID}`,
	],
	[
		'posts.delete',
		(c) => deletePost(c, { postGroupId: GROUP_ID }),
		'DELETE',
		`/api/v1/delete-post/${GROUP_ID}`,
	],
	[
		'media.createUpload',
		(c) =>
			createMediaUpload(c, {
				postGroupId: GROUP_ID,
				fileName: 'launch.png',
				contentType: 'image/png',
			}),
		'POST',
		'/api/v1/get-upload-url',
	],
	[
		'media.complete',
		(c) => completeMedia(c, { mediaId: MEDIA_ID }),
		'POST',
		`/api/v1/complete-media/${MEDIA_ID}`,
	],
	[
		'media.delete',
		(c) => deleteMedia(c, { mediaId: MEDIA_ID }),
		'DELETE',
		`/api/v1/media/${MEDIA_ID}`,
	],
	['webhooks.list', (c) => listWebhooks(c, {}), 'GET', '/api/v1/webhooks'],
	[
		'webhooks.create',
		(c) =>
			createWebhook(c, {
				name: 'Production',
				url: 'https://example.com/publora-events',
				events: ['post.published'],
			}),
		'POST',
		'/api/v1/webhooks',
	],
	[
		'webhooks.update',
		(c) => updateWebhook(c, { id: WEBHOOK_ID, isActive: false }),
		'PATCH',
		`/api/v1/webhooks/${WEBHOOK_ID}`,
	],
	[
		'webhooks.delete',
		(c) => deleteWebhook(c, { id: WEBHOOK_ID }),
		'DELETE',
		`/api/v1/webhooks/${WEBHOOK_ID}`,
	],
];

describe('routing', () => {
	// The operations added later are covered in endpoints-extra.test.ts,
	// which also checks that every declared operation is covered somewhere.
	it('covers every operation of the first version', () => {
		expect(Object.keys(publoraEndpointSchemas)).toEqual(
			expect.arrayContaining(OPERATIONS.map(([path]) => path)),
		);
		expect(OPERATIONS).toHaveLength(14);
	});

	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath} and logs the event`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
			expect(lastHeaders['x-publora-key']).toBe('sk_test.publora');
			expect(mockLogEvent).toHaveBeenCalledWith(
				ctx,
				`publora.${path}`,
				expect.any(Object),
				'completed',
			);
		});
	}
});

describe('accounts', () => {
	it('caches each connection by platformId', async () => {
		const { ctx, db } = makeCtx();
		const result = await listAccounts(ctx, {});

		expect(result.connections).toHaveLength(1);
		expect(db.accounts.upsertByEntityId).toHaveBeenCalledWith(
			CONNECTION,
			expect.objectContaining({
				platformId: CONNECTION,
				connectionStatus: 'active',
			}),
		);
	});

	it('passes scheduledTime to account-context and returns the quotas', async () => {
		const { ctx } = makeCtx();
		const result = await getContext(ctx, {
			scheduledTime: '2026-12-01T15:00:00Z',
		});

		expect(new URL(lastUrl).searchParams.get('scheduledTime')).toBe(
			'2026-12-01T15:00:00Z',
		);
		expect(result.context.quotas?.monthlyPosts?.remaining).toBe(12);
		expect(result.context.quotas?.scheduleHorizon?.maxScheduledDate).toBe(
			'2026-12-02T09:00:00.000Z',
		);
	});
});

describe('posts', () => {
	it('create sends only the fields given, plus the Idempotency-Key', async () => {
		const { ctx } = makeCtx();
		const result = await createPost(ctx, {
			content: 'Launching today',
			platforms: [CONNECTION],
			scheduledTime: '2026-12-01T15:00:00Z',
			mediaUrls: ['https://example.com/launch.png'],
			platformSettings: { linkedin: { repostEnabled: false } },
			firstComments: [
				{ text: 'Details: https://example.com', platforms: ['linkedin'] },
			],
			idempotencyKey: 'launch-2026-12-01',
		});

		expect(result.postGroupId).toBe(GROUP_ID);
		expect(lastHeaders['idempotency-key']).toBe('launch-2026-12-01');
		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			content: 'Launching today',
			platforms: [CONNECTION],
			scheduledTime: '2026-12-01T15:00:00Z',
			mediaUrls: ['https://example.com/launch.png'],
			platformSettings: { linkedin: { repostEnabled: false } },
			firstComments: [
				{ text: 'Details: https://example.com', platforms: ['linkedin'] },
			],
		});
	});

	it('create keeps post text out of the event log', async () => {
		const { ctx } = makeCtx();
		await createPost(ctx, {
			content: 'Secret launch',
			platforms: [CONNECTION],
			publishNow: true,
		});

		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(JSON.stringify(payload)).not.toContain('Secret launch');
		expect(JSON.stringify(payload)).not.toContain(CONNECTION);
		expect(payload).toEqual(
			expect.objectContaining({
				publishNow: true,
				postGroupId: GROUP_ID,
				platforms: 1,
			}),
		);
	});

	it('create rejects a post with no targets before calling Publora', async () => {
		const { ctx } = makeCtx();
		await expect(
			createPost(ctx, { content: 'hi', platforms: [] }),
		).rejects.toThrow();
		expect(lastUrl).toBe('');
	});

	it('get caches the post group by postGroupId', async () => {
		const { ctx, db } = makeCtx();
		const result = await getPost(ctx, { postGroupId: GROUP_ID });

		expect(result.status).toBe('scheduled');
		expect(result.posts?.[0]?.platform).toBe('linkedin');
		expect(db.posts.upsertByEntityId).toHaveBeenCalledWith(
			GROUP_ID,
			expect.objectContaining({ postGroupId: GROUP_ID }),
		);
	});

	it('list sends filters and caches every post', async () => {
		const { ctx, db } = makeCtx();
		const result = await listPosts(ctx, {
			page: 2,
			limit: 50,
			status: 'scheduled',
			platform: 'linkedin',
		});

		const params = new URL(lastUrl).searchParams;
		expect(params.get('page')).toBe('2');
		expect(params.get('limit')).toBe('50');
		expect(params.get('status')).toBe('scheduled');
		expect(params.get('platform')).toBe('linkedin');
		expect(result.pagination?.hasNextPage).toBe(false);
		expect(db.posts.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('list rejects a limit over 100', async () => {
		const { ctx } = makeCtx();
		await expect(listPosts(ctx, { limit: 500 })).rejects.toThrow();
	});

	it('update sends the patch without the id or the idempotency key', async () => {
		const { ctx } = makeCtx();
		const result = await updatePost(ctx, {
			postGroupId: GROUP_ID,
			scheduledTime: '2026-12-02T15:00:00Z',
			idempotencyKey: 'move-1',
		});

		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			scheduledTime: '2026-12-02T15:00:00Z',
		});
		expect(lastHeaders['idempotency-key']).toBe('move-1');
		expect(result.postGroup?.status).toBe('scheduled');
	});

	it('delete evicts the cached post group', async () => {
		const { ctx, db } = makeCtx();
		const result = await deletePost(ctx, { postGroupId: GROUP_ID });

		expect(result.success).toBe(true);
		expect(db.posts.deleteByEntityId).toHaveBeenCalledWith(GROUP_ID);
	});

	it('encodes the post group id in the path', async () => {
		const { ctx } = makeCtx();
		await getPost(ctx, { postGroupId: '../webhooks' });

		expect(new URL(lastUrl).pathname).toBe('/api/v1/get-post/..%2Fwebhooks');
	});
});

describe('media', () => {
	it('createUpload returns the signed URL and mediaId', async () => {
		const { ctx } = makeCtx();
		const result = await createMediaUpload(ctx, {
			postGroupId: GROUP_ID,
			fileName: 'launch.png',
			contentType: 'image/png',
			type: 'image',
		});

		expect(result.mediaId).toBe(MEDIA_ID);
		expect(result.uploadUrl).toContain('https://');
		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			postGroupId: GROUP_ID,
			fileName: 'launch.png',
			contentType: 'image/png',
			type: 'image',
		});
	});

	it('complete returns the media file record', async () => {
		const { ctx } = makeCtx();
		const result = await completeMedia(ctx, { mediaId: MEDIA_ID });

		expect(result.mediaFile._id).toBe(MEDIA_ID);
		expect(result.mediaFile.status).toBe('ready');
	});
});

describe('webhooks', () => {
	it('create returns the signing secret and keeps the URL out of the log', async () => {
		const { ctx } = makeCtx();
		const result = await createWebhook(ctx, {
			name: 'Production',
			url: 'https://example.com/publora-events',
			events: ['post.published', 'post.failed'],
		});

		expect(result.webhook.secret).toBe('whsec_shown_once');
		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(JSON.stringify(payload)).not.toContain('example.com');
		expect(JSON.stringify(payload)).not.toContain('whsec_shown_once');
	});

	it('create rejects an unknown event', async () => {
		const { ctx } = makeCtx();
		await expect(
			createWebhook(ctx, {
				name: 'x',
				url: 'https://example.com/x',
				events: ['post.deleted' as 'post.published'],
			}),
		).rejects.toThrow();
	});

	it('update sends only the changed fields', async () => {
		const { ctx } = makeCtx();
		const result = await updateWebhook(ctx, {
			id: WEBHOOK_ID,
			isActive: false,
		});

		expect(JSON.parse(lastBody ?? '{}')).toEqual({ isActive: false });
		expect(result.webhook.isActive).toBe(false);
	});

	it('list returns the subscriptions', async () => {
		const { ctx } = makeCtx();
		const result = await listWebhooks(ctx, {});

		expect(result.webhooks).toHaveLength(1);
		expect(result.webhooks[0]?._id).toBe(WEBHOOK_ID);
	});
});

describe('endpoint meta', () => {
	it('marks every operation that can publish or delete as destructive', () => {
		expect(publoraEndpointMeta['posts.create'].riskLevel).toBe('destructive');
		expect(publoraEndpointMeta['posts.update'].riskLevel).toBe('destructive');
		expect(publoraEndpointMeta['posts.delete'].riskLevel).toBe('destructive');
		expect(publoraEndpointMeta['media.delete'].riskLevel).toBe('destructive');
		expect(publoraEndpointMeta['webhooks.delete'].riskLevel).toBe(
			'destructive',
		);
		expect(publoraEndpointMeta['accounts.list'].riskLevel).toBe('read');
	});
});
