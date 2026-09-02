import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackContext } from '../index';
import { getSplits } from './splits';

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

describe('splits.get', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			getSplits(makeCtx({ key: undefined }), { symbols: ['AAPL'] }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects more than 100 symbols before calling the API', async () => {
		const symbols = Array.from({ length: 101 }, (_, i) => `SYM${i}`);
		await expect(getSplits(makeCtx(), { symbols })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('joins symbols and forwards the date range', async () => {
		mockRequest.mockResolvedValue({
			pagination: { limit: 100, offset: 0, count: 1, total: 1 },
			data: [
				{ symbol: 'AAPL', date: '2020-08-31T00:00:00+0000', split_factor: 4 },
			],
		});

		const result = await getSplits(makeCtx(), {
			symbols: ['AAPL'],
			dateFrom: '2020-01-01',
		});

		expect(mockRequest).toHaveBeenCalledWith('splits', 'test-key', {
			query: {
				symbols: 'AAPL',
				date_from: '2020-01-01',
				date_to: undefined,
				limit: undefined,
				offset: undefined,
			},
		});
		expect(result.data[0]?.split_factor).toBe(4);
	});
});
