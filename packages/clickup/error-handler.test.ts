import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function rateLimitError(): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/list/1/task' },
		{
			status: 429,
			statusText: 'Too Many Requests',
			ok: false,
			url: '/list/1/task',
			body: {},
		},
		'Too Many Requests',
		{ retryAfter: 3000 },
	);
}

function authError(): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/team' },
		{
			status: 401,
			statusText: 'Unauthorized',
			ok: false,
			url: '/team',
			body: {},
		},
		'Unauthorized',
	);
}

describe('ClickUp error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches HTTP 429 ApiError and returns retry info', async () => {
			const apiError = rateLimitError();

			expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(apiError);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(3000);
		});

		it('matches rate limit messages without a status code', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
			).toBe(true);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('nope'))).toBe(
				false,
			);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches HTTP 401 ApiError with no retries', async () => {
			const apiError = authError();

			expect(errorHandlers.AUTH_ERROR.match(apiError)).toBe(true);

			const result = await errorHandlers.AUTH_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});

		it('matches invalid auth messages', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('invalid_auth token')),
			).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(new Error('nope'))).toBe(false);
		});
	});

	describe('DEFAULT', () => {
		it('matches everything with no retries', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);

			const result = await errorHandlers.DEFAULT.handler();
			expect(result.maxRetries).toBe(0);
		});
	});
});
