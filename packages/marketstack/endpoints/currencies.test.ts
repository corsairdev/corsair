import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackContext } from '../index';
import { listCurrencies } from './currencies';

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

describe('currencies.list', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			listCurrencies(makeCtx({ key: undefined }), {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lists currencies with pagination params', async () => {
		mockRequest.mockResolvedValue({
			pagination: { limit: 10, offset: 0, count: 1, total: 1 },
			data: [{ code: 'USD', symbol: '$', name: 'US Dollar' }],
		});

		const result = await listCurrencies(makeCtx(), { limit: 10, offset: 0 });

		expect(mockRequest).toHaveBeenCalledWith('currencies', 'test-key', {
			query: { limit: 10, offset: 0 },
		});
		expect(result.data[0]?.code).toBe('USD');
	});
});
