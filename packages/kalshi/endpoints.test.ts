import crypto from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type { KalshiContext } from '.';
import { serializeKalshiCredentials } from './client';
import { Events } from './endpoints/events';
import { Exchange } from './endpoints/exchange';
import { Markets } from './endpoints/markets';
import { Orders } from './endpoints/orders';
import { Portfolio } from './endpoints/portfolio';
import { Series } from './endpoints/series';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {},
}));

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const rsa = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const key = serializeKalshiCredentials({
	keyId: 'test-key-id',
	privateKey: rsa.privateKey
		.export({ type: 'pkcs8', format: 'pem' })
		.toString(),
	environment: 'demo',
});
/** A fully typed context; the endpoints only read `key`, the rest is inert. */
function makeContext(contextKey: string): KalshiContext {
	return {
		key: contextKey,
		endpoints: {},
		$getAccountId: async () => 'test-account',
		options: {},
		db: {},
		keys: {
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
			get_api_key: async () => null,
			set_api_key: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
			get_private_key: async () => null,
			set_private_key: async () => {},
		},
	};
}

const ctx = makeContext(key);
const noKeyCtx = makeContext('');

function sent() {
	const call = mockRequest.mock.calls[0];
	if (!call) throw new Error('request was not called');
	return call[1];
}

const market = {
	ticker: 'KXHIGHNY-26NOV12-T60',
	event_ticker: 'KXHIGHNY-26NOV12',
	status: 'active',
	yes_bid_dollars: '0.5500',
	yes_ask_dollars: '0.5700',
	price_ranges: [{ start: '0.0000', end: '1.0000', step: '0.0100' }],
};

const order = {
	order_id: 'ord-1',
	client_order_id: 'cli-1',
	ticker: market.ticker,
	status: 'resting',
	yes_price_dollars: '0.5600',
	remaining_count_fp: '10.00',
};

const newOrder = {
	ticker: market.ticker,
	side: 'bid' as const,
	count: '10.00',
	price: '0.5600',
	time_in_force: 'good_till_canceled' as const,
};

