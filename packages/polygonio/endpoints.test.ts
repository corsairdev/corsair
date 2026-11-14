import * as client from './client';
import { PolygonioAPIError } from './client';
import { Aggregates, MarketOperations, Snapshots, Tickers } from './endpoints';
import { buildContext, captureError } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePolygonioRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePolygonioRequest);

const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('response parsing', () => {
	it('keeps a field the API adds and passes it through', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			results: [{ ticker: 'AAPL', name: 'Apple Inc.', brand_new_field: 'x' }],
		});

		const result = await Tickers.list(ctx, {});

		expect(result.results[0]).toMatchObject({ brand_new_field: 'x' });
	});

	it('accepts a DELAYED status, which a time-limited plan returns', async () => {
		mockedRequest.mockResolvedValue({
			status: 'DELAYED',
			ticker: 'AAPL',
			resultsCount: 0,
			results: [],
		});

		const result = await Aggregates.bars(ctx, {
			ticker: 'AAPL',
			multiplier: 1,
			timespan: 'day',
			from: '2020-01-01',
			to: '2020-01-02',
		});

		expect(result.status).toBe('DELAYED');
	});

	it('accepts an empty result set, which a non-trading date returns', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			resultsCount: 0,
			results: [],
		});

		const result = await Aggregates.bars(ctx, {
			ticker: 'AAPL',
			multiplier: 1,
			timespan: 'day',
			from: '2020-01-04',
			to: '2020-01-05',
		});

		expect(result.results).toEqual([]);
	});

	it('rejects a page whose results is not an array', async () => {
		mockedRequest.mockResolvedValue({ status: 'OK', results: 'nope' });

		await expect(Tickers.list(ctx, {})).rejects.toThrow();
	});

	it('rejects a bar whose close is a string rather than a number', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			results: [{ o: 1, h: 2, l: 0.5, c: 'not-a-number', t: 1 }],
		});

		await expect(
			Aggregates.bars(ctx, {
				ticker: 'AAPL',
				multiplier: 1,
				timespan: 'day',
				from: '2020-01-01',
				to: '2020-01-02',
			}),
		).rejects.toThrow();
	});

	it('rejects a snapshot that omits the ticker it is about', async () => {
		mockedRequest.mockResolvedValue({ status: 'OK' });

		await expect(Snapshots.snapshot(ctx, { ticker: 'AAPL' })).rejects.toThrow();
	});

	it('keeps a null fmv, which a non-business plan leaves unset', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			ticker: { ticker: 'AAPL', fmv: null, todaysChange: 0 },
		});

		const result = await Snapshots.snapshot(ctx, { ticker: 'AAPL' });

		expect(result.ticker.fmv).toBeNull();
	});

	it('reports an OTC bar flag that the API only sends when true', async () => {
		mockedRequest.mockResolvedValue({
			status: 'OK',
			results: [
				{ c: 1, t: 1, otc: true },
				{ c: 2, t: 2 },
			],
		});

		const result = await Aggregates.bars(ctx, {
			ticker: 'AAPL',
			multiplier: 1,
			timespan: 'day',
			from: '2020-01-01',
			to: '2020-01-02',
		});

		expect(result.results?.[0]?.otc).toBe(true);
		expect(result.results?.[1]?.otc).toBeUndefined();
	});
});

describe('input validation before the request', () => {
	it('accepts nextUrl alone, since a next page needs no first-page filters', async () => {
		mockedRequest.mockResolvedValue({ status: 'OK', results: [] });

		await Aggregates.bars(ctx, {
			nextUrl:
				'https://api.massive.com/v2/aggs/ticker/AAPL/range/1/day/1/2?cursor=abc',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
	});

	it('rejects bars with neither nextUrl nor the first-page filters', async () => {
		await expect(Aggregates.bars(ctx, { ticker: 'AAPL' })).rejects.toThrow(
			/Supply nextUrl, or all of/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects marketSummary without a date', async () => {
		await expect(Aggregates.marketSummary(ctx, {} as never)).rejects.toThrow(
			/date/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a multiplier that is not a positive integer', async () => {
		await expect(
			Aggregates.bars(ctx, {
				ticker: 'AAPL',
				multiplier: 0,
				timespan: 'day',
				from: '2020-01-01',
				to: '2020-01-02',
			}),
		).rejects.toThrow();
		await expect(
			Aggregates.bars(ctx, {
				ticker: 'AAPL',
				multiplier: 1.5,
				timespan: 'day',
				from: '2020-01-01',
				to: '2020-01-02',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a timespan outside the documented set', async () => {
		await expect(
			Aggregates.bars(ctx, {
				ticker: 'AAPL',
				multiplier: 1,
				timespan: 'decade' as never,
				from: '2020-01-01',
				to: '2020-01-02',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an aggregate limit above the documented 50000', async () => {
		await expect(
			Aggregates.bars(ctx, {
				ticker: 'AAPL',
				multiplier: 1,
				timespan: 'day',
				from: '2020-01-01',
				to: '2020-01-02',
				limit: 50_001,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a ticker limit above the documented 1000', async () => {
		await expect(Tickers.list(ctx, { limit: 1001 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a movers direction that is neither gainers nor losers', async () => {
		await expect(
			Snapshots.movers(ctx, { direction: 'sideways' as never }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty ticker rather than sending a blank path segment', async () => {
		await expect(Snapshots.snapshot(ctx, { ticker: '' })).rejects.toThrow();
		await expect(Tickers.overview(ctx, { ticker: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a sort value outside asc and desc', async () => {
		await expect(
			Aggregates.bars(ctx, {
				ticker: 'AAPL',
				multiplier: 1,
				timespan: 'day',
				from: '2020-01-01',
				to: '2020-01-02',
				sort: 'newest' as never,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('surfaces an API rejection as a PolygonioAPIError a handler can match', async () => {
		const unauthorized = new PolygonioAPIError(
			'Polygon.io 401: Unknown API Key',
			{
				status: 401,
				code: 'Unknown API Key',
				method: 'GET',
				credentialsRejected: true,
			},
		);
		mockedRequest.mockRejectedValue(unauthorized);

		const error = await captureError(MarketOperations.status(ctx, {}));

		expect(error).toBeInstanceOf(PolygonioAPIError);
		expect(error).toMatchObject({ status: 401, credentialsRejected: true });
	});
});
