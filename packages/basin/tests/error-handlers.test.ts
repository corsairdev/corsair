import { ApiError } from 'corsair/http';
import { BasinAPIError } from '../client';
import { errorHandlers } from '../error-handlers';

describe('Basin error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 status code on ApiError', () => {
			const error = new ApiError(
				{ method: 'GET', url: 'https://usebasin.com/api/v1/forms' },
				{
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					url: '',
					body: {},
				},
				'Rate limited',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches 429 status code on BasinAPIError', () => {
			const error = new BasinAPIError(
				'Rate limit reached',
				'RATE_LIMITED',
				429,
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches rate limit message substring', () => {
			const error = new Error('User is rate_limited for 60 seconds');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('returns retry settings with retryAfter if present', async () => {
			const error = new ApiError(
				{ method: 'GET', url: 'https://usebasin.com/api/v1/forms' },
				{
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					url: '',
					body: {},
				},
				'Rate limited',
			);
			(error as unknown as { retryAfter: number }).retryAfter = 2000;
			const res = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(res).toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 status on ApiError', () => {
			const error = new ApiError(
				{ method: 'GET', url: 'https://usebasin.com/api/v1/forms' },
				{
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					url: '',
					body: {},
				},
				'Unauthorized',
			);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('matches 401 status on BasinAPIError', () => {
			const error = new BasinAPIError('Invalid API token', 'AUTH_ERROR', 401);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('returns maxRetries: 0', async () => {
			const error = new Error('unauthorized');
			const res = await errorHandlers.AUTH_ERROR.handler(error);
			expect(res).toEqual({ maxRetries: 0 });
		});
	});

	describe('VALIDATION_ERROR', () => {
		it('matches 422 status code on BasinAPIError', () => {
			const error = new BasinAPIError(
				'Unprocessable Entity',
				'VALIDATION_ERROR',
				422,
			);
			expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
		});

		it('returns maxRetries: 0', async () => {
			const error = new Error('validation error');
			const res = await errorHandlers.VALIDATION_ERROR.handler(error);
			expect(res).toEqual({ maxRetries: 0 });
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404 status code on BasinAPIError', () => {
			const error = new BasinAPIError('Form not found', 'NOT_FOUND', 404);
			expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		});

		it('returns maxRetries: 0', async () => {
			const error = new Error('resource not found');
			const res = await errorHandlers.NOT_FOUND_ERROR.handler(error);
			expect(res).toEqual({ maxRetries: 0 });
		});
	});

	describe('DEFAULT', () => {
		it('matches any error', () => {
			expect(errorHandlers.DEFAULT.match(new Error('something unknown'))).toBe(
				true,
			);
		});

		it('returns maxRetries: 0', async () => {
			const res = await errorHandlers.DEFAULT.handler(new Error('random'));
			expect(res).toEqual({ maxRetries: 0 });
		});
	});
});
