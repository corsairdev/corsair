import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

describe('Anonyflow error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('should match ApiError with status 429', () => {
			const rateLimitError = new ApiError(
				{ method: 'POST', url: '/test' },
				{
					url: '/test',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
				},
				'Rate limit exceeded',
			);

			expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError)).toBe(true);
		});

		it('should not match ApiError with other status codes', () => {
			const authError = new ApiError(
				{ method: 'POST', url: '/test' },
				{
					url: '/test',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: {},
				},
				'Unauthorized access',
			);

			expect(errorHandlers.RATE_LIMIT_ERROR.match(authError)).toBe(false);
		});

		it('should not match standard Error even if message contains 429', () => {
			const standardError = new Error(
				'Something went wrong: error code 429 rate limit exceeded',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(standardError)).toBe(false);
		});

		it('should extract retryAfter header value in handler', async () => {
			const errorWithRetry = new ApiError(
				{ method: 'POST', url: '/test' },
				{
					url: '/test',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
				},
				'Rate limit exceeded',
			);
			// Simulate retryAfter property set on ApiError
			Object.defineProperty(errorWithRetry, 'retryAfter', { value: 1500 });

			const result =
				await errorHandlers.RATE_LIMIT_ERROR.handler(errorWithRetry);
			expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 1500 });
		});

		it('should return undefined for retryAfter if header is missing', async () => {
			const errorWithoutRetry = new ApiError(
				{ method: 'POST', url: '/test' },
				{
					url: '/test',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
				},
				'Rate limit exceeded',
			);

			const result =
				await errorHandlers.RATE_LIMIT_ERROR.handler(errorWithoutRetry);
			expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });
		});
	});
});
