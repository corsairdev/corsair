import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { ApiResult } from '../async-core/ApiResult';
import { handleCorsairError } from '../core/errors/handler';
import { errorHandlers as slackErrorHandlers } from '../plugins/slack/error-handlers';
import { errorHandlers as linearErrorHandlers } from '../plugins/linear/error-handlers';

function createMockApiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	const mockRequest: ApiRequestOptions = {
		method: 'GET',
		url: 'https://api.example.com/test',
	};
	const mockResponse: ApiResult = {
		url: 'https://api.example.com/test',
		ok: false,
		status,
		statusText: 'Error',
		body: { error: message },
	};
	return new ApiError(mockRequest, mockResponse, message, {
		retryAfter,
	});
}

describe('Error Handlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Slack Plugin Error Handlers', () => {
		describe('RATE_LIMIT_ERROR with retry-after headers', () => {
			it('should extract retryAfter from ApiError and set headersRetryAfterMs', async () => {
				const error = createMockApiError(429, 'rate_limited', 60);

				const result = await handleCorsairError(
					error,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);

				expect(result.maxRetries).toBe(5);
				expect(result.headersRetryAfterMs).toBe(60);
			});

			it('should handle different retryAfter values', async () => {
				const error1 = createMockApiError(429, 'rate_limited', 30);
				const result1 = await handleCorsairError(
					error1,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);
				expect(result1.headersRetryAfterMs).toBe(30);

				const error2 = createMockApiError(429, 'rate_limited', 120);
				const result2 = await handleCorsairError(
					error2,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);
				expect(result2.headersRetryAfterMs).toBe(120);

				const error3 = createMockApiError(429, 'rate_limited', 1);
				const result3 = await handleCorsairError(
					error3,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);
				expect(result3.headersRetryAfterMs).toBe(1);
			});

			it('should set headersRetryAfterMs to undefined when retryAfter is not provided', async () => {
				const error = createMockApiError(429, 'rate_limited');

				const result = await handleCorsairError(
					error,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);

				expect(result.maxRetries).toBe(5);
				expect(result.headersRetryAfterMs).toBeUndefined();
			});

			it('should not set headersRetryAfterMs when error is not an ApiError instance', async () => {
				const error = new Error('rate_limited');

				const result = await handleCorsairError(
					error,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);

				expect(result.maxRetries).toBe(5);
				expect(result.headersRetryAfterMs).toBeUndefined();
			});

			it('should handle rate limit error with "ratelimited" message', async () => {
				const error = createMockApiError(429, 'ratelimited', 45);

				const result = await handleCorsairError(
					error,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);

				expect(result.maxRetries).toBe(5);
				expect(result.headersRetryAfterMs).toBe(45);
			});

			it('should handle rate limit error with "429" in message', async () => {
				const error = createMockApiError(429, 'Error 429: Too many requests', 90);

				const result = await handleCorsairError(
					error,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);

				expect(result.maxRetries).toBe(5);
				expect(result.headersRetryAfterMs).toBe(90);
			});

			it('should handle rate limit error with zero retryAfter', async () => {
				const error = createMockApiError(429, 'rate_limited', 0);

				const result = await handleCorsairError(
					error,
					'slack',
					'channels.list',
					{},
					slackErrorHandlers,
				);

				expect(result.maxRetries).toBe(5);
				expect(result.headersRetryAfterMs).toBe(0);
			});
		});

		it('should handle AUTH_ERROR', async () => {
			const error = new Error('invalid_auth');

			const result = await handleCorsairError(
				error,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});

		it('should handle PERMISSION_ERROR', async () => {
			const error = createMockApiError(403, 'missing_scope');

			const result = await handleCorsairError(
				error,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});

		it('should handle NETWORK_ERROR', async () => {
			const error = new Error('ECONNREFUSED network error');

			const result = await handleCorsairError(
				error,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(3);
		});

		it('should handle DEFAULT error handler', async () => {
			const error = new Error('Unknown error type');

			const result = await handleCorsairError(
				error,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});
	});

	describe('Linear Plugin Error Handlers', () => {
		it('should handle RATE_LIMIT_ERROR', async () => {
			const error = createMockApiError(429, 'rate limit exceeded', 30);

			const result = await handleCorsairError(
				error,
				'linear',
				'issues.list',
				{},
				linearErrorHandlers,
			);

			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(30);
		});

		it('should handle AUTH_ERROR', async () => {
			const error = createMockApiError(401, 'unauthorized');

			const result = await handleCorsairError(
				error,
				'linear',
				'issues.list',
				{},
				linearErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});

		it('should handle PERMISSION_ERROR', async () => {
			const error = createMockApiError(403, 'permission denied');

			const result = await handleCorsairError(
				error,
				'linear',
				'issues.list',
				{},
				linearErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});

		it('should handle NETWORK_ERROR', async () => {
			const error = new Error('ENOTFOUND connection failed');

			const result = await handleCorsairError(
				error,
				'linear',
				'issues.list',
				{},
				linearErrorHandlers,
			);

			expect(result.maxRetries).toBe(3);
		});

		it('should handle DEFAULT error handler', async () => {
			const error = new Error('Unexpected error');

			const result = await handleCorsairError(
				error,
				'linear',
				'issues.list',
				{},
				linearErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});
	});

	describe('Error Handler Priority', () => {
		it('should prioritize specific error handlers over DEFAULT', async () => {
			const rateLimitError = createMockApiError(429, 'rate_limited');

			const result = await handleCorsairError(
				rateLimitError,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(5);
		});

		it('should fall back to DEFAULT when no specific handler matches', async () => {
			const unknownError = new Error('Some unknown error type');

			const result = await handleCorsairError(
				unknownError,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});
	});

	describe('Error Handler Matching', () => {
		it('should match RATE_LIMIT_ERROR by status code', async () => {
			const error = createMockApiError(429, 'Too many requests');

			const result = await handleCorsairError(
				error,
				'linear',
				'issues.list',
				{},
				linearErrorHandlers,
			);

			expect(result.maxRetries).toBe(5);
		});

		it('should match AUTH_ERROR by status code', async () => {
			const error = createMockApiError(401, 'Unauthorized');

			const result = await handleCorsairError(
				error,
				'linear',
				'issues.list',
				{},
				linearErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});

		it('should match PERMISSION_ERROR by status code', async () => {
			const error = createMockApiError(403, 'Forbidden');

			const result = await handleCorsairError(
				error,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(0);
		});

		it('should match NETWORK_ERROR by error message', async () => {
			const error = new Error('ETIMEDOUT connection timeout');

			const result = await handleCorsairError(
				error,
				'slack',
				'channels.list',
				{},
				slackErrorHandlers,
			);

			expect(result.maxRetries).toBe(3);
		});
	});
});
