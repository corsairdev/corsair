import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	DYNAPICTURES_API_BASE,
	DynapicturesAPIError,
	makeDynapicturesRequest,
} from './client';
import { Media, Templates, Webhooks, Workspaces } from './endpoints';
import {
	DYNAPICTURES_CREATE_WORKSPACE,
	DYNAPICTURES_DELETE_WORKSPACE,
	DYNAPICTURES_LIST_TEMPLATES,
	DYNAPICTURES_LIST_WORKSPACES,
	DYNAPICTURES_TOOLS,
	DYNAPICTURES_UNSUBSCRIBE_WEBHOOK,
	DYNAPICTURES_UPDATE_WORKSPACE,
	DYNAPICTURES_UPLOAD_MEDIA_ASSET,
	dynapictures,
	dynapicturesAuth,
} from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
	AuthMissingError: class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing auth for ${plugin} (${authType})`);
			this.name = 'AuthMissingError';
		}
	},
}));

jest.mock('corsair/http', () => {
	class MockApiError extends Error {
		status: number;
		statusText: string;
		body: unknown;
		retryAfter: number | undefined;

		constructor(
			status: number,
			message: string,
			statusText = '',
			body: unknown = undefined,
			retryAfter: number | undefined = undefined,
		) {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.statusText = statusText;
			this.body = body;
			this.retryAfter = retryAfter;
		}
	}

	return {
		ApiError: MockApiError,
		request: jest.fn(),
	};
});

const requestMock = request as any;
const mockLog = logEventFromContext as any;

function createMockContext(apiKey = 'test-dynapictures-key') {
	return {
		key: apiKey,
		authType: 'api_key' as const,
		options: { authType: 'api_key' as const, key: apiKey },
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
		},
	} as any;
}

beforeEach(() => {
	requestMock.mockReset();
	mockLog.mockReset();
});

describe('DynaPictures Plugin Definition', () => {
	it('defines plugin object with correct metadata and auth configuration', () => {
		const plugin = dynapictures({ key: 'test-key' });
		expect(plugin.id).toBe('dynapictures');
		expect(plugin.name).toBe('DynaPictures');
		expect(plugin.auth).toEqual({
			type: 'apiKey',
			header: 'Authorization',
			prefix: 'Bearer ',
		});
		expect(dynapicturesAuth).toEqual({
			type: 'apiKey',
			header: 'Authorization',
			prefix: 'Bearer ',
		});
	});

	it('exports 7 tool operations with strict Zod parameter schemas', () => {
		expect(DYNAPICTURES_CREATE_WORKSPACE.id).toBe(
			'DYNAPICTURES_CREATE_WORKSPACE',
		);
		expect(DYNAPICTURES_CREATE_WORKSPACE.method).toBe('POST');
		expect(DYNAPICTURES_CREATE_WORKSPACE.path).toBe('/workspaces');
		expect(
			DYNAPICTURES_CREATE_WORKSPACE.parameters.safeParse({
				name: 'My Workspace',
			}).success,
		).toBe(true);
		expect(DYNAPICTURES_CREATE_WORKSPACE.parameters.safeParse({}).success).toBe(
			false,
		);

		expect(DYNAPICTURES_DELETE_WORKSPACE.id).toBe(
			'DYNAPICTURES_DELETE_WORKSPACE',
		);
		expect(DYNAPICTURES_DELETE_WORKSPACE.method).toBe('DELETE');
		expect(DYNAPICTURES_DELETE_WORKSPACE.path).toBe('/workspaces/:workspaceId');
		expect(
			DYNAPICTURES_DELETE_WORKSPACE.parameters.safeParse({
				workspaceId: 'ws_123',
			}).success,
		).toBe(true);
		expect(DYNAPICTURES_DELETE_WORKSPACE.parameters.safeParse({}).success).toBe(
			false,
		);

		expect(DYNAPICTURES_LIST_TEMPLATES.id).toBe('DYNAPICTURES_LIST_TEMPLATES');
		expect(DYNAPICTURES_LIST_TEMPLATES.method).toBe('GET');
		expect(DYNAPICTURES_LIST_TEMPLATES.path).toBe('/templates');
		expect(
			DYNAPICTURES_LIST_TEMPLATES.parameters.safeParse({
				workspaceId: 'ws_123',
			}).success,
		).toBe(true);
		expect(DYNAPICTURES_LIST_TEMPLATES.parameters.safeParse({}).success).toBe(
			true,
		);

		expect(DYNAPICTURES_LIST_WORKSPACES.id).toBe(
			'DYNAPICTURES_LIST_WORKSPACES',
		);
		expect(DYNAPICTURES_LIST_WORKSPACES.method).toBe('GET');
		expect(DYNAPICTURES_LIST_WORKSPACES.path).toBe('/workspaces');
		expect(DYNAPICTURES_LIST_WORKSPACES.parameters.safeParse({}).success).toBe(
			true,
		);

		expect(DYNAPICTURES_UNSUBSCRIBE_WEBHOOK.id).toBe(
			'DYNAPICTURES_UNSUBSCRIBE_WEBHOOK',
		);
		expect(DYNAPICTURES_UNSUBSCRIBE_WEBHOOK.method).toBe('DELETE');
		expect(DYNAPICTURES_UNSUBSCRIBE_WEBHOOK.path).toBe('/hooks');
		expect(
			DYNAPICTURES_UNSUBSCRIBE_WEBHOOK.parameters.safeParse({
				targetUrl: 'https://example.com/webhook',
				eventType: 'image.generated',
				templateId: 'tpl_123',
			}).success,
		).toBe(true);
		expect(
			DYNAPICTURES_UNSUBSCRIBE_WEBHOOK.parameters.safeParse({
				targetUrl: 'invalid-url',
				eventType: 'image.generated',
				templateId: 'tpl_123',
			}).success,
		).toBe(false);

		expect(DYNAPICTURES_UPDATE_WORKSPACE.id).toBe(
			'DYNAPICTURES_UPDATE_WORKSPACE',
		);
		expect(DYNAPICTURES_UPDATE_WORKSPACE.method).toBe('PUT');
		expect(DYNAPICTURES_UPDATE_WORKSPACE.path).toBe('/workspaces/:workspaceId');
		expect(
			DYNAPICTURES_UPDATE_WORKSPACE.parameters.safeParse({
				workspaceId: 'ws_123',
				name: 'Renamed Workspace',
			}).success,
		).toBe(true);
		expect(
			DYNAPICTURES_UPDATE_WORKSPACE.parameters.safeParse({
				workspaceId: 'ws_123',
			}).success,
		).toBe(false);

		expect(DYNAPICTURES_UPLOAD_MEDIA_ASSET.id).toBe(
			'DYNAPICTURES_UPLOAD_MEDIA_ASSET',
		);
		expect(DYNAPICTURES_UPLOAD_MEDIA_ASSET.method).toBe('POST');
		expect(DYNAPICTURES_UPLOAD_MEDIA_ASSET.path).toBe('/media');
		expect(
			DYNAPICTURES_UPLOAD_MEDIA_ASSET.parameters.safeParse({
				imageUrl: 'https://example.com/photo.jpg',
				name: 'My Photo',
			}).success,
		).toBe(true);
		expect(
			DYNAPICTURES_UPLOAD_MEDIA_ASSET.parameters.safeParse({
				imageUrl: 'not-a-url',
			}).success,
		).toBe(false);

		expect(Object.keys(DYNAPICTURES_TOOLS)).toHaveLength(7);
	});
});

describe('DynaPictures Client', () => {
	it('uses correct baseUrl and bearer token auth', async () => {
		requestMock.mockResolvedValueOnce({ id: 'ws_1', name: 'Workspace 1' });

		const result = await makeDynapicturesRequest(
			'/workspaces',
			'my-secret-token',
			{
				method: 'GET',
			},
		);

		expect(result).toEqual({ id: 'ws_1', name: 'Workspace 1' });
		expect(requestMock).toHaveBeenCalledTimes(1);

		const [config, options] = requestMock.mock.calls[0] as [
			{ BASE: string; TOKEN: string; HEADERS: Record<string, string> },
			{ method: string; url: string },
		];

		expect(config.BASE).toBe('https://api.dynapictures.com');
		expect(DYNAPICTURES_API_BASE).toBe('https://api.dynapictures.com');
		expect(config.TOKEN).toBe('my-secret-token');
		expect(config.HEADERS['Authorization']).toBe('Bearer my-secret-token');
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/workspaces');
	});

	it('wraps ApiError into DynapicturesAPIError preserving status and retry metadata', async () => {
		const MockApiError = ApiError as any;
		requestMock.mockRejectedValueOnce(
			new MockApiError(429, 'Too Many Requests', 'Too Many Requests', {
				error: 'rate_limited',
			}, 15_000),
		);

		await expect(
			makeDynapicturesRequest('/workspaces', 'key', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'DynapicturesAPIError',
			status: 429,
			retryAfter: 15_000,
			statusText: 'Too Many Requests',
		});
	});

	it('keeps auth failures distinct from rate-limits after wrapping', async () => {
		const MockApiError = ApiError as any;
		requestMock.mockRejectedValueOnce(
			new MockApiError(401, 'Unauthorized', 'Unauthorized'),
		);

		await expect(
			makeDynapicturesRequest('/workspaces', 'key', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'DynapicturesAPIError',
			status: 401,
			retryAfter: undefined,
		});
	});
});

describe('DynaPictures error handlers', () => {
	it('recognizes wrapped 429 errors and forwards retry metadata', async () => {
		const MockApiError = ApiError as any;
		const cause = new MockApiError(
			429,
			'Too Many Requests',
			'Too Many Requests',
			undefined,
			12_500,
		);
		const wrapped = new DynapicturesAPIError(cause.message, cause.status, {
			cause,
		});

		const { errorHandlers } = await import('./error-handlers');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(wrapped)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 12_500,
		});
	});

	it('keeps authentication errors separate from rate-limit errors', async () => {
		const MockApiError = ApiError as any;
		const cause = new MockApiError(401, 'Unauthorized', 'Unauthorized');
		const wrapped = new DynapicturesAPIError(cause.message, cause.status, {
			cause,
		});

		const { errorHandlers } = await import('./error-handlers');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(true);
	});
});

describe('DynaPictures tenant routing', () => {
	it('does not register unsupported OAuth tenant resolution callbacks', () => {
		const plugin = dynapictures({ key: 'test-key' });
		expect(plugin.oauthWebhookTenantLinkResolver).toBeUndefined();
		expect(plugin.pluginTenantWebhookMatcher).toBeUndefined();
	});
});

describe('DynaPictures Endpoints', () => {
	const ctx = createMockContext('secret_api_key_123');

	it('workspaces.create: sends POST /workspaces with name', async () => {
		requestMock.mockResolvedValueOnce({ id: 'ws_1', name: 'Team Workspace' });

		const result = await Workspaces.create(ctx, { name: 'Team Workspace' });

		expect(result).toEqual({ id: 'ws_1', name: 'Team Workspace' });
		const [, options] = requestMock.mock.calls[0] as any;
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/workspaces');
		expect(options.body).toEqual({ name: 'Team Workspace' });
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'dynapictures.workspaces.create',
			{ name: 'Team Workspace' },
			'completed',
		);
	});

	it('workspaces.delete: sends DELETE /workspaces/:workspaceId', async () => {
		requestMock.mockResolvedValueOnce({ success: true });

		const result = await Workspaces.deleteWorkspace(ctx, {
			workspaceId: 'ws_123',
		});

		expect(result).toEqual({ success: true });
		const [, options] = requestMock.mock.calls[0] as any;
		expect(options.method).toBe('DELETE');
		expect(options.url).toBe('/workspaces/ws_123');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'dynapictures.workspaces.delete',
			{ workspaceId: 'ws_123' },
			'completed',
		);
	});

	it('workspaces.list: sends GET /workspaces', async () => {
		requestMock.mockResolvedValueOnce([{ id: 'ws_1' }, { id: 'ws_2' }]);

		const result = await Workspaces.list(ctx, {});

		expect(result).toEqual([{ id: 'ws_1' }, { id: 'ws_2' }]);
		const [, options] = requestMock.mock.calls[0] as any;
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/workspaces');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'dynapictures.workspaces.list',
			{},
			'completed',
		);
	});

	it('workspaces.update: sends PUT /workspaces/:workspaceId with name', async () => {
		requestMock.mockResolvedValueOnce({ id: 'ws_123', name: 'Updated Name' });

		const result = await Workspaces.update(ctx, {
			workspaceId: 'ws_123',
			name: 'Updated Name',
		});

		expect(result).toEqual({ id: 'ws_123', name: 'Updated Name' });
		const [, options] = requestMock.mock.calls[0] as any;
		expect(options.method).toBe('PUT');
		expect(options.url).toBe('/workspaces/ws_123');
		expect(options.body).toEqual({ name: 'Updated Name' });
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'dynapictures.workspaces.update',
			{ workspaceId: 'ws_123', name: 'Updated Name' },
			'completed',
		);
	});

	it('templates.list: sends GET /templates with optional workspaceId query', async () => {
		requestMock.mockResolvedValueOnce([{ id: 'tpl_1', name: 'Banner' }]);

		const result = await Templates.list(ctx, { workspaceId: 'ws_abc' });

		expect(result).toEqual([{ id: 'tpl_1', name: 'Banner' }]);
		const [, options] = requestMock.mock.calls[0] as any;
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/templates');
		expect(options.query).toEqual({ workspaceId: 'ws_abc' });
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'dynapictures.templates.list',
			{ workspaceId: 'ws_abc' },
			'completed',
		);
	});

	it('webhooks.unsubscribe: sends DELETE /hooks', async () => {
		requestMock.mockResolvedValueOnce({ success: true });

		const result = await Webhooks.unsubscribe(ctx, {
			targetUrl: 'https://example.com/hook',
			eventType: 'image.ready',
			templateId: 'tpl_123',
		});

		expect(result).toEqual({ success: true });
		const [, options] = requestMock.mock.calls[0] as any;
		expect(options.method).toBe('DELETE');
		expect(options.url).toBe('/hooks');
		expect(options.body).toEqual({
			targetUrl: 'https://example.com/hook',
			eventType: 'image.ready',
			templateId: 'tpl_123',
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'dynapictures.webhooks.unsubscribe',
			{
				targetUrl: 'https://example.com/hook',
				eventType: 'image.ready',
				templateId: 'tpl_123',
			},
			'completed',
		);
	});

	it('media.upload: sends POST /media with imageUrl and optional name', async () => {
		requestMock.mockResolvedValueOnce({
			id: 'media_1',
			url: 'https://dynapictures.com/cdn/img.png',
		});

		const result = await Media.upload(ctx, {
			imageUrl: 'https://source.unsplash.com/random',
			name: 'Hero Image',
		});

		expect(result).toEqual({
			id: 'media_1',
			url: 'https://dynapictures.com/cdn/img.png',
		});
		const [, options] = requestMock.mock.calls[0] as any;
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/media');
		expect(options.body).toEqual({
			imageUrl: 'https://source.unsplash.com/random',
			name: 'Hero Image',
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'dynapictures.media.upload',
			{ imageUrl: 'https://source.unsplash.com/random', name: 'Hero Image' },
			'completed',
		);
	});
});
