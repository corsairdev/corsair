import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'gift/v1/gifts/g1' },
		{
			url: 'gift/v1/gifts/g1',
			ok: false,
			status,
			statusText: `status ${status}`,
			body: { message: `failure ${status}` },
		},
		`Request failed (${status})`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Blackbaud error handlers', () => {
	it('matches 429 rate-limit errors and retries with the retry-after hint', async () => {
		const error = apiError(429, 2000);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBe(2000);
	});

	it('matches rate-limit message text without ApiError metadata', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('matches 401 auth errors without retries', async () => {
		const error = apiError(401);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const strategy = await errorHandlers.AUTH_ERROR.handler(error);
		expect(strategy.maxRetries).toBe(0);
	});

	it('matches unauthorized message text', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('matches 404 not-found errors without retries', async () => {
		const error = apiError(404);

		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		const strategy = await errorHandlers.NOT_FOUND_ERROR.handler(error);
		expect(strategy.maxRetries).toBe(0);
	});

	it('falls through to DEFAULT for unexpected errors', async () => {
		const error = new Error('something else broke');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		const strategy = await errorHandlers.DEFAULT.handler(error);
		expect(strategy.maxRetries).toBe(0);
	});
});
