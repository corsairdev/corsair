import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/api/commands' },
		{
			url: 'https://acme.fibery.io/api/commands',
			ok: false,
			status,
			statusText: '',
			body: undefined,
		},
		`Fibery request failed with HTTP ${status}.`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Fibery error handlers', () => {
	it('extracts Retry-After for rate limits without automatic replays', async () => {
		const error = apiError(429, 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});

	it.each([401, 403])(
		'does not retry HTTP %i authorization failures',
		async (status) => {
			const error = apiError(status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each([400, 404, 422])(
		'classifies HTTP %i as a non-retryable request error',
		async (status) => {
			const error = apiError(status);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('does not retry writes on server errors or unknown failures', async () => {
		const error = apiError(500);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
