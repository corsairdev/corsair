import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeUniswapApiRequest, UniswapApiAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { uniswapapi } from './index';

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

	it('authenticates with x-api-key and does not set a bearer TOKEN', async () => {
		mockedRequest.mockResolvedValueOnce({ requestId: 'req-1' });

		await makeUniswapApiRequest('/v1/orders', 'test-api-key');

		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					'x-api-key': 'test-api-key',
				}),
			}),
			expect.anything(),
		);
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

	it('does not treat an unrelated message that mentions 429 as a rate limit', () => {
		const error = new UniswapApiAPIError('order 429 is not a valid status');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});
});

describe('keyBuilder', () => {
	function getKeyBuilder(plugin: ReturnType<typeof uniswapapi>) {
		return plugin.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string>;
	}

	it('returns an explicit option key', async () => {
		const keyBuilder = getKeyBuilder(uniswapapi({ key: 'explicit-key' }));
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: jest.fn() },
				},
				'endpoint',
			),
		).resolves.toBe('explicit-key');
	});

	it('returns the stored api key', async () => {
		const keyBuilder = getKeyBuilder(uniswapapi());
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				},
				'endpoint',
			),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key is available', async () => {
		const keyBuilder = getKeyBuilder(uniswapapi());
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
