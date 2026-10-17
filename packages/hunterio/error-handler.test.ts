import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/account' },
		{
			url: 'https://api.hunter.io/v2/account',
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

describe('Hunterio errorHandlers', () => {
	it('routes 403 throttles to RATE_LIMIT_ERROR and respects Retry-After', async () => {
		const error = apiError(403, 'Forbidden', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('routes 403 without Retry-After to a retrying handler with no header delay', async () => {
		const error = apiError(403, 'Forbidden');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
		});
	});

	it('routes 429 quota exhaustion to INSUFFICIENT_CREDITS_ERROR with no retries', async () => {
		const error = apiError(429, 'Too Many Requests');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes text rate limit and quota errors when status is absent', () => {
		expect(route(new Error('Too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('rate limit exceeded'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('insufficient credits for this operation'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		expect(route(new Error('plan limit reached'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
	});

	it('routes 401 and auth messages to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid api key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR', async () => {
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
