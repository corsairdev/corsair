import { ApiError } from 'corsair/http';
import { LeexiAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError429(retryAfter = 12): ApiError {
	return Object.setPrototypeOf(
		{ status: 429, statusText: 'Too Many Requests', retryAfter },
		ApiError.prototype,
	) as ApiError;
}

describe('Leexi error handlers', () => {
	it('matches typed 429 errors and honors retry-after', async () => {
		const error = apiError429(12);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 12 });
	});

	it('matches 429 on the plugin error type carrying retry metadata', async () => {
		const error = new LeexiAPIError('Too Many Requests', {
			cause: apiError429(7),
		});
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 7 });
	});

	it('matches rate limit phrasing without a typed status', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new Error('HTTP 503: too many requests'),
			),
		).toBe(true);
	});

	it('does not match unrelated errors as rate limits', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('routes 401 and 403 auth failures to zero retries', async () => {
		const unauthorized = new LeexiAPIError('Unauthorized', {
			cause: Object.setPrototypeOf(
				{ status: 401 },
				ApiError.prototype,
			) as ApiError,
		});
		const forbidden = new LeexiAPIError('Forbidden', {
			cause: Object.setPrototypeOf(
				{ status: 403 },
				ApiError.prototype,
			) as ApiError,
		});
		expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 402 payment-required errors to zero retries', async () => {
		const paymentRequired = new LeexiAPIError('Payment Required', {
			cause: Object.setPrototypeOf(
				{ status: 402 },
				ApiError.prototype,
			) as ApiError,
		});
		expect(errorHandlers.PAYMENT_REQUIRED_ERROR.match(paymentRequired)).toBe(
			true,
		);
		await expect(
			errorHandlers.PAYMENT_REQUIRED_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('defaults unknown errors to zero retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
