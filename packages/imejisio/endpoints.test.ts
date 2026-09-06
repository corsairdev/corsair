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
const ctx = {
	key: TEST_API_KEY,
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

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('plugin shape', () => {
	it('registers designs.list catalog endpoint and no webhooks', () => {
		const plugin = imejisio();
		expect(plugin.id).toBe('imejisio');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.endpoints ?? {})).toEqual(['designs']);
		expect(typeof plugin.endpoints?.designs?.list).toBe('function');
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
