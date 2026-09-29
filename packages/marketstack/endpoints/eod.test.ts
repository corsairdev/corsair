import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackContext } from '../index';
import { getEod } from './eod';

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
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const EOD_RESPONSE = {
	pagination: { limit: 100, offset: 0, count: 1, total: 1 },
	data: [
		{
			open: 172.92,
			high: 173.66,
			low: 171.12,
			close: 172.03,
			volume: 58133500,
			symbol: 'AAPL',
			exchange: 'XNAS',
			date: '2026-05-28T00:00:00+0000',
		},
	],
};

function makeCtx(
	overrides: Partial<MarketstackContext> = {},
): MarketstackContext {
	return { key: 'test-key', options: {}, ...overrides } as never;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('eod.get', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			getEod(makeCtx({ key: undefined }), { symbols: ['AAPL'] }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty symbols array before calling the API', async () => {
		await expect(getEod(makeCtx(), { symbols: [] })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('joins multiple symbols and forwards filters', async () => {
		mockRequest.mockResolvedValue(EOD_RESPONSE);

		const result = await getEod(makeCtx(), {
			symbols: ['AAPL', 'MSFT'],
			exchange: 'XNAS',
			sort: 'ASC',
			dateFrom: '2026-01-01',
			dateTo: '2026-02-01',
			limit: 10,
			offset: 5,
		});

		expect(mockRequest).toHaveBeenCalledWith('eod', 'test-key', {
			query: {
				symbols: 'AAPL,MSFT',
				exchange: 'XNAS',
				sort: 'ASC',
				date_from: '2026-01-01',
				date_to: '2026-02-01',
				limit: 10,
				offset: 5,
			},
		});
		expect(result.data[0]?.symbol).toBe('AAPL');
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'marketstack.eod.get',
			expect.objectContaining({ symbols: ['AAPL', 'MSFT'] }),
			'completed',
		);
	});

	it('rejects a malformed dateFrom before calling the API', async () => {
		await expect(
			getEod(makeCtx(), { symbols: ['AAPL'], dateFrom: 'not-a-date' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an impossible calendar date before calling the API', async () => {
		await expect(
			getEod(makeCtx(), { symbols: ['AAPL'], dateFrom: '2026-02-30' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
