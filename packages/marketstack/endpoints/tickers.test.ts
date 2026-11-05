import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackContext } from '../index';
import {
	getTickerEod,
	getTickerEodLatest,
	getTickerInfo,
	listTickers,
} from './tickers';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client');
	return { ...actual, makeMarketstackRequest: jest.fn() };
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const mockRequest = makeMarketstackRequest as jest.MockedFunction<
	typeof makeMarketstackRequest
>;

function makeCtx(
	overrides: Partial<MarketstackContext> = {},
): MarketstackContext {
	return { key: 'test-key', options: {}, ...overrides } as never;
}

beforeEach(() => {
	mockRequest.mockReset();
	(logEventFromContext as jest.Mock).mockClear();
});

describe('tickers.get', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			getTickerInfo(makeCtx({ key: undefined }), { symbol: 'AAPL' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('URL-encodes the symbol into the path', async () => {
		mockRequest.mockResolvedValue({ symbol: 'BRK.A', name: 'Berkshire' });

		await getTickerInfo(makeCtx(), { symbol: 'BRK.A' });

		expect(mockRequest).toHaveBeenCalledWith('tickers/BRK.A', 'test-key');
	});

	it('rejects a path-traversal style symbol', async () => {
		mockRequest.mockResolvedValue({ symbol: 'x' });

		await getTickerInfo(makeCtx(), { symbol: '../exchanges' });

		expect(mockRequest).toHaveBeenCalledWith(
			'tickers/..%2Fexchanges',
			'test-key',
		);
	});
});

describe('tickers.list', () => {
	it('calls /tickerslist and forwards search and pagination params', async () => {
		mockRequest.mockResolvedValue({
			pagination: { limit: 10, offset: 0, count: 1, total: 1 },
			data: [{ ticker: 'AAPL', name: 'Apple Inc' }],
		});

		await listTickers(makeCtx(), { search: 'Apple', limit: 10, offset: 0 });

		expect(mockRequest).toHaveBeenCalledWith('tickerslist', 'test-key', {
			query: { search: 'Apple', exchange: undefined, limit: 10, offset: 0 },
		});
	});

	it('remaps the v2 `ticker` field onto `symbol`', async () => {
		mockRequest.mockResolvedValue({
			pagination: { limit: 10, offset: 0, count: 1, total: 1 },
			data: [{ ticker: 'AAPL', name: 'Apple Inc' }],
		});

		const result = await listTickers(makeCtx(), {});

		expect(result.data[0]).toEqual({ symbol: 'AAPL', name: 'Apple Inc' });
		expect(result.data[0]).not.toHaveProperty('ticker');
	});
});

describe('tickers.getEod', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			getTickerEod(makeCtx({ key: undefined }), { symbol: 'AAPL' }),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('builds the ticker-scoped eod path', async () => {
		mockRequest.mockResolvedValue({
			pagination: { limit: 100, offset: 0, count: 0, total: 0 },
			data: { symbol: 'AAPL', eod: [] },
		});

		await getTickerEod(makeCtx(), { symbol: 'AAPL', sort: 'DESC' });

		expect(mockRequest).toHaveBeenCalledWith('tickers/AAPL/eod', 'test-key', {
			query: {
				sort: 'DESC',
				date_from: undefined,
				date_to: undefined,
				limit: undefined,
				offset: undefined,
			},
		});
	});

	it('flattens the v2 `data.eod` nesting onto `data`', async () => {
		const bar = {
			open: 1,
			high: 2,
			low: 0.5,
			close: 1.5,
			volume: 100,
			symbol: 'AAPL',
			date: '2026-05-28T00:00:00+0000',
		};
		mockRequest.mockResolvedValue({
			pagination: { limit: 100, offset: 0, count: 1, total: 1 },
			data: { symbol: 'AAPL', name: 'Apple Inc', eod: [bar] },
		});

		const result = await getTickerEod(makeCtx(), { symbol: 'AAPL' });

		expect(result.data).toEqual([bar]);
	});
});

describe('tickers.getEodLatest', () => {
	it('builds the ticker-scoped latest-eod path', async () => {
		mockRequest.mockResolvedValue({
			open: 1,
			high: 2,
			low: 0.5,
			close: 1.5,
			volume: 100,
			symbol: 'AAPL',
			date: '2026-05-28T00:00:00+0000',
		});

		const result = await getTickerEodLatest(makeCtx(), { symbol: 'AAPL' });

		expect(mockRequest).toHaveBeenCalledWith(
			'tickers/AAPL/eod/latest',
			'test-key',
		);
		expect(result.symbol).toBe('AAPL');
	});
});
