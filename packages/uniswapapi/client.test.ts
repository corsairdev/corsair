import { ApiError, request } from 'corsair/http';
import { makeUniswapApiRequest, UniswapApiAPIError } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockedRequest = request as jest.MockedFunction<typeof request>;

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/orders' },
		{
			url: 'https://trade-api.gateway.uniswap.org/v1/orders',
			ok: false,
			status,
			statusText: 'Too Many Requests',
			body: {
				detail: 'Please slow down before trying again.',
				errorCode: 'TOO_MANY_REQUESTS',
			},
		},
		'Please slow down before trying again.',
		{ retryAfter },
	);
}

async function captureError(promise: Promise<unknown>) {
	try {
		await promise;
	} catch (error) {
		return error as UniswapApiAPIError;
	}
	throw new Error('expected the request to reject');
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeUniswapApiRequest', () => {
	it('preserves status and retryAfter on wrapped ApiError', async () => {
		mockedRequest.mockRejectedValueOnce(apiError(429, 2500));

		const error = await captureError(
			makeUniswapApiRequest('/v1/orders', 'key'),
		);

		expect(error).toBeInstanceOf(UniswapApiAPIError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2500);
		expect(error.code).toBe('TOO_MANY_REQUESTS');
	});

	it('falls back to the HTTP status as code when no errorCode is present', async () => {
		mockedRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/v1/orders' },
				{
					url: 'https://trade-api.gateway.uniswap.org/v1/orders',
					ok: false,
					status: 500,
					statusText: 'Internal Server Error',
					body: { detail: 'Something went wrong.' },
				},
				'Something went wrong.',
			),
		);

		const error = await captureError(
			makeUniswapApiRequest('/v1/orders', 'key'),
		);

		expect(error.status).toBe(500);
		expect(error.message).toBe('Something went wrong.');
		expect(error.code).toBe('500');
	});

	it('wraps non-HTTP errors while keeping their message', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('network down'));

		const error = await captureError(
			makeUniswapApiRequest('/v1/orders', 'key'),
		);

		expect(error).toBeInstanceOf(UniswapApiAPIError);
		expect(error.status).toBeUndefined();
		expect(error.retryAfter).toBeUndefined();
		expect(error.message).toBe('network down');
	});
});

describe('errorHandlers', () => {
	it('routes a wrapped 429 without relying on message text', async () => {
		mockedRequest.mockRejectedValueOnce(apiError(429, 2500));
		const error = await captureError(
			makeUniswapApiRequest('/v1/orders', 'key'),
		);

		expect(error.message).not.toContain('429');
		expect(error.message).not.toContain('rate_limited');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2500,
		});
	});
});
