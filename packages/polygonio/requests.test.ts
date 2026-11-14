import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Aggregates, MarketOperations, Snapshots, Tickers } from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePolygonioRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePolygonioRequest);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

const bar = {
	o: 74.06,
	h: 75.15,
	l: 73.79,
	c: 75.08,
	v: 135647456,
	t: 1577941200000,
};

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('aggregates endpoints', () => {
	it('bars encodes the ticker, window and range into the path', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			ticker: 'AAPL',
			adjusted: true,
			queryCount: 2,
			resultsCount: 1,
			results: [bar],
		});

		const result = await Aggregates.bars(ctx, {
			ticker: 'AAPL',
			multiplier: 1,
			timespan: 'day',
			from: '2020-01-01',
			to: '2020-01-10',
			adjusted: false,
			sort: 'desc',
			limit: 100,
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v2/aggs/ticker/AAPL/range/1/day/2020-01-01/2020-01-10',
			query: { adjusted: false, sort: 'desc', limit: 100 },
		});
		expect(result.results).toHaveLength(1);
		expect(result.results?.[0]?.c).toBe(75.08);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'polygonio.bars',
			{ count: 1 },
			'completed',
		);
	});

	it('bars follows nextUrl as the whole next page, ignoring the other filters', async () => {
		mockedRequest.mockResolvedValue({ status: 'OK', results: [] });

		await Aggregates.bars(ctx, {
			ticker: 'AAPL',
			multiplier: 1,
			timespan: 'day',
			from: '2020-01-01',
			to: '2020-01-10',
			nextUrl:
				'https://api.massive.com/v2/aggs/ticker/AAPL/range/1/day/1578114000000/2020-01-10?cursor=bGltaXQ9MiZzb3J0PWFzYw',
		});

		// The provider's URL already carries the cursor and the original filters.
		// Its path and query are split, because the client adds `apiKey` as a query
		// parameter: keeping the `?` in the path would fold the key into the cursor.
		const request = sentRequest();
		expect(request?.method).toBe('GET');
		expect(request?.path).toBe(
			'/v2/aggs/ticker/AAPL/range/1/day/1578114000000/2020-01-10',
		);
		expect(request?.path).not.toContain('?');
		// No filters are rebuilt for a next page: its URL already carries them.
		expect(request?.query).toEqual({
			cursor: 'bGltaXQ9MiZzb3J0PWFzYw',
		});
	});

	it('previousDay reads the prev path', async () => {
		mockedRequest.mockResolvedValue({ status: 'OK', results: [bar] });

		await Aggregates.previousDay(ctx, { ticker: 'AAPL', adjusted: true });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v2/aggs/ticker/AAPL/prev',
			query: { adjusted: true },
		});
	});

	it('dailySummary reads the open-close path for a date', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			symbol: 'AAPL',
			from: '2023-07-05',
			open: 192.2,
			close: 191.4,
		});

		const result = await Aggregates.dailySummary(ctx, {
			ticker: 'AAPL',
			date: '2023-07-05',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/open-close/AAPL/2023-07-05',
			query: { adjusted: undefined },
		});
		expect(result.close).toBe(191.4);
	});

	it('marketSummary reads the grouped path for a date', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			queryCount: 2,
			resultsCount: 1,
			results: [{ T: 'AAPL', ...bar }],
		});

		const result = await Aggregates.marketSummary(ctx, {
			date: '2023-07-05',
			include_otc: true,
		});

		// The grouped route documents only `adjusted` and `include_otc`, and
		// answers every ticker in one page (10,797 rows live, no `next_url`).
		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v2/aggs/grouped/locale/us/market/stocks/2023-07-05',
			query: { adjusted: undefined, include_otc: true },
		});
		expect(result.results?.[0]?.T).toBe('AAPL');
	});
});

describe('snapshots endpoints', () => {
	it('snapshot reads one ticker', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			ticker: {
				ticker: 'AAPL',
				todaysChange: 1.2,
				todaysChangePerc: 0.63,
				updated: 1700000000000000000,
				day: bar,
				prevDay: bar,
				min: bar,
			},
		});

		const result = await Snapshots.snapshot(ctx, { ticker: 'AAPL' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v2/snapshot/locale/us/markets/stocks/tickers/AAPL',
		});
		expect(result.ticker.todaysChange).toBe(1.2);
	});

	it('movers reads the gainers direction and passes include_otc', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			tickers: [{ ticker: 'ABCD', todaysChangePerc: 42.1 }],
		});

		const result = await Snapshots.movers(ctx, {
			direction: 'gainers',
			include_otc: false,
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v2/snapshot/locale/us/markets/stocks/gainers',
			query: { include_otc: false },
		});
		expect(result.tickers).toHaveLength(1);
	});
});

