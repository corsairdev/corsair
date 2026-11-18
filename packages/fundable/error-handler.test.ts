import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/company' },
		{
			url: 'https://www.tryfundable.ai/api/v1/company',
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

describe('Fundable errorHandlers', () => {
	it('routes 402 to INSUFFICIENT_CREDITS_ERROR with no retries', async () => {
		const error = apiError(402, 'Insufficient credits');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes credit exhaustion text to INSUFFICIENT_CREDITS_ERROR even on a 429', () => {
		const error = apiError(429, 'INSUFFICIENT_CREDITS');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		expect(
			route(new Error('not enough credits to complete this request')),
		).toBe('INSUFFICIENT_CREDITS_ERROR');
		expect(route(new Error('insufficient credits'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
	});

	it('routes 429 to RATE_LIMIT_ERROR and respects retryAfter', async () => {
		const error = apiError(429, 'Rate limit exceeded', 60000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 60000,
		});
	});

	it('routes 429 without retryAfter to RATE_LIMIT_ERROR with undefined delay', async () => {
		const error = apiError(429, 'Too Many Requests');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
		});
	});

	it('routes text rate limit errors when status is absent', () => {
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('rate limit exceeded'))).toBe('RATE_LIMIT_ERROR');
	});

	it('does not retry merely because a message contains "429"', () => {
		// "429" appears in the bare status string of unrelated errors; matching
		// it retried non-idempotent requests that were not rate limited.
		expect(route(new Error('company id 4291 was not found'))).toBe('DEFAULT');
	});

	it('does not route non-429 ApiErrors to RATE_LIMIT_ERROR even if message mentions rate limit', () => {
		expect(route(apiError(400, 'upstream rate limit hit'))).toBe(
			'BAD_REQUEST_ERROR',
		);
	});

	it('routes 401 and 403 to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes plan-gate codes in messages to AUTH_ERROR', () => {
		expect(route(new Error('UPGRADE_REQUIRED'))).toBe('AUTH_ERROR');
		expect(route(new Error('API_TIER_REQUIRED'))).toBe('AUTH_ERROR');
		expect(route(new Error('INACTIVE_API_KEY'))).toBe('AUTH_ERROR');
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Validation failed'))).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes validation text errors to BAD_REQUEST_ERROR', () => {
		expect(route(new Error('VALIDATION_ERROR'))).toBe('BAD_REQUEST_ERROR');
		expect(route(new Error('UNKNOWN_PARAMETER'))).toBe('BAD_REQUEST_ERROR');
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(route(new Error('something unexpected'))).toBe('DEFAULT');
	});
});
