import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeWebvizioRequest,
	WEBVIZIO_MCP_API_BASE,
	WEBVIZIO_WEBHOOK_API_BASE,
	WebvizioAPIError,
} from './client';
import { Projects, Webhooks } from './endpoints';
import { errorHandlers } from './error-handlers';
import { webvizio, webvizioEndpointSchemas } from './index';
import { WebvizioSchema } from './schema';
import {
	CommentWebhooks,
	matchWebvizioTenantWebhook,
	ProjectWebhooks,
	TaskWebhooks,
} from './webhooks';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
		asRecord: (v: unknown) =>
			typeof v === 'object' && v !== null && !Array.isArray(v)
				? (v as Record<string, unknown>)
				: undefined,
		firstString: (arr: unknown[]) =>
			arr.find((x) => typeof x === 'string' && x.length > 0) as
				| string
				| undefined,
		readBodyRecord: (req: any) =>
			typeof req?.body === 'object' && req?.body !== null
				? (req.body as Record<string, unknown>)
				: typeof req?.payload === 'object' && req?.payload !== null
					? (req.payload as Record<string, unknown>)
					: undefined,
	};
});

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

function createMockContext(apiKey = 'test-token') {
	const upsertByEntityId = jest.fn().mockResolvedValue({ id: 'db-entity-1' });
	return {
		key: apiKey,
		pluginId: 'webvizio',
		authType: 'api_key' as const,
		options: {},
		schema: WebvizioSchema,
		db: {
			projects: {
				upsertByEntityId,
			},
			webhooks: {
				upsertByEntityId,
			},
		},
	} as any;
}

const sampleProjectsFixture = [
	{
		uuid: 'ce7e2096-05ad-4b5f-95d6-6088ca551dd0',
		name: 'jiitsphere.com',
		description: null,
		url: null,
	},
	{
		id: '123',
		uuid: 'abcd-1234',
		name: 'Test Project',
		description: 'Sample description',
		url: 'https://test.com',
	},
];

const sampleWebhooksFixture = [
	{
		id: 101,
		url: 'https://example.com/webhook',
		event: 'project.created',
	},
	{
		id: 'hook-2',
		url: 'https://example.com/callback',
		event: 'task.created',
	},
];

describe('Webvizio plugin structure', () => {
	it('exposes exactly 2 operations and 8 webhooks with schemas', () => {
		const plugin = webvizio();
		const endpoints = plugin.endpoints as any;
		const webhooksObj = plugin.webhooks as any;

		expect(typeof endpoints.projects.list).toBe('function');
		expect(typeof endpoints.webhooks.list).toBe('function');

		expect(typeof webhooksObj.projects.projectCreated.handler).toBe('function');
		expect(typeof webhooksObj.projects.projectUpdated.handler).toBe('function');
		expect(typeof webhooksObj.projects.projectDeleted.handler).toBe('function');
		expect(typeof webhooksObj.tasks.taskCreated.handler).toBe('function');
		expect(typeof webhooksObj.tasks.taskUpdated.handler).toBe('function');
		expect(typeof webhooksObj.tasks.taskDeleted.handler).toBe('function');
		expect(typeof webhooksObj.comments.commentCreated.handler).toBe('function');
		expect(typeof webhooksObj.comments.commentDeleted.handler).toBe('function');

		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual([
			'projects.list',
			'webhooks.list',
		]);
		expect(Object.keys(webvizioEndpointSchemas).sort()).toEqual([
			'projects.list',
			'webhooks.list',
		]);
		expect(typeof plugin.pluginWebhookMatcher).toBe('function');
		expect(typeof plugin.pluginTenantWebhookMatcher).toBe('function');
	});

	it('supports api_key auth configuration and defaults correctly even when authType is undefined', () => {
		const plugin = webvizio({ authType: undefined as any });
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['one'] },
		});
	});
});

describe('Webvizio request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(sampleProjectsFixture);
	});

	it('sends Authorization Bearer header and calls default MCP base URL', async () => {
		await makeWebvizioRequest('/projects', 'test-api-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: WEBVIZIO_MCP_API_BASE,
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					Accept: 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/projects',
			}),
			expect.any(Object),
		);
	});

	it('sends custom baseUrl when provided', async () => {
		await makeWebvizioRequest('/webhook', 'test-api-key', {
			baseUrl: WEBVIZIO_WEBHOOK_API_BASE,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: WEBVIZIO_WEBHOOK_API_BASE,
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/webhook',
			}),
			expect.any(Object),
		);
	});
});

