import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/pullzone' },
		{
			url: 'https://api.bunny.net/pullzone',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('bunnycdn error handlers', () => {
	it('matches 429 responses as rate limit errors', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many Requests')),
		).toBe(true);
	});

	it('matches rate_limited message text as rate limit errors', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
	});

	it('does not match 401 responses as rate limit errors', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(401, 'Unauthorized')),
		).toBe(false);
	});

	it('rate limit handler retries up to 5 times', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429, 'Too Many Requests'),
		);
		expect(result.maxRetries).toBe(5);
	});

	it('rate limit handler forwards retryAfter when present', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429, 'Too Many Requests', 2000),
		);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(2000);
	});

	it('matches 401 responses as auth errors', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401, 'Unauthorized'))).toBe(
			true,
		);
	});

	it('matches invalid_auth message text as auth errors', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('invalid_auth'))).toBe(
			true,
		);
	});

	it('auth handler does not retry', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('matches 404 responses as not-found errors', () => {
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(apiError(404, 'Not Found')),
		).toBe(true);
	});

	it('not-found handler does not retry', async () => {
		const result = await errorHandlers.NOT_FOUND_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('falls through to the default handler for server errors', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});
});
