import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2/sandboxes' },
		{
			url: 'https://api.e2b.app/v2/sandboxes',
			ok: false,
			status,
			statusText: 'Provider error',
			body: { code: status, message: 'E2B API error' },
		},
		`E2B API returned ${status}`,
		{ retryAfter },
	);
}

describe('E2B error handlers', () => {
	it('recognizes 429 responses and respects Retry-After', async () => {
		const error = apiError(429, 4000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 4000,
		});
	});

	it('recognizes authentication and permission errors without retrying', async () => {
		for (const status of [401, 403]) {
			const error = apiError(status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not retry non-rate-limit provider errors', async () => {
		const error = apiError(500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not treat a 429 inside an error message as a rate limit', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/sandboxes/{sandboxID}' },
			{
				url: 'https://api.e2b.app/sandboxes/i429abc',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { code: 404, message: 'sandbox i429abc not found' },
			},
			'sandbox i429abc not found',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('timeout after 429 ms')),
		).toBe(false);
	});

	it('keeps the catch-all handler last', () => {
		const handlers = Object.keys(errorHandlers);
		expect(handlers.at(-1)).toBe('DEFAULT');
		expect(handlers.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			handlers.indexOf('DEFAULT'),
		);
		expect(handlers.indexOf('AUTH_ERROR')).toBeLessThan(
			handlers.indexOf('DEFAULT'),
		);
	});
});
