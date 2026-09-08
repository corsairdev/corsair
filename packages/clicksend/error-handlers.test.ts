import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { ClickSendAPIError } from './client';
import { errorHandlers } from './error-handlers';

function mockApiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: 'https://rest.clicksend.com/v3/sms/history',
	};
	const response: ApiResult = {
		url: 'https://rest.clicksend.com/v3/sms/history',
		ok: false,
		status,
		statusText: status === 429 ? 'Too Many Requests' : 'Error',
		body: {},
	};
	return new ApiError(request, response, message, { retryAfter });
}

describe('clicksend errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		it('matches ApiError 429', () => {
			expect(handler.match(mockApiError(429, 'too many requests'))).toBe(true);
		});

		it('matches ClickSendAPIError 429', () => {
			expect(
				handler.match(
					new ClickSendAPIError('Rate limit reached', 'RATE_LIMIT', 429),
				),
			).toBe(true);
		});

		it('matches message containing rate', () => {
			expect(handler.match(new Error('Rate limited'))).toBe(true);
		});

		it('handler returns retry config with retryAfterMs', async () => {
			const err = mockApiError(429, 'too many requests', 10000);
			const res = await handler.handler(err);
			expect(res.maxRetries).toBe(5);
			expect(res.headersRetryAfterMs).toBe(10000);
		});
	});

	describe('AUTH_ERROR', () => {
		const handler = errorHandlers.AUTH_ERROR;

		it('matches ApiError 401', () => {
			expect(handler.match(mockApiError(401, 'unauthorized'))).toBe(true);
		});

		it('matches ClickSendAPIError 401', () => {
			expect(
				handler.match(
					new ClickSendAPIError('Unauthorized', 'UNAUTHORIZED', 401),
				),
			).toBe(true);
		});

		it('matches unauthorized message', () => {
			expect(handler.match(new Error('Unauthorized access'))).toBe(true);
		});

		it('handler returns maxRetries 0', async () => {
			const res = await handler.handler();
			expect(res.maxRetries).toBe(0);
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		const handler = errorHandlers.BAD_REQUEST_ERROR;

		it('matches ApiError 400', () => {
			expect(handler.match(mockApiError(400, 'bad request'))).toBe(true);
		});

		it('matches ClickSendAPIError 400', () => {
			expect(
				handler.match(
					new ClickSendAPIError('Invalid phone number', 'BAD_REQUEST', 400),
				),
			).toBe(true);
		});

		it('matches invalid message', () => {
			expect(handler.match(new Error('Invalid recipient phone number'))).toBe(
				true,
			);
		});

		it('handler returns maxRetries 0', async () => {
			const res = await handler.handler();
			expect(res.maxRetries).toBe(0);
		});
	});

	describe('DEFAULT', () => {
		it('matches unconditionally', () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
		});

		it('handler returns maxRetries 0', async () => {
			const res = await errorHandlers.DEFAULT.handler();
			expect(res.maxRetries).toBe(0);
		});
	});
});
