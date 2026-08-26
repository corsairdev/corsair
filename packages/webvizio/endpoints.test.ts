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
import { webvizio, webvizioAuthConfig, webvizioEndpointSchemas } from './index';
import { WebvizioSchema } from './schema';

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
	it('exposes exactly 2 operations and 0 webhooks per specification', () => {
		const plugin = webvizio();
		const endpoints = plugin.endpoints as any;

		expect(typeof endpoints.projects.list).toBe('function');
		expect(typeof endpoints.webhooks.list).toBe('function');
		expect(plugin.webhooks).toEqual({});

		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual([
			'projects.list',
			'webhooks.list',
		]);
		expect(Object.keys(webvizioEndpointSchemas).sort()).toEqual([
			'projects.list',
			'webhooks.list',
		]);
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api_key auth configuration', () => {
		const plugin = webvizio({ authType: undefined as any });
		expect(plugin.options?.authType).toBe('api_key');
		expect(webvizioAuthConfig).toEqual({
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
