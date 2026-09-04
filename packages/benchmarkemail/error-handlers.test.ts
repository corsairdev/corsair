import type { ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	rateLimitInfo?: { retryAfter?: number },
): ApiError {
	const request = { method: 'GET', url: 'Contact/ActiveCount' } as const;
	const response: ApiResult = {
		url: 'https://clientapi.benchmarkemail.com/Contact/ActiveCount',
		ok: false,
		status,
		statusText: message,
		body: { errors: [{ errorType: 'Error', message }] },
	};
	return new ApiError(request, response, message, rateLimitInfo);
}

describe('Benchmark Email error handlers', () => {
	it('matches 429 as a rate-limit error and leaves retries to the transport', async () => {
		const error = apiError(
			429,
			'Rate limit exceeded. Retry after 45 seconds.',
			{
				retryAfter: 45000,
			},
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const decision = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		// The client's RateLimitConfig already retries 429s (honouring
		// Retry-After); retrying here too would multiply the two policies.
		expect(decision).toEqual({ maxRetries: 0 });
	});

	it('matches 429 without rate-limit info and does not double-retry', async () => {
		const error = apiError(429, '429 Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const decision = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(decision).toEqual({ maxRetries: 0 });
	});

	it('matches TooManyRequestsError bodies as rate-limit errors', () => {
		const error = new Error(
			'TooManyRequestsError: Monthly API quota exceeded.',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('does not match ordinary errors as rate-limit errors', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('matches 401 as an auth error with no retries', async () => {
		const error = apiError(401, 'Invalid API key');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches invalid and expired keys as auth errors', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('Invalid API key'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('API key expired'))).toBe(
			true,
		);
	});

	it('matches 403 scope errors as forbidden with no retries', async () => {
		const error = apiError(
			403,
			'API key missing required scope: contacts:write',
		);
		expect(errorHandlers.FORBIDDEN_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.FORBIDDEN_ERROR.handler(error)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('matches 404 as not-found with no retries', async () => {
		const error = apiError(404, 'Contact not found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		expect(errorHandlers.FORBIDDEN_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.NOT_FOUND_ERROR.handler(error)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('falls through to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		await expect(errorHandlers.DEFAULT.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
