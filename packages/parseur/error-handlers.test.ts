import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/parser' },
		{
			url: 'https://api.parseur.com/parser',
			ok: false,
			status,
			statusText: 'Error',
			body: { detail: message },
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

describe('Parseur errorHandlers', () => {
	it('routes 429 status to RATE_LIMIT_ERROR with headersRetryAfterMs', async () => {
		const error = apiError(429, 'Too Many Requests', 2500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2500,
		});
	});

	it('routes rate limit message string to RATE_LIMIT_ERROR', () => {
		expect(route(new Error('Rate limit exceeded'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('Too many requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR with 0 retries', async () => {
		const error401 = apiError(401, 'Unauthorized');
		const error403 = apiError(403, 'Forbidden');

		expect(route(error401)).toBe('AUTH_ERROR');
		expect(route(error403)).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('routes auth failure message string to AUTH_ERROR', () => {
		expect(
			route(new Error('Authentication credentials were not provided')),
		).toBe('AUTH_ERROR');
		expect(route(new Error('Invalid token'))).toBe('AUTH_ERROR');
	});

	it('routes 404 to NOT_FOUND_ERROR', async () => {
		const error = apiError(404, 'Not found');
		expect(route(error)).toBe('NOT_FOUND_ERROR');
		expect(await errorHandlers.NOT_FOUND_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to VALIDATION_ERROR', async () => {
		const error = apiError(400, 'Bad Request');
		expect(route(error)).toBe('VALIDATION_ERROR');
		expect(await errorHandlers.VALIDATION_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown 500 server errors to DEFAULT handler with 0 retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		expect(await errorHandlers.DEFAULT.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
