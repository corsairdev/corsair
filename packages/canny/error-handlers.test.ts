import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { CannyAPIError } from './client';
import { errorHandlers } from './error-handlers';

const REQUEST_OPTIONS: ApiRequestOptions = {
	method: 'POST',
	url: '/posts/list',
};

function transportError(status: number, message: string): ApiError {
	const result: ApiResult = {
		url: 'https://canny.io/api/v1/posts/list',
		ok: false,
		status,
		statusText: message,
		body: message,
	};
	return new ApiError(REQUEST_OPTIONS, result, message);
}

describe('RATE_LIMIT_ERROR', () => {
	it('matches a raw 429 ApiError', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(transportError(429, 'slow')),
		).toBe(true);
	});

	it('matches a wrapped 429 CannyAPIError', () => {
		const wrapped = new CannyAPIError('slow', '429', { status: 429 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
	});

	it('matches rate limit message text without a status', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
	});

	it('does not match an unrelated server failure', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(transportError(500, 'boom')),
		).toBe(false);
	});

	it('retries with the provider retry-after delay', async () => {
		const wrapped = new CannyAPIError('slow', '429', {
			status: 429,
			retryAfter: 45,
		});
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(wrapped);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(45);
	});

	it('retries with default backoff when no delay is known', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new Error('HTTP 429 returned'),
		);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBeUndefined();
	});
});

describe('AUTH_ERROR', () => {
	it('matches a raw 401 ApiError', () => {
		expect(errorHandlers.AUTH_ERROR.match(transportError(401, 'nope'))).toBe(
			true,
		);
	});

	it('matches a wrapped 401 CannyAPIError', () => {
		const wrapped = new CannyAPIError('nope', '401', { status: 401 });
		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(true);
	});

	it('matches invalid key message text without a status', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('Invalid API key'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('unauthorized'))).toBe(
			true,
		);
	});

	it('does not match a rate limit as an auth failure', () => {
		expect(errorHandlers.AUTH_ERROR.match(transportError(429, 'slow'))).toBe(
			false,
		);
	});

	it('never retries auth failures', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});
});

describe('DEFAULT', () => {
	it('matches every error', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('never retries by default', async () => {
		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});
