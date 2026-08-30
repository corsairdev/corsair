import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/organisation' },
		{
			url: 'https://api.streamtime.net/v2/organisation',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Streamtime errorHandlers', () => {
	it('routes a 429 Too Many Requests to RATE_LIMIT_ERROR and keeps retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes rate-limit message text without a status', () => {
		expect(route(new Error('Too Many Requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 to AUTH_ERROR', () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		expect(await errorHandlers.DEFAULT.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
