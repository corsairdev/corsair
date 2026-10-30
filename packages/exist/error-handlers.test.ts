import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: 'attributes/update/' },
		{
			url: 'https://exist.io/api/2/attributes/update/',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: 'Error' },
		},
		'Error',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('exist error handlers', () => {
	it('does not retry rate-limited writes because increments are delta-based', async () => {
		const error = apiError(429, 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual(
			expect.objectContaining({
				maxRetries: 0,
				headersRetryAfterMs: 2500,
			}),
		);
	});

	it('does not retry auth or permission failures', async () => {
		const ctx = { operation: 'test' } as never;
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		await expect(
			errorHandlers.AUTH_ERROR.handler(apiError(401), ctx),
		).resolves.toEqual({ maxRetries: 0 });
		expect(errorHandlers.PERMISSION_ERROR.match(apiError(403))).toBe(true);
		await expect(
			errorHandlers.PERMISSION_ERROR.handler(apiError(403), ctx),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
