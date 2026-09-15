import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string): ApiError {
	const options: ApiRequestOptions = {
		method: 'GET',
		url: '/gifs/search',
	};
	return new ApiError(
		options,
		{
			url: 'https://api.giphy.com/v1/gifs/search',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
	);
}

describe('Giphy error handlers', () => {
	it('matches a 429 rate-limit error', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Rate limit')),
		).toBe(true);
	});

	it('matches a rate-limit message without a status code', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
	});

	it('does not match a 401 error as a rate limit', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(401, 'Unauthorized')),
		).toBe(false);
	});

	it('returns retry configuration for rate limits', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429, 'Rate limit'),
		);
		expect(result.maxRetries).toBe(5);
	});

	it('forwards the transport retryAfter when present', async () => {
		const err = new ApiError(
			{ method: 'GET', url: '/gifs/search' },
			{
				url: 'https://api.giphy.com/v1/gifs/search',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Rate limit' },
			},
			'Rate limit',
			{ retryAfter: 2000 },
		);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('matches a 401 unauthorized error as an auth error', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401, 'Unauthorized'))).toBe(
			true,
		);
	});

	it('matches a 403 forbidden error as an auth error', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(403, 'Forbidden'))).toBe(
			true,
		);
	});

	it('matches an invalid-auth message without a status code', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('invalid_auth'))).toBe(
			true,
		);
	});

	it('does not retry auth errors', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('matches everything with the default handler and does not retry', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const result = await errorHandlers.DEFAULT.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});
});
