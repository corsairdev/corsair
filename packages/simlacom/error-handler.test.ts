import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	const request: ApiRequestOptions = { method: 'GET', url: 'orders' };
	const result: ApiResult = {
		url: 'https://demo.simla.com/api/v5/orders',
		ok: false,
		status,
		statusText: `HTTP ${status}`,
		body: { message: 'request failed' },
	};
	return new ApiError(
		request,
		result,
		`Simla.com request failed with HTTP ${status}.`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Simla.com error handling', () => {
	it('recognizes 429 and the provider-documented per-IP 503 limit without handler retries', async () => {
		const rateLimit = errorHandlers.RATE_LIMIT_ERROR;
		expect(rateLimit.match(apiError(429, 4000))).toBe(true);
		expect(rateLimit.match(apiError(503))).toBe(true);
		expect(await rateLimit.handler()).toEqual({ maxRetries: 0 });
	});

	it('classifies authentication, bad request, not found, and server failures', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(400))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(422))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(500))).toBe(true);
	});

	it('does not retry a generic provider error or a 503 write automatically', async () => {
		expect(await errorHandlers.DEFAULT.handler()).toEqual({
			maxRetries: 0,
		});
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
