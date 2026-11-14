import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/record/account' },
		{
			url: 'https://api.fireberry.com/api/record/account',
			ok: false,
			status,
			statusText: '',
			body: undefined,
		},
		`Fireberry request failed with status ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Fireberry error handlers', () => {
	it('recognizes 429 and carries the provider Retry-After value without retrying writes', async () => {
		const error = apiError(429, 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});

	it('routes authentication, permission, and not-found responses without retry', async () => {
		for (const [name, status] of [
			['AUTH_ERROR', 401],
			['PERMISSION_ERROR', 403],
			['NOT_FOUND_ERROR', 404],
		] as const) {
			const error = apiError(status);
			const handler = errorHandlers[name];
			expect(handler.match(error)).toBe(true);
			await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		}
	});

	it('keeps the catch-all handler last and disables unsafe automatic retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
