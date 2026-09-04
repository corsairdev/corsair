import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { Urls } from './endpoints';
import type { TinyurlContext } from './index';
import { tinyurl } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const TEST_API_KEY = 'test-tinyurl-token';

// Unit test fixture providing only the required key property rather than full Corsair framework runtime context.
const ctx = { key: TEST_API_KEY } as unknown as TinyurlContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('Urls.create', () => {
	it('shortens a long URL and returns the TinyURL link', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				domain: 'tinyurl.com',
				alias: 'abc123xyz',
				deleted: false,
				archived: false,
				tags: [],
				created_at: '2026-01-01T00:00:00.000Z',
				expires_at: null,
				tiny_url: 'https://tinyurl.com/abc123xyz',
				url: 'https://example.com/some/very/long/article/path',
			},
			code: 0,
			errors: [],
		});

		const result = await Urls.create(ctx, {
			url: 'https://example.com/some/very/long/article/path',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.tinyurl.com',
				HEADERS: expect.objectContaining({
					Authorization: `Bearer ${TEST_API_KEY}`,
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/create',
				body: {
					url: 'https://example.com/some/very/long/article/path',
				},
			}),
		);

		expect(result.tiny_url).toBe('https://tinyurl.com/abc123xyz');
		expect(result.url).toBe('https://example.com/some/very/long/article/path');
		expect(result.alias).toBe('abc123xyz');

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'tinyurl.urls.create',
			{
				alias: 'abc123xyz',
				tiny_url: 'https://tinyurl.com/abc123xyz',
			},
			'completed',
		);
	});

	it('forwards optional parameters: domain, alias, tags, expires_at, description', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				domain: 'tiny.one',
				alias: 'custom-launch',
				deleted: false,
				archived: false,
				tags: ['marketing', 'promo'],
				created_at: '2026-01-01T00:00:00.000Z',
				expires_at: '2026-12-31 23:59:59',
				tiny_url: 'https://tiny.one/custom-launch',
				url: 'https://example.com/promo',
				description: 'Campaign link',
			},
			code: 0,
			errors: [],
		});

		const result = await Urls.create(ctx, {
			url: 'https://example.com/promo',
			domain: 'tiny.one',
			alias: 'custom-launch',
			tags: ['marketing', 'promo'],
			expires_at: '2026-12-31 23:59:59',
			description: 'Campaign link',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/create',
				body: {
					url: 'https://example.com/promo',
					domain: 'tiny.one',
					alias: 'custom-launch',
					tags: 'marketing,promo',
					expires_at: '2026-12-31 23:59:59',
					description: 'Campaign link',
				},
			}),
		);

		expect(result.tiny_url).toBe('https://tiny.one/custom-launch');
		expect(result.domain).toBe('tiny.one');
		expect(result.alias).toBe('custom-launch');
	});

	it('rejects an invalid URL input', async () => {
		await expect(
			Urls.create(ctx, { url: 'not-a-valid-url' }),
		).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects when url is missing', async () => {
		await expect(Urls.create(ctx, {} as never)).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('surfaces TinyURL API error when request fails', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'POST', url: '/create' },
				{
					url: '/create',
					ok: false,
					status: 422,
					statusText: 'Unprocessable Entity',
					body: {
						code: 5,
						errors: ['The Alias format is invalid.'],
					},
				},
				'Unprocessable Entity',
			),
		);

		await expect(
			Urls.create(ctx, {
				url: 'https://example.com/page',
				alias: 'invalid alias with spaces!',
			}),
		).rejects.toThrow('The Alias format is invalid.');
	});

	it('surfaces generic error message when errors array is not present', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'POST', url: '/create' },
				{
					url: '/create',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: {
						message: 'Unauthenticated.',
					},
				},
				'Unauthorized',
			),
		);

		await expect(
			Urls.create(ctx, { url: 'https://example.com/page' }),
		).rejects.toThrow('Unauthenticated.');
	});

	it('rejects expires_at that is not YYYY-MM-DD HH:MM:SS', async () => {
		await expect(
			Urls.create(ctx, {
				url: 'https://example.com/page',
				expires_at: 'tomorrow',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('Urls.list', () => {
	it('lists available TinyURLs with pagination', async () => {
		mockRequest.mockResolvedValueOnce({
			code: 0,
			data: [
				{
					domain: 'tinyurl.com',
					alias: 'abc123xyz',
					deleted: false,
					archived: false,
					analytics: { enabled: true, public: false },
					tags: [],
					created_at: '2026-09-02T12:16:27+00:00',
					expires_at: null,
					tiny_url: 'https://tinyurl.com/abc123xyz',
				},
			],
			errors: [],
		});

		const result = await Urls.list(ctx, {
			type: 'available',
			page: 1,
			limit: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.tinyurl.com',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/urls/available',
				query: expect.objectContaining({
					page: 1,
					limit: 10,
				}),
			}),
		);
		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.tiny_url).toBe('https://tinyurl.com/abc123xyz');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'tinyurl.urls.list',
			{ type: 'available', count: 1 },
			'completed',
		);
	});

	it('rejects an invalid list type', async () => {
		await expect(Urls.list(ctx, { type: 'nope' as never })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('tinyurl plugin initialization and keyBuilder', () => {
	it('initializes with default authType api_key', () => {
		const plugin = tinyurl();
		expect(plugin.id).toBe('tinyurl');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toBeDefined();
		expect(plugin.endpoints?.urls.create).toBeDefined();
		expect(plugin.endpoints?.urls.list).toBeDefined();
	});

	it('keyBuilder returns static key when provided in options', async () => {
		const plugin = tinyurl({ key: 'custom-static-key' });
		const key = await plugin.keyBuilder?.({} as never, 'endpoint');
		expect(key).toBe('custom-static-key');
	});

	it('keyBuilder retrieves api_key from context when not in options', async () => {
		const plugin = tinyurl();
		const mockCtx = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue('ctx-resolved-token'),
			},
		};
		const key = await plugin.keyBuilder?.(mockCtx as never, 'endpoint');
		expect(key).toBe('ctx-resolved-token');
	});

	it('keyBuilder throws AuthMissingError when key is unavailable', async () => {
		const plugin = tinyurl();
		const mockCtx = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(null),
			},
		};
		await expect(
			plugin.keyBuilder?.(mockCtx as never, 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
