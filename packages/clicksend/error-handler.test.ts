import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { ClickSendAPIError } from './client';
import { errorHandlers } from './error-handlers';

const baseRequest: ApiRequestOptions = {
	method: 'GET',
	url: 'account',
};

function apiResult(status: number, message: string): ApiResult {
	return {
		url: 'https://rest.clicksend.com/v3/account',
		ok: status < 400,
		status,
		statusText: message,
		body: { response_msg: message },
	};
}

describe('ClickSend error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches ApiError with status 429', () => {
			const error = new ApiError(
				baseRequest,
				apiResult(429, 'Too Many Requests'),
				'Too Many Requests',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches ClickSendAPIError with status 429', () => {
			const error = new ClickSendAPIError('Rate limited', 'THROTTLED', 429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches rate-limit message text', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(
					new Error('too many requests, slow down'),
				),
			).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(
				false,
			);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(
					new ClickSendAPIError('boom', 'SOMETHING_IS_WRONG', 500),
				),
			).toBe(false);
		});

		it('requests retries and forwards retryAfter', async () => {
			const error = new ApiError(
				baseRequest,
				apiResult(429, 'Too Many Requests'),
				'Too Many Requests',
				{ retryAfter: 2000 },
			);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(2000);
		});

		it('requests retries without retryAfter when absent', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new Error('429'),
			);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBeUndefined();
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches ApiError with status 401', () => {
			const error = new ApiError(
				baseRequest,
				apiResult(401, 'Unauthorized'),
				'Unauthorized',
			);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('matches ClickSendAPIError with status 401', () => {
			const error = new ClickSendAPIError(
				'Missing credentials',
				'MISSING_CREDENTIALS',
				401,
			);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('matches authentication message text', () => {
			expect(errorHandlers.AUTH_ERROR.match(new Error('unauthorized'))).toBe(
				true,
			);
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('invalid credentials')),
			).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(errorHandlers.AUTH_ERROR.match(new Error('boom'))).toBe(false);
		});

		it('does not retry', async () => {
			const result = await errorHandlers.AUTH_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches ApiError with status 400', () => {
			const error = new ApiError(
				baseRequest,
				apiResult(400, 'Bad Request'),
				'Bad Request',
			);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
		});

		it('matches ClickSendAPIError with status 400', () => {
			const error = new ClickSendAPIError(
				'Invalid recipient',
				'INVALID_RECIPIENT',
				400,
			);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
		});

		it('matches invalid/missing message text', () => {
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(new Error('invalid sender')),
			).toBe(true);
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					new Error('missing required fields'),
				),
			).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(errorHandlers.BAD_REQUEST_ERROR.match(new Error('boom'))).toBe(
				false,
			);
		});

		it('does not retry', async () => {
			const result = await errorHandlers.BAD_REQUEST_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('DEFAULT', () => {
		it('matches everything and does not retry', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			const result = await errorHandlers.DEFAULT.handler();
			expect(result.maxRetries).toBe(0);
		});
	});
});
