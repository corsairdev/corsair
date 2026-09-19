import { ApiError } from 'corsair/http';
import { GladiaAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2/live' },
		{
			url: 'https://api.gladia.io/v2/live',
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'Error' },
		},
		'Error',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('Gladia error handlers', () => {
	it('does not retry rate-limited requests because writes are billable', async () => {
		const error = apiError(429, 2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual(
			expect.objectContaining({
				maxRetries: 0,
				headersRetryAfterMs: 2000,
			}),
		);
	});

	it('preserves retryAfter on wrapped ApiError 429s', async () => {
		const wrapped = new GladiaAPIError(
			'Too Many Requests',
			apiError(429, 3000),
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(wrapped),
		).resolves.toEqual(
			expect.objectContaining({
				maxRetries: 0,
				headersRetryAfterMs: 3000,
			}),
		);
	});

	it('does not retry auth failures from either error type', async () => {
		const raw = apiError(401);
		const wrapped = new GladiaAPIError('Unauthorized', apiError(401));
		expect(errorHandlers.AUTH_ERROR.match(raw)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
