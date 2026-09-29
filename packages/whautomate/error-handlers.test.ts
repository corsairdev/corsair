import { ApiError } from 'corsair/http';
import { WhautomateAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'failed', retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/contacts' },
		{
			url: 'https://api.whautomate.com/v1/contacts',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
		{ retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('errorHandlers', () => {
	it('routes a 429 to RATE_LIMIT_ERROR without plugin-level retries', async () => {
		const error = new WhautomateAPIError(
			'slow down',
			'429',
			undefined,
			429,
			2000,
		);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2000,
		});
	});

	it('routes an ApiError 429 to RATE_LIMIT_ERROR', async () => {
		const error = apiError(429, 'too many requests', 1500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes rate_limited message text to RATE_LIMIT_ERROR', () => {
		expect(route(new Error('rate_limited'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes a 401 to AUTH_ERROR', async () => {
		const error = new WhautomateAPIError('nope', '401', undefined, 401);

		expect(route(error)).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('routes unauthorized message text to AUTH_ERROR', () => {
		expect(route(new Error('Request unauthorized'))).toBe('AUTH_ERROR');
	});

	it('falls back to DEFAULT for errors with no status or known message', async () => {
		const error = new Error('socket hang up');

		expect(route(error)).toBe('DEFAULT');
		expect(await errorHandlers.DEFAULT.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
