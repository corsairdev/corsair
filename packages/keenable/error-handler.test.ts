import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v1/search' },
		{
			url: 'https://api.keenable.ai/v1/search',
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

describe('Keenable errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and respects retryAfter', async () => {
		const error = apiError(429, 'Rate limit exceeded', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('keeps headersRetryAfterMs undefined when no Retry-After was sent', async () => {
		const error = apiError(429, 'Rate limit exceeded');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: undefined,
		});
	});

	it('routes 402 to INSUFFICIENT_CREDITS_ERROR with no retries', async () => {
		const error = apiError(402, 'No credits available');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes text credit errors when status is absent', () => {
		expect(route(new Error('insufficient credits for this operation'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
		expect(route(new Error('Insufficient credits available'))).toBe(
			'INSUFFICIENT_CREDITS_ERROR',
		);
	});

	it('checks credit exhaustion before the 429 retry branch', () => {
		const error = apiError(429, 'Insufficient credits for this operation');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
	});

	it('routes text rate limit errors when status is absent', () => {
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('Rate limit exceeded'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'API key disabled or revoked'))).toBe(
			'AUTH_ERROR',
		);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes text auth errors when status is absent', () => {
		expect(route(new Error('Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid api key format'))).toBe('AUTH_ERROR');
		expect(route(new Error('Forbidden'))).toBe('AUTH_ERROR');
	});

	it('routes 400 to BAD_REQUEST_ERROR', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(new Error('Missing app identifier'))).toBe(
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

	it('specific handlers do not match unrelated errors', () => {
		const error = apiError(500, 'Internal Server Error');
		expect(errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(error)).toBe(false);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('does not route a non-429 ApiError whose message mentions 429 to RATE_LIMIT_ERROR', () => {
		const error = apiError(
			500,
			'Upstream gateway returned 429 too many requests',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});
});
