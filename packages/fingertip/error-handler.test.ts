import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/ping' },
		{
			url: 'https://api.fingertip.com/v1/ping',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Fingertip error handlers', () => {
	it('routes 429 to one bounded retry and honors Retry-After', async () => {
		const error = apiError(429, 'Too Many Requests', 4000);
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(handler?.match(error)).toBe(true);
		await expect(handler?.handler(error)).resolves.toMatchObject({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 4000,
		});
	});

	it('does not retry unauthorized or forbidden responses', async () => {
		for (const status of [401, 403]) {
			const error = apiError(status, 'Authentication failed');
			const handler = errorHandlers.AUTH_ERROR;
			expect(handler?.match(error)).toBe(true);
			await expect(handler?.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('leaves server failures to DEFAULT without retries', async () => {
		const error = apiError(503, 'Service Unavailable');
		const handler = errorHandlers.DEFAULT;
		expect(handler?.match()).toBe(true);
		await expect(handler?.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not classify unrelated errors as rate limits', () => {
		const error = new Error('connection failed');
		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error)).toBe(false);
	});
});