describe('Kalshi endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('exchange', () => {
		it('status calls GET /exchange/status', async () => {
			const response = { exchange_active: true, trading_active: false };
			mockRequest.mockResolvedValueOnce(response);

			const result = await Exchange.status(ctx, {});

			expect(sent()).toMatchObject({ method: 'GET', url: '/exchange/status' });
			expect(result.trading_active).toBe(false);
			expect(mockLog).toHaveBeenCalledWith(
				ctx,
				'kalshi.exchange.status',
				{},
				'completed',
			);
		});

		it('schedule calls GET /exchange/schedule', async () => {
			mockRequest.mockResolvedValueOnce({
				schedule: {
					standard_hours: [],
					maintenance_windows: [
						{
							start_datetime: '2026-11-12T10:00:00Z',
							end_datetime: '2026-11-12T11:00:00Z',
						},
					],
				},
			});

			const result = await Exchange.schedule(ctx, {});

			expect(sent()).toMatchObject({
				method: 'GET',
				url: '/exchange/schedule',
			});
			expect(result.schedule.maintenance_windows).toHaveLength(1);
		});
	});

	describe('markets', () => {
		it('list passes filters as the query and returns markets', async () => {
			mockRequest.mockResolvedValueOnce({ markets: [market], cursor: 'next' });

			const result = await Markets.list(ctx, { limit: 2, status: 'open' });

			expect(sent()).toMatchObject({
				method: 'GET',
				url: '/markets',
				query: { limit: 2, status: 'open' },
			});
			expect(result.markets[0]?.ticker).toBe(market.ticker);
			expect(result.markets[0]?.price_ranges?.[0]?.step).toBe('0.0100');
		});

		it('list can exclude multivariate combo markets', async () => {
			mockRequest.mockResolvedValueOnce({ markets: [market], cursor: '' });

			await Markets.list(ctx, { mve_filter: 'exclude' });

			expect(sent().query).toMatchObject({ mve_filter: 'exclude' });
		});

		it('list rejects an mve_filter value Kalshi does not define', async () => {
			await expect(
				Markets.list(ctx, { mve_filter: 'include' as never }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('list paginates across two pages and stops on an empty cursor', async () => {
			mockRequest
				.mockResolvedValueOnce({ markets: [market], cursor: 'page-2' })
				.mockResolvedValueOnce({ markets: [market], cursor: '' });

			const first = await Markets.list(ctx, { limit: 1 });
			const second = await Markets.list(ctx, {
				limit: 1,
				cursor: first.cursor ?? undefined,
			});

			expect(mockRequest.mock.calls[1]?.[1].query).toMatchObject({
				cursor: 'page-2',
			});
			expect(second.cursor).toBe('');
		});

		it('list accepts a null cursor as the end of the list', async () => {
			mockRequest.mockResolvedValueOnce({ markets: [], cursor: null });

			const result = await Markets.list(ctx, {});

			expect(result.cursor).toBeNull();
		});

		it('get calls GET /markets/:ticker', async () => {
			mockRequest.mockResolvedValueOnce({ market });

			const result = await Markets.get(ctx, { ticker: market.ticker });

			expect(sent()).toMatchObject({
				method: 'GET',
				url: `/markets/${market.ticker}`,
			});
			expect(result.market.status).toBe('active');
		});

		it('get URL-encodes the ticker', async () => {
			mockRequest.mockResolvedValueOnce({ market });

			await Markets.get(ctx, { ticker: 'A/B C' });

			expect(sent().url).toBe('/markets/A%2FB%20C');
		});

		it('orderbook calls GET /markets/:ticker/orderbook with depth', async () => {
			mockRequest.mockResolvedValueOnce({
				orderbook_fp: {
					yes_dollars: [['0.5500', '100.00']],
					no_dollars: [['0.4300', '50.00']],
				},
			});

			const result = await Markets.orderbook(ctx, {
				ticker: market.ticker,
				depth: 5,
			});

			expect(sent()).toMatchObject({
				url: `/markets/${market.ticker}/orderbook`,
				query: { depth: 5 },
			});
			expect(result.orderbook_fp.yes_dollars[0]).toEqual(['0.5500', '100.00']);
		});

		it('trades calls GET /markets/trades', async () => {
			mockRequest.mockResolvedValueOnce({
				trades: [
					{
						trade_id: 't-1',
						ticker: market.ticker,
						count_fp: '3.00',
						yes_price_dollars: '0.5600',
						no_price_dollars: '0.4400',
						created_time: '2026-11-11T10:00:00Z',
					},
				],
				cursor: '',
			});

			const result = await Markets.trades(ctx, {
				ticker: market.ticker,
				limit: 1,
			});

			expect(sent()).toMatchObject({
				url: '/markets/trades',
				query: { ticker: market.ticker, limit: 1 },
			});
			expect(result.trades[0]?.count_fp).toBe('3.00');
		});
	});

	describe('events', () => {
		const event = {
			event_ticker: 'KXHIGHNY-26NOV12',
			series_ticker: 'KXHIGHNY',
			title: 'Highest temperature in NYC',
		};

		it('list calls GET /events with pagination params', async () => {
			mockRequest.mockResolvedValueOnce({ events: [event], cursor: 'c2' });

			const result = await Events.list(ctx, { limit: 10, cursor: 'c1' });

			expect(sent()).toMatchObject({
				url: '/events',
				query: { limit: 10, cursor: 'c1' },
			});
			expect(result.cursor).toBe('c2');
		});

		it("list rejects a limit above Kalshi's 200 cap", async () => {
			await expect(Events.list(ctx, { limit: 201 })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('get calls GET /events/:ticker', async () => {
			mockRequest.mockResolvedValueOnce({ event, markets: [market] });

			const result = await Events.get(ctx, {
				event_ticker: event.event_ticker,
				with_nested_markets: true,
			});

			expect(sent()).toMatchObject({
				url: `/events/${event.event_ticker}`,
				query: { with_nested_markets: true },
			});
			expect(result.event.title).toBe(event.title);
			expect(result.markets).toHaveLength(1);
		});
	});

	describe('series', () => {
		const series = {
			ticker: 'KXHIGHNY',
			title: 'NYC high temperature',
			tags: null,
		};

		it('list calls GET /series and accepts null tags', async () => {
			mockRequest.mockResolvedValueOnce({ series: [series] });

			const result = await Series.list(ctx, { category: 'Climate' });

			expect(sent()).toMatchObject({
				url: '/series',
				query: { category: 'Climate' },
			});
			expect(result.series[0]?.tags).toBeNull();
		});

		it('get calls GET /series/:ticker', async () => {
			mockRequest.mockResolvedValueOnce({ series });

			const result = await Series.get(ctx, { series_ticker: 'KXHIGHNY' });

			expect(sent().url).toBe('/series/KXHIGHNY');
			expect(result.series.ticker).toBe('KXHIGHNY');
		});
	});

	describe('portfolio', () => {
		it('balance calls GET /portfolio/balance', async () => {
			mockRequest.mockResolvedValueOnce({
				balance: 12345,
				balance_dollars: '123.4500',
				portfolio_value: 200,
				updated_ts: 1731330000,
			});

			const result = await Portfolio.balance(ctx, {});

			expect(sent()).toMatchObject({
				method: 'GET',
				url: '/portfolio/balance',
			});
			expect(result.balance).toBe(12345);
		});

		it('positions calls GET /portfolio/positions', async () => {
			mockRequest.mockResolvedValueOnce({
				market_positions: [{ ticker: market.ticker, position_fp: '5.00' }],
				event_positions: [{ event_ticker: market.event_ticker }],
				cursor: '',
			});

			const result = await Portfolio.positions(ctx, { ticker: market.ticker });

			expect(sent()).toMatchObject({
				url: '/portfolio/positions',
				query: { ticker: market.ticker },
			});
			expect(result.market_positions[0]?.position_fp).toBe('5.00');
		});

		it('fills calls GET /portfolio/fills', async () => {
			mockRequest.mockResolvedValueOnce({
				fills: [
					{
						fill_id: 'f-1',
						order_id: 'ord-1',
						ticker: market.ticker,
						count_fp: '2.00',
						yes_price_dollars: '0.5600',
						no_price_dollars: '0.4400',
					},
				],
				cursor: '',
			});

			const result = await Portfolio.fills(ctx, { order_id: 'ord-1' });

			expect(sent()).toMatchObject({
				url: '/portfolio/fills',
				query: { order_id: 'ord-1' },
			});
			expect(result.fills[0]?.fill_id).toBe('f-1');
		});

		it('settlements calls GET /portfolio/settlements', async () => {
			mockRequest.mockResolvedValueOnce({
				settlements: [
					{ ticker: market.ticker, market_result: 'yes', revenue: 500 },
				],
			});

			const result = await Portfolio.settlements(ctx, { limit: 1 });

			expect(sent()).toMatchObject({
				url: '/portfolio/settlements',
				query: { limit: 1 },
			});
			expect(result.settlements[0]?.market_result).toBe('yes');
		});
	});

	describe('orders', () => {
		it('list calls GET /portfolio/orders with a status filter', async () => {
			mockRequest.mockResolvedValueOnce({ orders: [order], cursor: '' });

			const result = await Orders.list(ctx, { status: 'resting', limit: 5 });

			expect(sent()).toMatchObject({
				url: '/portfolio/orders',
				query: { status: 'resting', limit: 5 },
			});
			expect(result.orders[0]?.order_id).toBe('ord-1');
		});

		it('list rejects a status Kalshi does not define', async () => {
			await expect(
				Orders.list(ctx, { status: 'open' as never }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('get calls GET /portfolio/orders/:id', async () => {
			mockRequest.mockResolvedValueOnce({ order });

			const result = await Orders.get(ctx, { order_id: 'ord-1' });

			expect(sent().url).toBe('/portfolio/orders/ord-1');
			expect(result.order.status).toBe('resting');
		});

		it('create POSTs to the V2 path and defaults self-trade prevention', async () => {
			mockRequest.mockResolvedValueOnce({
				order_id: 'ord-1',
				fill_count: '0.00',
				remaining_count: '10.00',
				ts_ms: 1731330000123,
			});

			const result = await Orders.create(ctx, newOrder);

			expect(sent()).toMatchObject({
				method: 'POST',
				url: '/portfolio/events/orders',
				body: { ...newOrder, self_trade_prevention_type: 'taker_at_cross' },
			});
			expect(result.remaining_count).toBe('10.00');
		});

		it('create refuses a price with more than 4 decimals before any request', async () => {
			await expect(
				Orders.create(ctx, { ...newOrder, price: '0.56001' }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('create refuses a number where Kalshi wants a fixed-point string', async () => {
			await expect(
				Orders.create(ctx, { ...newOrder, count: 10 as never }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('amend POSTs to the amend path and keeps the order id out of the body', async () => {
			mockRequest.mockResolvedValueOnce({
				order_id: 'ord-1',
				remaining_count: '8.00',
				fill_count: null,
				ts_ms: 1731330000456,
			});

			const result = await Orders.amend(ctx, {
				order_id: 'ord-1',
				ticker: market.ticker,
				side: 'bid',
				price: '0.5700',
				count: '8.00',
			});

			expect(sent()).toMatchObject({
				method: 'POST',
				url: '/portfolio/events/orders/ord-1/amend',
				body: {
					ticker: market.ticker,
					side: 'bid',
					price: '0.5700',
					count: '8.00',
				},
			});
			expect(sent().body).not.toHaveProperty('order_id');
			expect(result.remaining_count).toBe('8.00');
		});

		it('cancel sends DELETE to the V2 order path', async () => {
			mockRequest.mockResolvedValueOnce({
				order_id: 'ord-1',
				reduced_by: '10.00',
				ts_ms: 1731330000789,
			});

			const result = await Orders.cancel(ctx, {
				order_id: 'ord-1',
				market_ticker: 'KXHIGHNY-26NOV12-T60',
			});

			expect(sent()).toMatchObject({
				method: 'DELETE',
				url: '/portfolio/events/orders/ord-1',
				query: { market_ticker: 'KXHIGHNY-26NOV12-T60' },
			});
			expect(result.reduced_by).toBe('10.00');
		});

		it('cancel requires market_ticker so it cannot default to shard 0', async () => {
			await expect(
				// Deliberately omits the required field to prove it is rejected.
				Orders.cancel(ctx, { order_id: 'ord-1' } as never),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('batchCreate POSTs every order and logs only the count', async () => {
			mockRequest.mockResolvedValueOnce({
				orders: [
					{
						order_id: 'a',
						fill_count: '0.00',
						remaining_count: '10.00',
						ts_ms: 1,
					},
					{ error: { code: 'insufficient_balance' } },
				],
			});

			const result = await Orders.batchCreate(ctx, {
				orders: [newOrder, { ...newOrder, side: 'ask' }],
			});

			expect(sent()).toMatchObject({
				method: 'POST',
				url: '/portfolio/events/orders/batched',
			});
			// `unknown` elements: only the count matters here, not each order's shape.
			expect((sent().body as { orders: unknown[] }).orders).toHaveLength(2);
			expect(result.orders[1]?.error).toBeDefined();
			expect(mockLog).toHaveBeenCalledWith(
				ctx,
				'kalshi.orders.batchCreate',
				{ count: 2 },
				'completed',
			);
		});

		it('batchCreate rejects an empty batch', async () => {
			await expect(Orders.batchCreate(ctx, { orders: [] })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('credentials', () => {
		it('every endpoint refuses to run without a key', async () => {
			await expect(Exchange.status(noKeyCtx, {})).rejects.toBeInstanceOf(
				AuthMissingError,
			);
			await expect(Orders.create(noKeyCtx, newOrder)).rejects.toBeInstanceOf(
				AuthMissingError,
			);
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});
});
