import type { CorsairErrorHandler } from 'corsair/core';
import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

const mockRequestOptions: ApiRequestOptions = {
	method: 'POST',
	url: '/v1/singleEmail:check',
};

function makeApiError(
	status: number,
	statusText: string,
	message: string,
	retryAfterSeconds?: number,
): ApiError {
	return new ApiError(
		mockRequestOptions,
		{
			url: '/v1/singleEmail:check',
			ok: false,
			status,
			statusText,
			body: message,
		},
		message,
		retryAfterSeconds !== undefined
			? { retryAfter: retryAfterSeconds }
			: undefined,
	);
}

describe('Mailcheck error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		const matcher = errorHandlers.RATE_LIMIT_ERROR;

		it('matches a 429 ApiError by status', () => {
			const error = makeApiError(429, 'Too Many Requests', 'Too Many Requests');
			expect(matcher.match(error)).toBe(true);
		});

		it('matches a 429 with fallback message text', () => {
			const error = new Error('rate_limited: try again later');
			expect(matcher.match(error)).toBe(true);
		});

		it('matches "too many requests" in message', () => {
			const error = new Error('API rate limit: too many requests');
			expect(matcher.match(error)).toBe(true);
		});

		it('does not match a 403 error', () => {
			const error = makeApiError(403, 'Forbidden', 'Forbidden');
			expect(matcher.match(error)).toBe(false);
		});

		it('does not match unrelated errors', () => {
			const error = new Error('Internal server error');
			expect(matcher.match(error)).toBe(false);
		});

		it('returns configured maxRetries', async () => {
			const error = makeApiError(
				429,
				'Too Many Requests',
				'Too Many Requests',
				30,
			);
			const strategy = await matcher.handler(error);
			expect(strategy.maxRetries).toBe(5);
			expect(strategy.headersRetryAfterMs).toBeDefined();
		});
	});

	describe('AUTH_ERROR', () => {
		const matcher = errorHandlers.AUTH_ERROR;

		it('matches a 401 ApiError by status', () => {
			const error = makeApiError(401, 'Unauthorized', 'Unauthorized');
			expect(matcher.match(error)).toBe(true);
		});

		it('matches unauthorized in message text', () => {
			const error = new Error('401 unauthorized');
			expect(matcher.match(error)).toBe(true);
		});

		it('does not match a 403 error', () => {
			const error = makeApiError(403, 'Forbidden', 'Forbidden');
			expect(matcher.match(error)).toBe(false);
		});
	});

	describe('DEFAULT', () => {
		it('matches any error', () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
		});

		it('returns zero retries', async () => {
			const strategy = await errorHandlers.DEFAULT.handler();
			expect(strategy.maxRetries).toBe(0);
		});
	});

	it('satisfies CorsairErrorHandler contract', () => {
		const _handler: CorsairErrorHandler = errorHandlers;
		expect(_handler).toBeDefined();
	});

	it('keeps DEFAULT last', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});
