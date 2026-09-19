import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
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

const mockCtx = {
	key: 'coinmarketcal_test_key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as CoinmarketcalContext;

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
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'endpoint',
			),
		).resolves.toBe('from-options');
	});

	it('reads API key from managed credentials', async () => {
		const plugin = coinmarketcal();

		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue('managed-key'),
			},
		} as unknown as CoinmarketcalKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).resolves.toBe('managed-key');
	});

	it('throws AuthMissingError when API key is absent', async () => {
		const plugin = coinmarketcal();

		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(undefined),
			},
		} as unknown as CoinmarketcalKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
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

	it('coins.list calls GET /v2/coins with query params', async () => {
		mockRequest.mockResolvedValue({
			data: [{ symbol: 'BTC', name: 'Bitcoin', slug: 'bitcoin' }],
			meta: { total: 1, cursor: null },
		});

		const result = await endpoints.coins.list(mockCtx, {
			limit: 25,
			cursor: 'c1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.coinmarketcal.com',
				TOKEN: 'coinmarketcal_test_key',
				HEADERS: expect.objectContaining({
					'x-api-key': 'coinmarketcal_test_key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/coins',
				query: { limit: 25, cursor: 'c1' },
			}),
		);
		expect(CoinmarketcalEndpointOutputSchemas.coinsList.parse(result)).toEqual(
			result,
		);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'coinmarketcal.coins.list',
			{ limit: 25, cursor: 'c1' },
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
			data: [{ id: 1, name: 'Exchange', slug: 'exchange' }],
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
