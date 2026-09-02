import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/projects' },
		{ url: '/projects', ok: false, status, statusText: 'Error', body: {} },
		`request failed with status ${status}`,
		{ retryAfter },
	);
}

describe('AppVeyor error handlers', () => {
	it('routes 429 errors and preserves Retry-After', async () => {
		const error = apiError(429, 1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not retry authentication failures', async () => {
		const error = apiError(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('uses the default handler for unrelated errors', async () => {
		const error = new Error('unexpected failure');
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		expect(await errorHandlers.DEFAULT.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
