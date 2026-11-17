import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/api/keywords/keywords_by_asin_query' },
		{
			url: 'https://developer.junglescout.com/api/keywords/keywords_by_asin_query',
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

describe('JungleScout errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and respects retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 2500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
		});
	});

	it('routes textual rate limit errors when status code is absent', () => {
		expect(route(new Error('too many requests, rate limited'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid api key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with no retries', async () => {
		expect(route(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('record_not_found'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 422 to VALIDATION_ERROR with no retries', async () => {
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'VALIDATION_ERROR',
		);
		expect(route(new Error('validation_error occurred'))).toBe(
			'VALIDATION_ERROR',
		);
		await expect(errorHandlers.VALIDATION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(new Error('invalid parameter value'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 5xx errors to SERVER_ERROR with safe read retries', async () => {
		expect(route(apiError(500, 'Internal Server Error'))).toBe('SERVER_ERROR');
		expect(route(apiError(502, 'Bad Gateway'))).toBe('SERVER_ERROR');
		expect(route(apiError(503, 'Service Unavailable'))).toBe('SERVER_ERROR');
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 2,
		});
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const unknownError = new Error('Some unexpected failure');
		expect(route(unknownError)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
