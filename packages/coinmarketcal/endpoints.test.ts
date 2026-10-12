import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { CoinmarketcalEndpointOutputSchemas } from './endpoints/types';
import type {
	CoinmarketcalContext,
	CoinmarketcalKeyBuilderContext,
} from './index';
import { coinmarketcal, coinmarketcalEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

// Safe: endpoints under test read only key and options, and the full context
// carries DB handles that cannot be built without a real corsair instance.
const mockCtx = {
	key: 'coinmarketcal_test_key',
	options: {},
} as CoinmarketcalContext;

// Calls the plugin's keyBuilder (optional on the plugin type) with a typed context.
function runKeyBuilder(
	plugin: ReturnType<typeof coinmarketcal>,
	ctx: CoinmarketcalKeyBuilderContext,
): Promise<string> {
	if (!plugin.keyBuilder) throw new Error('keyBuilder is not defined');
	return Promise.resolve(plugin.keyBuilder(ctx, 'endpoint'));
}

function createKeyBuilderContext(
	getApiKey: () => Promise<string | null>,
): CoinmarketcalKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: getApiKey,
			get_webhook_signature: async () => null,
			set_api_key: async () => undefined,
			set_webhook_signature: async () => undefined,
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
		},
	};
}

describe('Coinmarketcal plugin shape', () => {
	it('registers endpoint surface and API-key auth only', () => {
		const plugin = coinmarketcal();

		expect(plugin.id).toBe('coinmarketcal');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.endpoints?.coins.list).toBeDefined();
		expect(plugin.endpoints?.coins.get).toBeDefined();
		expect(plugin.endpoints?.events.list).toBeDefined();
		expect(plugin.endpoints?.events.get).toBeDefined();
		expect(plugin.endpoints?.categories.list).toBeDefined();
		expect(Object.keys(coinmarketcalEndpointSchemas).sort()).toEqual([
			'categories.list',
			'coins.get',
			'coins.list',
			'events.get',
			'events.list',
		]);
	});
});

describe('Coinmarketcal keyBuilder', () => {
	it('returns options.key for endpoint requests', async () => {
		const plugin = coinmarketcal({ key: 'from-options' });

		await expect(
			runKeyBuilder(
				plugin,
				createKeyBuilderContext(async () => null),
			),
		).resolves.toBe('from-options');
	});

	it('reads API key from managed credentials', async () => {
		const plugin = coinmarketcal();

		await expect(
			runKeyBuilder(
				plugin,
				createKeyBuilderContext(async () => 'managed-key'),
			),
		).resolves.toBe('managed-key');
	});

	it('throws AuthMissingError when API key is absent', async () => {
		const plugin = coinmarketcal();

		await expect(
			runKeyBuilder(
				plugin,
				createKeyBuilderContext(async () => null),
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('Coinmarketcal endpoints', () => {
	const endpoints = coinmarketcal().endpoints!;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('surfaces the provider error message on rejected requests', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v2/categories' },
			{
				url: 'https://api.coinmarketcal.com/v2/categories',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: {
					error: 'Categories endpoint requires Standard tier or above',
				},
			},
			'Forbidden',
		);
		mockRequest.mockRejectedValue(error);

		await expect(endpoints.categories.list(mockCtx, {})).rejects.toThrow(
			'Forbidden: Categories endpoint requires Standard tier or above',
		);
	});

	it('coins.list calls GET /v2/coins with query params', async () => {
		mockRequest.mockResolvedValue({
			data: [{ symbol: 'BTC', name: 'Bitcoin', slug: 'bitcoin' }],
			meta: { total: 1, cursor: null },
		});

		const result = await endpoints.coins.list(mockCtx, {
			q: 'bitcoin',
			tracked: true,
			limit: 25,
			cursor: 'c1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.coinmarketcal.com',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					'x-api-key': 'coinmarketcal_test_key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/coins',
				query: { q: 'bitcoin', tracked: true, limit: 25, cursor: 'c1' },
			}),
		);
		expect(CoinmarketcalEndpointOutputSchemas.coinsList.parse(result)).toEqual(
			result,
		);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'coinmarketcal.coins.list',
			{ q: 'bitcoin', tracked: true, limit: 25, cursor: 'c1' },
			'completed',
		);
	});

	it('coins.get calls GET /v2/coins/:slug', async () => {
		mockRequest.mockResolvedValue({
			symbol: 'BTC',
			name: 'Bitcoin',
			slug: 'bitcoin',
		});

		const result = await endpoints.coins.get(mockCtx, { slug: 'bitcoin' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/coins/bitcoin',
			}),
		);
		expect(CoinmarketcalEndpointOutputSchemas.coinsGet.parse(result)).toEqual(
			result,
		);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'coinmarketcal.coins.get',
			{ slug: 'bitcoin' },
			'completed',
		);
	});

	it('events.list calls GET /v2/events with query params', async () => {
		mockRequest.mockResolvedValue({
			data: [{ id: '1', title: 'Mainnet launch', date: '2026-01-01' }],
			meta: { total: 1, cursor: null },
		});

		const result = await endpoints.events.list(mockCtx, {
			coins: 'BTC',
			categories: 'exchange',
			limit: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/events',
				query: {
					coins: 'BTC',
					categories: 'exchange',
					limit: 10,
				},
			}),
		);
		expect(CoinmarketcalEndpointOutputSchemas.eventsList.parse(result)).toEqual(
			result,
		);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'coinmarketcal.events.list',
			{ coins: 'BTC', categories: 'exchange', limit: 10 },
			'completed',
		);
	});

	it('events.get calls GET /v2/events/:id', async () => {
		mockRequest.mockResolvedValue({
			id: 'evt-1',
			title: 'Halving',
			date: '2026-05-01',
		});

		const result = await endpoints.events.get(mockCtx, { id: 'evt-1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/events/evt-1',
			}),
		);
		expect(CoinmarketcalEndpointOutputSchemas.eventsGet.parse(result)).toEqual(
			result,
		);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'coinmarketcal.events.get',
			{ id: 'evt-1' },
			'completed',
		);
	});

	it('categories.list calls GET /v2/categories', async () => {
		mockRequest.mockResolvedValue({
			data: [{ id: 'exchange', name: 'Exchange' }],
		});

		const result = await endpoints.categories.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/categories',
				query: {},
			}),
		);
		expect(
			CoinmarketcalEndpointOutputSchemas.categoriesList.parse(result),
		).toEqual(result);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'coinmarketcal.categories.list',
			{},
			'completed',
		);
	});
});

describe('Coinmarketcal input schemas', () => {
	it('accepts documented events.list filters', () => {
		expect(
			coinmarketcalEndpointSchemas['events.list'].input.parse({
				sortBy: 'impact_desc',
				impactMin: 7.5,
				limit: 100,
			}),
		).toEqual({ sortBy: 'impact_desc', impactMin: 7.5, limit: 100 });
	});

	it('rejects undocumented sortBy values and out-of-range page sizes', () => {
		const events = coinmarketcalEndpointSchemas['events.list'].input;
		const coins = coinmarketcalEndpointSchemas['coins.list'].input;

		expect(events.safeParse({ sortBy: 'popular' }).success).toBe(false);
		expect(events.safeParse({ limit: 101 }).success).toBe(false);
		expect(events.safeParse({ impactMin: 11 }).success).toBe(false);
		expect(coins.safeParse({ limit: 200 }).success).toBe(true);
		expect(coins.safeParse({ limit: 201 }).success).toBe(false);
	});
});
