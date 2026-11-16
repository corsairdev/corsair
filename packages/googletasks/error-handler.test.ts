import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/tasks/v1/users/@me/lists' },
		{
			url: 'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
			ok: false,
			status,
			statusText: 'Google API error',
			body: { error: { code: status, status: 'FAILED_PRECONDITION' } },
		},
		'Google API error',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Google Tasks error handlers', () => {
	it('matches a 429 and carries the Retry-After delay to bounded endpoint retries', async () => {
		const error = apiError(429, 2750);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2750,
		});
	});

	it.each([401, 403])(
		'stops authorization failures for HTTP %i',
		async (status) => {
			const error = apiError(status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each([400, 404, 422, 500, 503])(
		'keeps non-rate provider errors out of the 429 retry path for HTTP %i',
		async (status) => {
			const error = apiError(status);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
			await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);
});