describe('Webvizio endpoint handlers', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('projects.list returns parsed project items with null tolerance and logs event', async () => {
		const ctx = createMockContext('mock-api-key');
		mockRequest.mockResolvedValue(sampleProjectsFixture);

		const res = await Projects.list(ctx, {});
		expect(res).toHaveLength(2);
		expect(res[0]?.name).toBe('jiitsphere.com');
		expect(res[0]?.description).toBeNull();
		expect(res[1]?.uuid).toBe('abcd-1234');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'webvizio.projects.list',
			{},
			'completed',
		);
	});

	it('webhooks.list returns parsed webhook items and logs event', async () => {
		const ctx = createMockContext('mock-api-key');
		mockRequest.mockResolvedValue(sampleWebhooksFixture);

		const res = await Webhooks.list(ctx, {});
		expect(res).toHaveLength(2);
		expect(res[0]?.id).toBe(101);
		expect(res[0]?.event).toBe('project.created');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'webvizio.webhooks.list',
			{},
			'completed',
		);
	});
});

describe('Webvizio inbound webhook handlers', () => {
	beforeEach(() => {
		mockLog.mockReset();
	});

	it('handles project.created webhook and upserts into db.projects', async () => {
		const ctx = createMockContext();
		const req = {
			headers: { 'x-webvizio-signature': 'test-token' },
			payload: {
				event: 'project.created',
				payload: { uuid: 'proj-uuid-1', name: 'Web Redesign' },
			},
		};

		expect(ProjectWebhooks.projectCreated.match(req as any)).toBe(true);
		const res = await ProjectWebhooks.projectCreated.handler(ctx, req as any);
		expect(res.success).toBe(true);
		expect(ctx.db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'proj-uuid-1',
			expect.objectContaining({ name: 'Web Redesign' }),
		);
	});

	it('handles project.updated webhook and upserts into db.projects', async () => {
		const ctx = createMockContext();
		const req = {
			headers: { 'x-webvizio-signature': 'test-token' },
			payload: {
				event: 'project.updated',
				payload: { uuid: 'proj-uuid-1', name: 'Updated Name' },
			},
		};

		expect(ProjectWebhooks.projectUpdated.match(req as any)).toBe(true);
		const res = await ProjectWebhooks.projectUpdated.handler(ctx, req as any);
		expect(res.success).toBe(true);
		expect(ctx.db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'proj-uuid-1',
			expect.objectContaining({ name: 'Updated Name' }),
		);
	});

	it('handles project.deleted webhook', async () => {
		const ctx = createMockContext();
		const req = {
			headers: { 'x-webvizio-signature': 'test-token' },
			payload: {
				event: 'project.deleted',
				payload: { uuid: 'proj-uuid-1' },
			},
		};

		expect(ProjectWebhooks.projectDeleted.match(req as any)).toBe(true);
		const res = await ProjectWebhooks.projectDeleted.handler(ctx, req as any);
		expect(res.success).toBe(true);
	});

	it('handles task and comment webhooks', async () => {
		const ctx = createMockContext();
		const taskReq = {
			headers: { 'x-webvizio-signature': 'test-token' },
			payload: {
				event: 'task.created',
				payload: { id: 10, title: 'Fix CSS' },
			},
		};
		expect(TaskWebhooks.taskCreated.match(taskReq as any)).toBe(true);
		const taskRes = await TaskWebhooks.taskCreated.handler(ctx, taskReq as any);
		expect(taskRes.success).toBe(true);

		const commentReq = {
			headers: { 'x-webvizio-signature': 'test-token' },
			payload: {
				event: 'comment.created',
				payload: { id: 99, text: 'Done' },
			},
		};
		expect(CommentWebhooks.commentCreated.match(commentReq as any)).toBe(true);
		const commentRes = await CommentWebhooks.commentCreated.handler(
			ctx,
			commentReq as any,
		);
		expect(commentRes.success).toBe(true);
	});
});

