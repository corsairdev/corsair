import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function makeApiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.coassemble.com/api/v1/headless/clients' },
		{
			url: 'https://api.coassemble.com/api/v1/headless/clients',
			ok: false,
			status,
			statusText: status === 429 ? 'Too Many Requests' : 'Unauthorized',
			body: {},
		},
		status === 429 ? 'Rate limited' : 'Unauthorized',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('Coassemble errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches ApiError with status 429', () => {
			const error = makeApiError(429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches Error with rate_limited or 429 in message', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('User is RATE_LIMITED')),
			).toBe(true);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('Status code 429')),
			).toBe(true);
		});

		it('returns maxRetries: 5 with retryAfter when available', async () => {
			const error = makeApiError(429, 3000);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);

			expect(result).toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 3000,
			});
		});

		it('returns maxRetries: 5 with undefined retryAfter when not present', async () => {
			const error = new Error('rate_limited');
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);

			expect(result).toEqual({
				maxRetries: 5,
				headersRetryAfterMs: undefined,
			});
		});

		it('does not match unrelated errors', () => {
			const error = new Error('Resource not found');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches ApiError with status 401', () => {
			const error = makeApiError(401);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('matches Error with unauthorized or invalid_auth in message', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('Client UNAUTHORIZED')),
			).toBe(true);
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('Key failed: invalid_auth')),
			).toBe(true);
		});

		it('returns maxRetries: 0 for auth errors', async () => {
			const error = makeApiError(401);
			const result = await errorHandlers.AUTH_ERROR.handler(error);

			expect(result).toEqual({ maxRetries: 0 });
		});

		it('does not match rate limit errors', () => {
			const error = makeApiError(429);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		});
	});

	describe('DEFAULT', () => {
		it('matches any generic error', () => {
			const error = new Error('Something broke');
			expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		});

		it('returns maxRetries: 0 by default', async () => {
			const error = new Error('Something broke');
			const result = await errorHandlers.DEFAULT.handler(error);

			expect(result).toEqual({ maxRetries: 0 });
		});
	});
});