describe('tickers endpoints', () => {
	it('tickers.list maps the camelCase range filters back to the dotted names', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			count: 1,
			results: [{ ticker: 'AAPL', name: 'Apple Inc.', active: true }],
		});

		const result = await Tickers.list(ctx, {
			market: 'stocks',
			active: true,
			tickerGte: 'A',
			tickerLt: 'B',
			limit: 10,
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v3/reference/tickers',
			query: {
				ticker: undefined,
				type: undefined,
				market: 'stocks',
				exchange: undefined,
				cusip: undefined,
				cik: undefined,
				date: undefined,
				search: undefined,
				active: true,
				// The API's own parameter spellings.
				'ticker.gte': 'A',
				'ticker.gt': undefined,
				'ticker.lte': undefined,
				'ticker.lt': 'B',
				order: undefined,
				sort: undefined,
				limit: 10,
			},
		});
		expect(result.results?.[0]?.name).toBe('Apple Inc.');
	});

	it('tickers.list follows nextUrl', async () => {
		mockedRequest.mockResolvedValue({ status: 'OK', count: 0, results: [] });

		await Tickers.list(ctx, {
			nextUrl: 'https://api.massive.com/v3/reference/tickers?cursor=abc',
		});

		const request = sentRequest();
		expect(request?.path).toBe('/v3/reference/tickers');
		expect(request?.query).toEqual({ cursor: 'abc' });
	});

	it('tickers.overview reads one ticker, passing the as-of date', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			results: { ticker: 'AAPL', type: 'CS', primary_exchange: 'XNAS' },
		});

		const result = await Tickers.overview(ctx, {
			ticker: 'AAPL',
			date: '2026-04-17',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v3/reference/tickers/AAPL',
			query: { date: '2026-04-17' },
		});
		expect(result.results.type).toBe('CS');
	});

	it('tickers.types lists the type codes', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			count: 1,
			results: [
				{ code: 'CS', description: 'Common Stock', asset_class: 'stocks' },
			],
		});

		const result = await Tickers.types(ctx, { asset_class: 'stocks' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v3/reference/tickers/types',
			query: { asset_class: 'stocks', locale: undefined },
		});
		expect(result.results?.[0]?.code).toBe('CS');
	});
});

describe('market endpoints', () => {
	it('market.status reads the current status', async () => {
		mockedRequest.mockResolvedValue({
			market: 'open',
			earlyHours: false,
			afterHours: false,
			serverTime: '2026-11-14T14:30:00-05:00',
			exchanges: { nasdaq: 'open', nyse: 'open', otc: 'open' },
			currencies: { fx: 'open', crypto: 'open' },
		});

		const result = await MarketOperations.status(ctx, {});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/marketstatus/now',
		});
		expect(result.market).toBe('open');
	});

	it('market.holidays wraps the bare array the route answers with', async () => {
		mockedRequest.mockResolvedValue([
			{
				date: '2020-11-26',
				exchange: 'NYSE',
				name: 'Thanksgiving',
				status: 'closed',
			},
			{
				date: '2020-11-27',
				exchange: 'NYSE',
				name: 'Thanksgiving',
				status: 'early-close',
				close: '2020-11-27T18:00:00.000Z',
			},
		]);

		const result = await MarketOperations.holidays(ctx, {});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v1/marketstatus/upcoming',
		});
		expect(result.holidays).toHaveLength(2);
		expect(result.holidays[1]?.status).toBe('early-close');
	});

	it('market.exchanges lists exchanges and follows nextUrl', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			count: 1,
			results: [{ id: 1, name: 'NYSE', mic: 'XNYS', asset_class: 'stocks' }],
		});

		const result = await MarketOperations.exchanges(ctx, {
			asset_class: 'stocks',
			locale: 'us',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/v3/reference/exchanges',
			query: { asset_class: 'stocks', locale: 'us' },
		});
		expect(result.results?.[0]?.mic).toBe('XNYS');

		await MarketOperations.exchanges(ctx, {
			nextUrl: 'https://api.massive.com/v3/reference/exchanges?cursor=next',
		});
		const nextRequest = sentRequest();
		expect(nextRequest?.path).toBe('/v3/reference/exchanges');
		expect(nextRequest?.query).toEqual({ cursor: 'next' });
	});
});
