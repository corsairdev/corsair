import { ApiError } from 'corsair/http';
import { WorldNewsApiError } from './client';
import { errorHandlers } from './error-handlers';

describe('World News API Error Handlers', () => {
	const mockContext = { operation: 'news.searchNews' } as any;

	describe('RATE_LIMIT_ERROR', () => {
		it('matches HTTP 429 ApiError and returns retry info', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/search-news' },
				{
					status: 429,
					statusText: 'Too Many Requests',
					ok: false,
					url: '/search-news',
					body: {},
				},
				'Rate limited',
				{ retryAfter: 2500 },
			);

			expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError, mockContext)).toBe(
				true,
			);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				apiError,
				mockContext,
			);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(2500);
		});

		it('matches WorldNewsApiError with 429 status', () => {
			const wnError = new WorldNewsApiError(
				'Too many requests',
				429,
				'RATE_LIMIT',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(wnError, mockContext)).toBe(
				true,
			);
		});
	});

	describe('QUOTA_ERROR', () => {
		it('matches HTTP 402 and does not retry', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/search-news' },
				{
					status: 402,
					statusText: 'Payment Required',
					ok: false,
					url: '/search-news',
					body: {},
				},
				'Quota exceeded',
			);

			expect(errorHandlers.QUOTA_ERROR.match(apiError, mockContext)).toBe(true);
			const result = await errorHandlers.QUOTA_ERROR.handler(
				apiError,
				mockContext,
			);
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches HTTP 401 and stops retries', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/top-news' },
				{
					status: 401,
					statusText: 'Unauthorized',
					ok: false,
					url: '/top-news',
					body: {},
				},
				'Unauthorized',
			);

			expect(errorHandlers.AUTH_ERROR.match(apiError, mockContext)).toBe(true);

			const result = await errorHandlers.AUTH_ERROR.handler(
				apiError,
				mockContext,
			);
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('PERMISSION_ERROR', () => {
		it('matches HTTP 403 and stops retries', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/extract-news' },
				{
					status: 403,
					statusText: 'Forbidden',
					ok: false,
					url: '/extract-news',
					body: {},
				},
				'Forbidden',
			);

			expect(errorHandlers.PERMISSION_ERROR.match(apiError, mockContext)).toBe(
				true,
			);

			const result = await errorHandlers.PERMISSION_ERROR.handler(
				apiError,
				mockContext,
			);
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches HTTP 400 and stops retries', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/search-news' },
				{
					status: 400,
					statusText: 'Bad Request',
					ok: false,
					url: '/search-news',
					body: {},
				},
				'Bad Request: invalid parameter',
			);

			expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError, mockContext)).toBe(
				true,
			);

			const result = await errorHandlers.BAD_REQUEST_ERROR.handler(
				apiError,
				mockContext,
			);
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('DEFAULT', () => {
		it('catches all unhandled errors', async () => {
			const genericError = new Error('Unknown error');
			expect(errorHandlers.DEFAULT.match(genericError, mockContext)).toBe(true);

			const result = await errorHandlers.DEFAULT.handler(
				genericError,
				mockContext,
			);
			expect(result.maxRetries).toBe(0);
		});
	});
});
