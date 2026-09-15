import { ApiError } from 'corsair/http';
import { CarboneAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/status' },
		{
			url: 'https://api.carbone.io/status',
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'Error' },
		},
		'Error',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('Carbone errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 status or message', () => {
			const errWithStatus = apiError(429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(errWithStatus)).toBe(true);

			const errWrapped = new CarboneAPIError('Too many requests', 429, {
				cause: apiError(429, 2000),
			});
			expect(errorHandlers.RATE_LIMIT_ERROR.match(errWrapped)).toBe(true);

			const errWithMessage = new Error('rate limit reached');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(errWithMessage)).toBe(true);
		});

		it('returns exponential backoff retry configuration', async () => {
			const err = new CarboneAPIError('Rate limited', 429, {
				cause: apiError(429, 1500),
			});
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
			expect(result.maxRetries).toBe(3);
			expect(result.retryStrategy).toBe('exponential_backoff');
			expect(result.headersRetryAfterMs).toBe(1500);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 status or message', () => {
			const err401 = apiError(401);
			expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);

			const err403 = apiError(403);
			expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);

			const errInvalidToken = new Error('Invalid bearer token');
			expect(errorHandlers.AUTH_ERROR.match(errInvalidToken)).toBe(true);
		});

		it('returns 0 retries for auth errors', async () => {
			const result = await errorHandlers.AUTH_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404 status or not found message', () => {
			const err404 = apiError(404);
			expect(errorHandlers.NOT_FOUND_ERROR.match(err404)).toBe(true);

			const errMsg = new Error('Template not found');
			expect(errorHandlers.NOT_FOUND_ERROR.match(errMsg)).toBe(true);
		});

		it('returns 0 retries for not found errors', async () => {
			const result = await errorHandlers.NOT_FOUND_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('SERVER_ERROR', () => {
		it('matches 500+ status codes or server error messages', () => {
			const err500 = apiError(500);
			expect(errorHandlers.SERVER_ERROR.match(err500)).toBe(true);

			const err503 = apiError(503);
			expect(errorHandlers.SERVER_ERROR.match(err503)).toBe(true);
		});

		it('returns retry configuration for server errors', async () => {
			const result = await errorHandlers.SERVER_ERROR.handler();
			expect(result.maxRetries).toBe(2);
			expect(result.retryStrategy).toBe('exponential_backoff');
		});
	});

	describe('DEFAULT', () => {
		it('matches any error and returns 0 retries', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			const result = await errorHandlers.DEFAULT.handler();
			expect(result.maxRetries).toBe(0);
		});
	});
});
