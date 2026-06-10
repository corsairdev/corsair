import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function mockApiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: 'https://api.twilio.com/2010-04-01/Accounts/AC123/Messages.json',
	};
	const response: ApiResult = {
		url: 'https://api.twilio.com/2010-04-01/Accounts/AC123/Messages.json',
		ok: false,
		status,
		statusText: status === 429 ? 'Too Many Requests' : 'Error',
		body: {},
	};
	return new ApiError(request, response, message, { retryAfter });
}

describe('twilio errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		it('matches ApiError 429', () => {
			expect(handler.match(mockApiError(429, 'too many requests'))).toBe(true);
		});

		it('matches message containing rate', () => {
			expect(handler.match(new Error('Rate limited'))).toBe(true);
		});

		it('handler returns retry config with retryAfterMs', async () => {
			const err = mockApiError(429, 'too many requests', 12000);
			const res = await handler.handler(err);
			expect(res.maxRetries).toBe(5);
			expect(res.headersRetryAfterMs).toBe(12000);
		});
	});

	describe('AUTH_ERROR', () => {
		const handler = errorHandlers.AUTH_ERROR;

		it('matches ApiError 401', () => {
			expect(handler.match(mockApiError(401, 'unauthorized'))).toBe(true);
		});

		it('matches unauthorized message', () => {
			expect(handler.match(new Error('Unauthorized'))).toBe(true);
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

		it('matches invalid phone number message', () => {
			expect(
				handler.match(new Error('The number is not a valid phone number')),
			).toBe(true);
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
