import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackContext } from '../index';
import { getExchange, listExchanges } from './exchanges';

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

describe('exchanges.get', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			getExchange(makeCtx({ key: undefined }), { mic: 'XNAS' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a missing mic before calling the API', async () => {
		await expect(getExchange(makeCtx(), { mic: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('builds the exchange path from the MIC and unwraps the v2 `data` envelope', async () => {
		mockRequest.mockResolvedValue({ data: { mic: 'XNAS', name: 'NASDAQ' } });

		const result = await getExchange(makeCtx(), { mic: 'XNAS' });

		expect(mockRequest).toHaveBeenCalledWith('exchanges/XNAS', 'test-key');
		expect(result).toEqual({ mic: 'XNAS', name: 'NASDAQ' });
	});
});

describe('exchanges.list', () => {
	it('forwards search and pagination params', async () => {
		mockRequest.mockResolvedValue({
			pagination: { limit: 10, offset: 0, count: 1, total: 1 },
			data: [{ mic: 'XNAS', name: 'NASDAQ' }],
		});

		await listExchanges(makeCtx(), { search: 'NASDAQ', limit: 10, offset: 0 });

		expect(mockRequest).toHaveBeenCalledWith('exchanges', 'test-key', {
			query: { search: 'NASDAQ', limit: 10, offset: 0 },
		});
	});
});
