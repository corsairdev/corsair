import { ApiError } from 'corsair/http';
import { DadataruAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError429(retryAfter = 12): ApiError {
	return Object.setPrototypeOf(
		{ status: 429, statusText: 'Too Many Requests', retryAfter },
		ApiError.prototype,
	) as ApiError;
}

describe('Dadataru error handlers', () => {
	it('matches typed 429 errors and honors retry-after', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		const error = apiError429(12);
		expect(handler.match(error)).toBe(true);
		await expect(handler.handler(error)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 12,
		});
	});

	it('matches 429 on the plugin error type carrying retry metadata', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		const error = new DadataruAPIError('Too Many Requests', {
			cause: apiError429(7),
		});
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7);
		expect(handler.match(error)).toBe(true);
		await expect(handler.handler(error)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 7,
		});
	});

	it('matches rate limit phrasing without typed status', async () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new Error('HTTP 503: too many requests'),
			),
		).toBe(true);
	});

	it('does not match unrelated errors as rate limits', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('routes auth failures to zero retries', async () => {
		const error = new DadataruAPIError('Unauthorized', {
			cause: Object.setPrototypeOf(
				{ status: 401 },
				ApiError.prototype,
			) as ApiError,
		});
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const handler = errorHandlers.AUTH_ERROR.handler as (
			e: Error,
		) => Promise<unknown>;
		await expect(handler(error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('defaults unknown errors to zero retries', async () => {
		const match = errorHandlers.DEFAULT.match as (e: Error) => boolean;
		expect(match(new Error('anything'))).toBe(true);
		const handler = errorHandlers.DEFAULT.handler as (
			e: Error,
		) => Promise<unknown>;
		await expect(handler(new Error('anything'))).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
