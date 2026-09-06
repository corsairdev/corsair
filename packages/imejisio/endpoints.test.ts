import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { ImejisioAPIError } from './client';
import { Designs } from './endpoints';
import type { ImejisioContext } from './index';
import { imejisio } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const TEST_API_KEY = 'test-imejis-token-123';
const TEST_RENDER_KEY = 'test-dma-render-key-456';

const ctx = {
	key: TEST_API_KEY,
	options: {},
} as unknown as ImejisioContext;

const renderCtx = {
	key: TEST_API_KEY,
	options: {
		renderKey: TEST_RENDER_KEY,
	},
} as unknown as ImejisioContext;

const mockPaginatedDesigns = {
	docs: [
		{
			_id: '65a1234567890abcdef12345',
			name: 'Social Banner',
			updatedAt: '2025-01-20T14:32:00.000Z',
		},
	],
	page: 1,
	totalPages: 1,
	hasNextPage: false,
};

// Global fetch mock helper
const originalFetch = global.fetch;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
	global.fetch = jest.fn();
});

afterAll(() => {
	global.fetch = originalFetch;
});

describe('plugin shape', () => {
	it('registers designs.list and designs.render catalog endpoints and no webhooks', () => {
		const plugin = imejisio();
		expect(plugin.id).toBe('imejisio');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.authConfig?.api_key?.account).toEqual(['render_key']);
		expect(Object.keys(plugin.endpoints ?? {})).toEqual(['designs']);
		expect(typeof plugin.endpoints?.designs?.list).toBe('function');
		expect(typeof plugin.endpoints?.designs?.render).toBe('function');
	});

	it('resolves api_key from options or context and rejects webhook key lookup', async () => {
		const pluginWithOptionsKey = imejisio({ key: TEST_API_KEY });
		await expect(
			pluginWithOptionsKey.keyBuilder?.(
				{ authType: 'api_key' } as never,
				'endpoint',
			),
		).resolves.toBe(TEST_API_KEY);

		const pluginWithContextKey = imejisio();
		const mockContext = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(TEST_API_KEY),
			},
		};
		await expect(
			pluginWithContextKey.keyBuilder?.(mockContext as never, 'endpoint'),
		).resolves.toBe(TEST_API_KEY);

		const mockContextEmpty = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(null),
			},
		};
		await expect(
			pluginWithContextKey.keyBuilder?.(mockContextEmpty as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);

		await expect(
			pluginWithContextKey.keyBuilder?.(
				mockContext as never,
				'webhook' as never,
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('Designs.list', () => {
	it('makes GET /designs/v2 with Authorization Bearer header and default empty query', async () => {
		mockRequest.mockResolvedValueOnce(mockPaginatedDesigns);

		const result = await Designs.list(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.imejis.io',
				HEADERS: expect.objectContaining({
					Authorization: `Bearer ${TEST_API_KEY}`,
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/designs/v2',
				query: {},
			}),
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'imejisio.designs.list',
			{},
			'completed',
		);
		expect(result).toEqual(mockPaginatedDesigns);
	});

	it('passes page and limit as $page and $limit query parameters', async () => {
		mockRequest.mockResolvedValueOnce(mockPaginatedDesigns);

		const result = await Designs.list(ctx, { page: 2, limit: 25 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.imejis.io',
				HEADERS: expect.objectContaining({
					Authorization: `Bearer ${TEST_API_KEY}`,
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/designs/v2',
				query: {
					$page: 2,
					$limit: 25,
				},
			}),
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'imejisio.designs.list',
			{ page: 2, limit: 25 },
			'completed',
		);
		expect(result).toEqual(mockPaginatedDesigns);
	});

	it('enforces runtime input validation (throws on invalid limit)', async () => {
		await expect(Designs.list(ctx, { limit: 150 })).rejects.toThrow();
	});

	it('enforces runtime output validation (throws on malformed provider response)', async () => {
		mockRequest.mockResolvedValueOnce({
			invalid_field: true,
		});

		await expect(Designs.list(ctx, {})).rejects.toThrow();
	});

	it('propagates ApiError unchanged for error handlers', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.imejis.io/designs/v2' },
			{
				url: 'https://api.imejis.io/designs/v2',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: 'Invalid token' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValueOnce(apiError);

		await expect(Designs.list(ctx, {})).rejects.toBe(apiError);
	});

	it('wraps generic errors into ImejisioAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('Network failure'));

		await expect(Designs.list(ctx, {})).rejects.toThrow(ImejisioAPIError);
	});
});

describe('Designs.render', () => {
	const mockFetch = () => global.fetch as jest.MockedFunction<typeof fetch>;

	it('renders stream mode with raw binary converted to base64', async () => {
		const binaryBytes = Buffer.from('fake-jpeg-image-bytes');
		const arrayBuffer = binaryBytes.buffer.slice(
			binaryBytes.byteOffset,
			binaryBytes.byteOffset + binaryBytes.byteLength,
		);
		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'image/jpeg' }),
			arrayBuffer: async () => arrayBuffer,
			text: async () => '',
		} as Response);

		const result = await Designs.render(renderCtx, { designId: 'des_456' });

		expect(result).toEqual({
			delivery: 'stream',
			format: 'jpeg',
			contentType: 'image/jpeg',
			base64: binaryBytes.toString('base64'),
		});

		expect(mockFetch()).toHaveBeenCalledTimes(1);
		const [calledUrl, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://render.imejis.io/v1/des_456?format=jpeg&delivery=stream',
		);
		expect(calledOptions?.method).toBe('POST');
		expect(calledOptions?.headers).toEqual({
			'dma-api-key': TEST_RENDER_KEY,
			'Content-Type': 'application/json',
		});
		expect(calledOptions?.body).toBe('{}');

		expect(mockLog).toHaveBeenCalledWith(
			renderCtx,
			'imejisio.designs.render',
			{
				designId: 'des_456',
				format: 'jpeg',
				delivery: 'stream',
			},
			'completed',
		);
	});

	it('renders hosted mode returning JSON URL response', async () => {
		const hostedPayload = {
			success: true,
			delivery: 'hosted',
			url: 'https://cdn.imejis.io/renders/hosted-123.png',
			format: 'png',
			file: { size: 1024 },
		};

		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => hostedPayload,
			text: async () => JSON.stringify(hostedPayload),
		} as Response);

		const result = await Designs.render(renderCtx, {
			designId: 'des_456',
			format: 'png',
			delivery: 'hosted',
		});

		expect(result).toEqual({
			delivery: 'hosted',
			success: true,
			url: 'https://cdn.imejis.io/renders/hosted-123.png',
			format: 'png',
			file: { size: 1024 },
		});

		const [calledUrl, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://render.imejis.io/v1/des_456?format=png&delivery=hosted',
		);
		expect(calledOptions?.headers).toEqual({
			'dma-api-key': TEST_RENDER_KEY,
			'Content-Type': 'application/json',
		});
	});

	it('renders signed mode with expiresIn parameter and dynamic overrides body', async () => {
		const signedPayload = {
			success: true,
			delivery: 'signed',
			url: 'https://cdn.imejis.io/renders/signed-123.jpeg?token=xyz',
			expiresAt: '2026-09-07T12:00:00.000Z',
			format: 'jpeg',
		};

		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => signedPayload,
			text: async () => JSON.stringify(signedPayload),
		} as Response);

		const result = await Designs.render(renderCtx, {
			designId: 'des_456',
			delivery: 'signed',
			quality: 85,
			expiresIn: 120,
			overrides: {
				headline: 'Flash Sale',
				discount: 50,
			},
		});

		expect(result).toEqual({
			delivery: 'signed',
			success: true,
			url: 'https://cdn.imejis.io/renders/signed-123.jpeg?token=xyz',
			expiresAt: '2026-09-07T12:00:00.000Z',
			format: 'jpeg',
		});

		const [calledUrl, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledUrl).toBe(
			'https://render.imejis.io/v1/des_456?format=jpeg&delivery=signed&quality=85&expiresIn=120',
		);
		expect(calledOptions?.headers).toEqual({
			'dma-api-key': TEST_RENDER_KEY,
			'Content-Type': 'application/json',
		});
		expect(calledOptions?.body).toBe(
			JSON.stringify({ headline: 'Flash Sale', discount: 50 }),
		);
	});

	it('uses options.renderKey for dma-api-key authentication', async () => {
		const ctxWithOptions = {
			key: TEST_API_KEY,
			options: {
				renderKey: 'custom-options-render-key',
			},
		} as unknown as ImejisioContext;

		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'image/jpeg' }),
			arrayBuffer: async () => new ArrayBuffer(8),
			text: async () => '',
		} as Response);

		await Designs.render(ctxWithOptions, { designId: 'des_1' });

		const [, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledOptions?.headers).toEqual(
			expect.objectContaining({
				'dma-api-key': 'custom-options-render-key',
			}),
		);
	});

	it('resolves render_key from ctx.keys.get_render_key() when options.renderKey is omitted', async () => {
		const ctxWithStoredKey = {
			key: TEST_API_KEY,
			options: {},
			keys: {
				get_render_key: jest.fn().mockResolvedValue('stored-render-key-789'),
			},
		} as unknown as ImejisioContext;

		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'image/jpeg' }),
			arrayBuffer: async () => new ArrayBuffer(8),
			text: async () => '',
		} as Response);

		await Designs.render(ctxWithStoredKey, { designId: 'des_1' });

		const [, calledOptions] = mockFetch().mock.calls[0]!;
		expect(calledOptions?.headers).toEqual(
			expect.objectContaining({
				'dma-api-key': 'stored-render-key-789',
			}),
		);
	});

	it('throws AuthMissingError and does NOT call fetch when ctx.key exists but no renderKey is configured', async () => {
		const ctxWithOnlyManagementKey = {
			key: TEST_API_KEY,
			options: {},
		} as unknown as ImejisioContext;

		await expect(
			Designs.render(ctxWithOnlyManagementKey, { designId: 'des_1' }),
		).rejects.toBeInstanceOf(AuthMissingError);

		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when no credentials are provided at all', async () => {
		const emptyCtx = {
			key: '',
			options: {},
		} as unknown as ImejisioContext;

		await expect(
			Designs.render(emptyCtx, { designId: 'des_1' }),
		).rejects.toBeInstanceOf(AuthMissingError);

		expect(mockFetch()).not.toHaveBeenCalled();
	});

	it('throws ImejisioAPIError on non-200 HTTP response', async () => {
		mockFetch().mockResolvedValueOnce({
			ok: false,
			status: 404,
			text: async () => JSON.stringify({ message: 'Design not found' }),
		} as Response);

		await expect(
			Designs.render(renderCtx, { designId: 'nonexistent' }),
		).rejects.toThrow('Design not found');
	});

	it('enforces runtime input validation on invalid parameters', async () => {
		// Empty designId
		await expect(Designs.render(renderCtx, { designId: '' })).rejects.toThrow();

		// Invalid format
		await expect(
			Designs.render(renderCtx, { designId: 'des_1', format: 'svg' as never }),
		).rejects.toThrow();

		// Invalid quality
		await expect(
			Designs.render(renderCtx, { designId: 'des_1', quality: 200 }),
		).rejects.toThrow();
	});

	it('enforces runtime output validation on malformed provider payload', async () => {
		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => ({
				delivery: 'hosted',
				// Missing required 'url'
			}),
			text: async () => '',
		} as Response);

		await expect(
			Designs.render(renderCtx, { designId: 'des_1', delivery: 'hosted' }),
		).rejects.toThrow();
	});

	it('does NOT log renderKey or sensitive dynamic overrides', async () => {
		mockFetch().mockResolvedValueOnce({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'image/jpeg' }),
			arrayBuffer: async () => new ArrayBuffer(4),
			text: async () => '',
		} as Response);

		await Designs.render(renderCtx, {
			designId: 'des_safe',
			overrides: { secretField: 'top-secret-val' },
		});

		expect(mockLog).toHaveBeenCalledTimes(1);
		const loggedMeta = mockLog.mock.calls[0]![2] as Record<string, unknown>;
		expect(loggedMeta.designId).toBe('des_safe');
		expect(loggedMeta.format).toBe('jpeg');
		expect(loggedMeta.delivery).toBe('stream');
		expect(loggedMeta.secretField).toBeUndefined();
		expect(loggedMeta.overrides).toBeUndefined();
		expect(loggedMeta.renderKey).toBeUndefined();
		expect(loggedMeta['dma-api-key']).toBeUndefined();
	});
});
