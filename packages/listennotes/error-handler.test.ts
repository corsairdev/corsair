import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/genres' },
		{
			url: 'https://listen-api.listennotes.com/api/v2/genres',
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

describe('Listen Notes errorHandlers', () => {
	it('preserves Retry-After but does not retry ambiguous quota 429 responses', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes text rate limit errors when status is absent', () => {
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('rate_limited'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('wrong api key'))).toBe('AUTH_ERROR');
		expect(route(new Error('account is suspended'))).toBe('AUTH_ERROR');

		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with no retries', async () => {
		expect(route(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('podcast not found'))).toBe('NOT_FOUND_ERROR');

		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(new Error('client side error: bad request'))).toBe(
			'BAD_REQUEST_ERROR',
		);

		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unhandled 500 errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
