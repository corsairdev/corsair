import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackContext } from '../index';
import { getDividends } from './dividends';

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

describe('dividends.get', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			getDividends(makeCtx({ key: undefined }), { symbols: ['AAPL'] }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty symbols array before calling the API', async () => {
		await expect(getDividends(makeCtx(), { symbols: [] })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('joins symbols and forwards the date range', async () => {
		mockRequest.mockResolvedValue({
			pagination: { limit: 100, offset: 0, count: 1, total: 1 },
			data: [
				{ symbol: 'AAPL', date: '2026-02-01T00:00:00+0000', dividend: 0.24 },
			],
		});

		const result = await getDividends(makeCtx(), {
			symbols: ['AAPL', 'MSFT'],
			dateFrom: '2026-01-01',
			dateTo: '2026-03-01',
		});

		expect(mockRequest).toHaveBeenCalledWith('dividends', 'test-key', {
			query: {
				symbols: 'AAPL,MSFT',
				date_from: '2026-01-01',
				date_to: '2026-03-01',
				limit: undefined,
				offset: undefined,
			},
		});
		expect(result.data[0]?.dividend).toBe(0.24);
	});
});
