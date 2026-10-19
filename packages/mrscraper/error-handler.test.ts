import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/results' },
		{
			url: 'https://api.app.mrscraper.com/api/v1/results',
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

describe('Mrscraper errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and respects retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});
	});

	it('routes text rate limit errors when no status is present', () => {
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('429 rate limit exceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('does not route a message that merely contains the digits 429', () => {
		const error = apiError(500, 'task 429 was aborted');
		expect(route(error)).toBe('DEFAULT');
	});

	it('still routes a genuine ApiError with status 429 to RATE_LIMIT_ERROR', () => {
		expect(route(apiError(429, 'Slow down'))).toBe('RATE_LIMIT_ERROR');
	});

	it('does not retry a non-429 ApiError whose message mentions rate limit', () => {
		// A 500 body quoting "rate limit" must not make scrape.* POSTs retry:
		// each retry can start another billed scrape.
		const error = apiError(500, 'upstream rate limit tripped');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(route(error)).toBe('DEFAULT');
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
