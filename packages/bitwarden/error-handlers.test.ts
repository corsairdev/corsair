import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'failed', retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/public/organizations' },
		{
			url: 'https://api.bitwarden.com/public/organizations',
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
	it('routes a 429 to the rate-limit handler and retries', async () => {
		const error = apiError(429, 'too many requests', 1500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes rate_limited message text to the rate-limit handler', () => {
		expect(route(new Error('rate_limited'))).toBe('RATE_LIMIT_ERROR');
	});

	it('treats 401 as an auth failure that must not be retried', async () => {
		const error = apiError(401, 'unauthorized');

		expect(route(error)).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('routes unauthorized message text to the auth handler', () => {
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
