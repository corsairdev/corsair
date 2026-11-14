import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/api/session' },
		{
			url: 'https://api.hyperbrowser.ai/api/session',
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

describe('Hyperbrowser errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and returns maxRetries: 0 for single-owner rate limiting', async () => {
		const error = apiError(429, 'Too Many Requests', 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes rate limit text errors to RATE_LIMIT_ERROR with no retries', async () => {
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('rate_limited'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('hit rate limit'))).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes credit exhaustion to INSUFFICIENT_CREDITS_ERROR before generic 429', async () => {
		const error = apiError(429, 'Insufficient credits for session launch');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });

		expect(route(new Error('insufficient_credits'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		expect(route(new Error('credits exhausted'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		expect(route(new Error('quota exceeded'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid api key'))).toBe('AUTH_ERROR');
		expect(route(new Error('missing api key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with no retries', async () => {
		expect(route(apiError(404, 'Session not found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('resource 404'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(route(new Error('validation error in input'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes generic 5xx server errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
