import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { WixAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	retryAfter?: number,
	method: ApiRequestOptions['method'] = 'GET',
): ApiError {
	const req: ApiRequestOptions = { method, url: '/test' };
	const res: ApiResult = {
		url: 'https://www.wixapis.com/test',
		ok: false,
		status,
		statusText: 'error',
		body: { message: 'error' },
	};
	return new ApiError(
		req,
		res,
		`Request failed with status ${status}`,
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('Wix error handlers', () => {
	it('matches 429 as RATE_LIMIT_ERROR with retries and retry-after', async () => {
		const error = apiError(429, 2000);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(2000);
	});

	it('matches 429 without retry-after and still retries', async () => {
		const error = apiError(429);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBeUndefined();
	});

	it('matches WixAPIError wrapping a 429', async () => {
		const wrapped = new WixAPIError('Too many requests', {
			cause: apiError(429, 500),
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(wrapped);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(500);
	});

	it('matches 401 as AUTH_ERROR with no retries', async () => {
		const error = apiError(401);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches token expiry messages as AUTH_ERROR', async () => {
		const expired = new Error('token_expired: access token expired');

		expect(errorHandlers.AUTH_ERROR.match(expired)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(expired);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 403 as PERMISSION_ERROR with no retries', async () => {
		const error = apiError(403);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.PERMISSION_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 404 as NOT_FOUND_ERROR with no retries', async () => {
		const error = apiError(404);

		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.NOT_FOUND_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry POST 429 at the plugin layer', async () => {
		const error = apiError(429, 2000, 'POST');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 5xx as SERVER_ERROR with retries', async () => {
		const error = apiError(500);

		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.SERVER_ERROR.handler(error);
		expect(result.maxRetries).toBe(2);
	});

	it('does not retry POST 5xx at the plugin layer', async () => {
		const error = apiError(500, undefined, 'POST');

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.SERVER_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('falls through to DEFAULT with no retries', async () => {
		const error = new Error('something unexpected');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(error);
		expect(result.maxRetries).toBe(0);
	});
});
