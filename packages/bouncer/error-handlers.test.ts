import { ApiError } from 'corsair/http';
import { BouncerAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Bouncer error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 status on ApiError', () => {
			const error = new ApiError(
				{ method: 'GET', url: 'credits' },
				{
					body: {},
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					url: 'https://api.usebouncer.com/v1.1/credits',
				},
				'Rate limit exceeded',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches 429 status on BouncerAPIError', () => {
			const error = new BouncerAPIError('Rate limit exceeded', 429);
			(error as any).status = 429;
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('returns retryAfter from headers if present', async () => {
			const error = new BouncerAPIError('Rate limit exceeded', 429);
			(error as any).status = 429;
			(error as any).retryAfter = 3000;

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(3000);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 errors', () => {
			const err401 = new BouncerAPIError('Unauthorized', 401);
			(err401 as any).status = 401;
			expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);

			const err403 = new BouncerAPIError('Forbidden', 403);
			(err403 as any).status = 403;
			expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);
		});

		it('returns zero retries on auth failure', async () => {
			const err = new BouncerAPIError('Unauthorized', 401);
			const result = await errorHandlers.AUTH_ERROR.handler(err);
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('DEFAULT', () => {
		it('matches any error with 0 maxRetries', async () => {
			const err = new Error('Random internal error');
			expect(errorHandlers.DEFAULT.match(err)).toBe(true);
			const result = await errorHandlers.DEFAULT.handler(err);
			expect(result.maxRetries).toBe(0);
		});
	});
});
