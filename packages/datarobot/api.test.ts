import { DatarobotAPIError, makeDatarobotRequest } from './client';
import { endpointContractCases } from './endpoint-contract-cases';
import * as EndpointGroups from './endpoints';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeDatarobotRequest: jest.fn().mockResolvedValue({}),
	};
});

const mockRequest = jest.mocked(makeDatarobotRequest);

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function createContext() {
	return {
		key: 'test_token',
		authType: 'api_key' as const,
		options: { key: 'test_token', baseUrl: 'https://app.datarobot.com' },
	};
}

const groups = EndpointGroups as unknown as Record<
	string,
	Record<string, AnyEndpoint>
>;

describe('DataRobot endpoint contracts', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({});
	});

	it.each(
		endpointContractCases.map((c) => ({ ...c, name: `${c.mod}.${c.fn}` })),
	)('$name calls $method $endpoint', async (c) => {
		const fn = groups[c.mod]?.[c.fn];
		expect(fn).toBeDefined();
		const ctx = createContext();
		await fn!(ctx, c.input);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [path, key, options] = mockRequest.mock.calls[0]!;
		expect(path).toBe(c.endpoint);
		expect(key).toBe(ctx);
		expect(options?.method ?? 'GET').toBe(c.method);
		expect(options?.query).toBeUndefined();
		if (
			'expectedBody' in c &&
			c.expectedBody &&
			Object.keys(c.expectedBody).length > 0
		) {
			expect(options?.body).toEqual(c.expectedBody);
		} else {
			expect(options?.body).toBeUndefined();
		}
	});

	it('covers every remaining operation', () => {
		expect(endpointContractCases).toHaveLength(107);
	});
});

describe('DataRobot error handlers', () => {
	it('retries on HTTP 429', async () => {
		const err = Object.assign(new DatarobotAPIError('too many requests'), {
			status: 429,
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result.maxRetries).toBe(5);
	});

	it('does not retry on HTTP 401', async () => {
		const err = Object.assign(new DatarobotAPIError('unauthorized'), {
			status: 401,
		});
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(err);
		expect(result.maxRetries).toBe(0);
	});
});
