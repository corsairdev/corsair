import { ApiError } from 'corsair/http';
import { PostmanAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(
	statusText: string,
	status: number,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'collections' },
		{
			url: 'https://api.getpostman.com/collections',
			ok: false,
			status,
			statusText,
			body: { error: { name: 'error', message: statusText } },
		},
		statusText,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Postman error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches ApiError 429s and forwards Retry-After without framework replays', async () => {
			const error = apiError('Too Many Requests', 429, 2500);

			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			// The transport owns 429 retries; the framework must not replay,
			// especially non-idempotent write bodies.
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(error),
			).resolves.toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 2500,
			});
		});

		it('matches PostmanAPIError 429s carrying transport retry data', async () => {
			const error = new PostmanAPIError('Too Many Requests', {
				cause: apiError('Too Many Requests', 429, 1500),
			});

			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(error),
			).resolves.toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 1500,
			});
		});

		it('matches rate-limit messages without a Retry-After header', async () => {
			const error = new Error('Rate limited: too many requests');

			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(error),
			).resolves.toEqual({
				maxRetries: 0,
				headersRetryAfterMs: undefined,
			});
		});

		it('does not match unrelated client errors', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(apiError('Bad Request', 400)),
			).toBe(false);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('task failed')),
			).toBe(false);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401s with no retries', async () => {
			const error = apiError('Unauthorized', 401);

			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('matches invalid-key messages without a status', () => {
			expect(errorHandlers.AUTH_ERROR.match(new Error('Invalid API key'))).toBe(
				true,
			);
		});

		it('does not match other statuses', () => {
			expect(errorHandlers.AUTH_ERROR.match(apiError('Forbidden', 403))).toBe(
				false,
			);
		});
	});

	describe('PERMISSION_ERROR', () => {
		it('matches 403s with no retries', async () => {
			const error = apiError('Forbidden', 403);

			expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.PERMISSION_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('does not match other statuses', () => {
			expect(
				errorHandlers.PERMISSION_ERROR.match(apiError('Unauthorized', 401)),
			).toBe(false);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404s with no retries', async () => {
			const error = apiError('Not Found', 404);

			expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('does not match server errors', () => {
			expect(
				errorHandlers.NOT_FOUND_ERROR.match(
					apiError('Internal Server Error', 500),
				),
			).toBe(false);
		});
	});

	describe('DEFAULT', () => {
		it('catches everything else without retries', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});
});