describe('Webvizio tenant matcher & webhook matcher', () => {
	it('matches tenant by project_uuid or project_id on project events', () => {
		const match1 = matchWebvizioTenantWebhook({
			headers: {},
			body: { event: 'project.created', payload: { project_uuid: 'uuid-123' } },
		} as any);
		expect(match1).toEqual({
			linkType: 'project_uuid',
			externalId: 'uuid-123',
		});

		const match2 = matchWebvizioTenantWebhook({
			headers: {},
			body: { event: 'project.created', payload: { id: '456' } },
		} as any);
		expect(match2).toEqual({ linkType: 'project_id', externalId: '456' });
	});

	it('does NOT mislabel task or comment id as project link when project_id is omitted', () => {
		const taskMatch = matchWebvizioTenantWebhook({
			headers: {},
			body: {
				event: 'task.created',
				payload: { id: 'task-789', title: 'Test' },
			},
		} as any);
		expect(taskMatch).toBeNull();

		const commentMatch = matchWebvizioTenantWebhook({
			headers: {},
			body: {
				event: 'comment.created',
				payload: { id: 'comment-999', text: 'Hello' },
			},
		} as any);
		expect(commentMatch).toBeNull();
	});

	it('properly extracts project_id on task events when project_id is provided', () => {
		const taskMatchWithProj = matchWebvizioTenantWebhook({
			headers: {},
			body: {
				event: 'task.created',
				payload: { id: 'task-789', project_id: 'proj-100', title: 'Test' },
			},
		} as any);
		expect(taskMatchWithProj).toEqual({
			linkType: 'project_id',
			externalId: 'proj-100',
		});
	});

	it('pluginWebhookMatcher recognizes Webvizio webhook headers and body events', () => {
		const plugin = webvizio();
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-webvizio-signature': 'sig' },
			} as any),
		).toBe(true);

		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: { event: 'project.created' },
			} as any),
		).toBe(true);

		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: { event: 'unknown.event' },
			} as any),
		).toBe(false);
	});
});

describe('Webvizio keyBuilder and auth', () => {
	it('uses explicit options.key when provided', async () => {
		const plugin = webvizio({ key: 'explicit-token' });
		const keyBuilder = plugin.keyBuilder as any;
		const key = await keyBuilder(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored-token' },
			},
			'endpoint',
		);
		expect(key).toBe('explicit-token');
	});

	it('resolves key from keys.get_api_key when options.key is absent', async () => {
		const plugin = webvizio({});
		const keyBuilder = plugin.keyBuilder as any;
		const key = await keyBuilder(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored-token' },
			},
			'endpoint',
		);
		expect(key).toBe('stored-token');
	});

	it('throws AuthMissingError when no key is available', async () => {
		const plugin = webvizio({});
		const keyBuilder = plugin.keyBuilder as any;
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				},
				'endpoint',
			),
		).rejects.toThrow('Missing api_key for webvizio');
	});
});

describe('Webvizio error handlers and WebvizioAPIError', () => {
	it('WebvizioAPIError preserves status and cause', () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/projects' },
			{
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'Rate limited' },
			} as any,
			'Too Many Requests',
		);

		const err = new WebvizioAPIError(apiError.message, apiError.status, {
			cause: apiError,
		});

		expect(err.status).toBe(429);
		expect(err.statusText).toBe('Too Many Requests');
	});

	it('errorHandlers RATE_LIMIT_ERROR matches 429 status', () => {
		const err = new WebvizioAPIError('Rate limit exceeded', 429, {
			cause: new ApiError(
				{ method: 'GET', url: '/projects' },
				{ status: 429, statusText: 'Too Many Requests' } as any,
				'Rate limit exceeded',
			),
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
	});

	it('errorHandlers AUTH_ERROR matches 401 status and wrong token', () => {
		const err401 = new WebvizioAPIError('Wrong token.', 401);
		expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);

		const errUnauthorized = new Error('Unauthorized request');
		expect(errorHandlers.AUTH_ERROR.match(errUnauthorized)).toBe(true);
	});

	it('errorHandlers DEFAULT matches all other errors with maxRetries 0', async () => {
		expect(errorHandlers.DEFAULT.match(new Error('Random error'))).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(
			new Error('Random error'),
		);
		expect(result.maxRetries).toBe(0);
	});
});
