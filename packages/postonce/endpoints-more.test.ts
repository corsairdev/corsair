/**
 * Covers the operations added on top of the first five: on-the-wire method,
 * path, query and body, output parsing and risk levels. fetch is mocked, so
 * this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as handlers from './endpoints/handlers';
import { errorHandlers, isNonIdempotent } from './error-handlers';
import { postonceEndpointMeta, postonceEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof handlers.listDrafts>[0];

// The handlers read ctx.key and ctx.db.posts; the rest of the plugin context
// is not used, so a partial object is cast to the full context type.
function makeCtx() {
	const posts = {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
	const ctx = {
		key: 'test-postonce-key',
		options: {},
		db: { accounts: undefined, posts },
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, posts };
}

const POST_ID = '2f1c7a4e-4d3b-4f5e-9a8b-1c2d3e4f5a6b';
const DRAFT_ID = '5a6b7c8d-1e2f-4a3b-9c8d-7e6f5a4b3c2d';
const POST = {
	id: POST_ID,
	content: 'Launching today',
	status: 'processing',
	created_at: '2026-11-17T09:00:00.000Z',
	targets: [],
};
const DRAFT = {
	id: DRAFT_ID,
	content: 'idea',
	status: 'inbox',
	created_at: '2026-11-17T09:00:00.000Z',
	updated_at: '2026-11-17T09:00:00.000Z',
};
const WORKFLOW = {
	id: 'wf_1',
	name: 'TikTok to Instagram',
	source_account_id: 'acc_src',
	target_account_ids: ['acc_dst'],
	is_active: false,
	settings: {},
};
const WEBHOOK = {
	id: '9d8c7b6a-5f4e-4d3c-8b2a-1f0e9d8c7b6a',
	url: 'https://example.com/hook',
	description: null,
	events: ['post.published', 'post.failed'],
	created_at: '2026-11-17T09:00:00.000Z',
};

let last: { url: URL; method: string; body?: unknown };
let reply: unknown;

beforeEach(() => {
	mockLogEvent.mockClear();
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		last = {
			url: new URL(String(url)),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
		};
		return new Response(JSON.stringify(reply), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as unknown as typeof global.fetch;
});

const BASE = '/api/public/v1/';

type Case = {
	name: string;
	call: (ctx: Ctx) => Promise<unknown>;
	reply: unknown;
	method: string;
	path: string;
	query?: Record<string, string>;
	body?: unknown;
};

const cases: Case[] = [
	{
		name: 'posts.update',
		call: (ctx) =>
			handlers.updatePost(ctx, {
				id: POST_ID,
				content: 'new text',
				publish_at: '2026-12-02T10:00:00Z',
			}),
		reply: { data: POST },
		method: 'PATCH',
		path: `posts/${POST_ID}`,
		body: { content: 'new text', publish_at: '2026-12-02T10:00:00Z' },
	},
	{
		name: 'posts.publish',
		call: (ctx) => handlers.publishPost(ctx, { id: POST_ID }),
		reply: { data: POST },
		method: 'POST',
		path: `posts/${POST_ID}/publish`,
	},
	{
		name: 'posts.retryTarget',
		call: (ctx) =>
			handlers.retryPostTarget(ctx, { id: POST_ID, targetId: 'tp 1' }),
		reply: { data: POST },
		method: 'POST',
		path: `posts/${POST_ID}/targets/tp%201/retry`,
	},
	{
		name: 'posts.getAnalytics',
		call: (ctx) => handlers.getPostAnalytics(ctx, { id: POST_ID }),
		reply: {
			data: {
				id: POST_ID,
				media_url: null,
				targets: [{ platform: 'tiktok', views: 120, likes: null }],
			},
		},
		method: 'GET',
		path: `posts/${POST_ID}/analytics`,
	},
	{
		name: 'analytics.get',
		call: (ctx) => handlers.getAnalytics(ctx, { days: 7, account_id: 'acc' }),
		reply: {
			data: {
				range: { days: 7 },
				accounts: [{ id: 'acc', median_views: null }],
				posts: [],
			},
		},
		method: 'GET',
		path: 'analytics',
		query: { days: '7', account_id: 'acc' },
	},
	{
		name: 'drafts.list',
		call: (ctx) => handlers.listDrafts(ctx, { limit: 10, status: 'ready' }),
		reply: {
			data: [DRAFT],
			meta: { has_more: false, next_after: null, next_after_id: null },
		},
		method: 'GET',
		path: 'drafts',
		query: { limit: '10', status: 'ready' },
	},
	{
		name: 'drafts.create',
		call: (ctx) =>
			handlers.createDraft(ctx, {
				content: 'idea',
				suggested_platforms: ['linkedin'],
			}),
		reply: { data: DRAFT },
		method: 'POST',
		path: 'drafts',
		body: { content: 'idea', suggested_platforms: ['linkedin'] },
	},
	{
		name: 'drafts.get',
		call: (ctx) => handlers.getDraft(ctx, { id: DRAFT_ID }),
		reply: { data: DRAFT },
		method: 'GET',
		path: `drafts/${DRAFT_ID}`,
	},
	{
		name: 'drafts.update',
		call: (ctx) =>
			handlers.updateDraft(ctx, {
				id: DRAFT_ID,
				expected_updated_at: DRAFT.updated_at,
				status: 'archived',
			}),
		reply: { data: { ...DRAFT, status: 'archived' } },
		method: 'PATCH',
		path: `drafts/${DRAFT_ID}`,
		body: { expected_updated_at: DRAFT.updated_at, status: 'archived' },
	},
	{
		name: 'media.createUpload',
		call: (ctx) =>
			handlers.createMediaUpload(ctx, {
				filename: 'launch.png',
				content_type: 'image/png',
			}),
		reply: {
			data: {
				media_id: 'bWVkaWE',
				content_type: 'image/png',
				path: 'public-api/u/launch.png',
				upload: { path: 'public-api/u/launch.png', signedUrl: 'https://x' },
			},
		},
		method: 'POST',
		path: 'media/uploads',
		body: { filename: 'launch.png', content_type: 'image/png' },
	},
	{
		name: 'media.get',
		call: (ctx) => handlers.getMedia(ctx, { id: 'bWVkaWE' }),
		reply: {
			data: { id: 'bWVkaWE', path: 'p', public_url: 'https://cdn/x.png' },
		},
		method: 'GET',
		path: 'media/bWVkaWE',
	},
	{
		name: 'workflows.list',
		call: (ctx) => handlers.listWorkflows(ctx, {}),
		reply: { data: [WORKFLOW] },
		method: 'GET',
		path: 'workflows',
	},
	{
		name: 'workflows.get',
		call: (ctx) => handlers.getWorkflow(ctx, { id: 'wf_1' }),
		reply: { data: WORKFLOW },
		method: 'GET',
		path: 'workflows/wf_1',
	},
	{
		name: 'workflows.create',
		call: (ctx) =>
			handlers.createWorkflow(ctx, {
				name: 'TikTok to Instagram',
				source_account_id: 'acc_src',
				target_account_ids: ['acc_dst'],
				is_active: false,
			}),
		reply: { data: WORKFLOW },
		method: 'POST',
		path: 'workflows',
		body: {
			name: 'TikTok to Instagram',
			source_account_id: 'acc_src',
			target_account_ids: ['acc_dst'],
			is_active: false,
		},
	},
	{
		name: 'workflows.update',
		call: (ctx) =>
			handlers.updateWorkflow(ctx, { id: 'wf_1', is_active: true }),
		reply: { data: { ...WORKFLOW, is_active: true } },
		method: 'PUT',
		path: 'workflows/wf_1',
		body: { is_active: true },
	},
	{
		name: 'workflows.delete',
		call: (ctx) => handlers.deleteWorkflow(ctx, { id: 'wf_1' }),
		reply: { data: { deleted: true, id: 'wf_1' } },
		method: 'DELETE',
		path: 'workflows/wf_1',
	},
	{
		name: 'webhooks.list',
		call: (ctx) => handlers.listWebhooks(ctx, {}),
		reply: { data: [WEBHOOK] },
		method: 'GET',
		path: 'webhooks',
	},
	{
		name: 'webhooks.get',
		call: (ctx) => handlers.getWebhook(ctx, { id: WEBHOOK.id }),
		reply: { data: WEBHOOK },
		method: 'GET',
		path: `webhooks/${WEBHOOK.id}`,
	},
	{
		name: 'webhooks.create',
		call: (ctx) =>
			handlers.createWebhook(ctx, { url: 'https://example.com/hook' }),
		reply: { data: { ...WEBHOOK, secret: 'whsec_test' } },
		method: 'POST',
		path: 'webhooks',
		body: { url: 'https://example.com/hook' },
	},
	{
		name: 'webhooks.delete',
		call: (ctx) => handlers.deleteWebhook(ctx, { id: WEBHOOK.id }),
		reply: { data: { deleted: true, id: WEBHOOK.id } },
		method: 'DELETE',
		path: `webhooks/${WEBHOOK.id}`,
	},
];

describe('PostOnce added operations', () => {
	it.each(cases)('$name sends $method $path', async (c) => {
		const { ctx } = makeCtx();
		reply = c.reply;
		const result = await c.call(ctx);
		expect(last.method).toBe(c.method);
		expect(last.url.pathname).toBe(BASE + c.path);
		expect(Object.fromEntries(last.url.searchParams)).toEqual(c.query ?? {});
		expect(last.body).toEqual(c.body);
		expect(result).toEqual(c.reply);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			`postonce.${c.name}`,
			expect.any(Object),
			'completed',
		);
	});

	it('covers every operation besides the first five', () => {
		const first = [
			'accounts.list',
			'posts.cancel',
			'posts.create',
			'posts.get',
			'posts.list',
		];
		expect(Object.keys(postonceEndpointMeta).sort()).toEqual(
			[...first, ...cases.map((c) => c.name)].sort(),
		);
		for (const c of cases) {
			expect(postonceEndpointSchemas).toHaveProperty([c.name]);
		}
	});

	it('does not retry writes that could post or create twice', () => {
		for (const op of [
			'posts.publish',
			'posts.retryTarget',
			'drafts.create',
			'media.createUpload',
			'workflows.create',
			'webhooks.create',
		]) {
			expect(isNonIdempotent(op)).toBe(true);
		}
		expect(isNonIdempotent('drafts.list')).toBe(false);
		expect(isNonIdempotent('analytics.get')).toBe(false);
	});

	it('rejects a reply that is not the documented envelope', async () => {
		const { ctx } = makeCtx();
		reply = { drafts: [] };
		await expect(handlers.listDrafts(ctx, {})).rejects.toThrow();
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('keeps the webhook secret out of the event log', async () => {
		const { ctx } = makeCtx();
		reply = { data: { ...WEBHOOK, secret: 'whsec_test' } };
		await handlers.createWebhook(ctx, { url: 'https://example.com/hook' });
		expect(JSON.stringify(mockLogEvent.mock.calls)).not.toContain('whsec_');
		expect(JSON.stringify(mockLogEvent.mock.calls)).not.toContain(
			'example.com/hook',
		);
	});

	it('refreshes the cached post after update, publish and retry', async () => {
		for (const call of [
			(ctx: Ctx) => handlers.updatePost(ctx, { id: POST_ID, content: 'x' }),
			(ctx: Ctx) => handlers.publishPost(ctx, { id: POST_ID }),
			(ctx: Ctx) =>
				handlers.retryPostTarget(ctx, { id: POST_ID, targetId: 't' }),
		]) {
			const { ctx, posts } = makeCtx();
			reply = { data: POST };
			await call(ctx);
			expect(posts.upsertByEntityId).toHaveBeenCalledWith(
				POST_ID,
				expect.objectContaining({ id: POST_ID }),
			);
		}
	});

	it('marks publishing, retries, automatic cross-posting and deletes destructive', () => {
		const destructive = Object.entries(postonceEndpointMeta)
			.filter(([, meta]) => meta.riskLevel === 'destructive')
			.map(([name]) => name)
			.sort();
		expect(destructive).toEqual([
			'posts.cancel',
			'posts.create',
			'posts.publish',
			'posts.retryTarget',
			'webhooks.delete',
			'workflows.create',
			'workflows.delete',
			'workflows.update',
		]);
	});
});

describe('PostOnce input, output and logging checks', () => {
	it('rejects bad input before sending a request', async () => {
		const { ctx } = makeCtx();
		reply = { data: [] };
		// No request may go out, so the last request stays unset.
		last = undefined as never;
		await expect(handlers.listPosts(ctx, { limit: 101 })).rejects.toThrow();
		await expect(
			handlers.updateDraft(ctx, { id: DRAFT_ID } as never),
		).rejects.toThrow();
		expect(last).toBeUndefined();
	});

	it('rejects a post reply without an id instead of returning it', async () => {
		const { ctx, posts } = makeCtx();
		reply = { data: { id: 42 } };
		await expect(handlers.getPost(ctx, { id: POST_ID })).rejects.toThrow();
		expect(posts.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('logs only the status and code for an unhandled error', async () => {
		const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
		const error = new ApiError(
			{ method: 'GET', url: 'posts' },
			{
				url: 'https://postonce.to/api/public/v1/posts',
				ok: false,
				status: 418,
				statusText: 'Teapot',
				body: { error: { code: 'odd', message: 'owner jane@example.com' } },
			},
			'owner jane@example.com',
		);
		await errorHandlers.DEFAULT.handler(error, {
			pluginId: 'postonce',
			operation: 'posts.list',
			input: {},
			originalError: error,
		} as never);
		expect(JSON.stringify(spy.mock.calls)).not.toContain('jane@example.com');
		expect(JSON.stringify(spy.mock.calls)).toContain('418');
		spy.mockRestore();
	});
});
