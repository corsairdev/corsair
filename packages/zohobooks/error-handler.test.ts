import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	retryAfter?: number,
	code?: number,
): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: '/books/v3/organizations',
	};
	const response: ApiResult = {
		url: 'https://www.zohoapis.com/books/v3/organizations',
		ok: false,
		status,
		statusText: `HTTP ${status}`,
		body: {
			...(code !== undefined ? { code } : {}),
			message: 'Provider error',
		},
	};
	return new ApiError(request, response, `HTTP ${status}`, { retryAfter });
}

describe('Zoho Books HTTP error handlers', () => {
	it('retries recoverable 429 responses once and honors Retry-After', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		if (!handler) throw new Error('Rate-limit handler is not registered.');
		const error = apiError(429, 4000, 44);
		expect(handler.match(error)).toBe(true);
		await expect(handler.handler(error)).resolves.toEqual({
			maxRetries: 1,
			headersRetryAfterMs: 4000,
		});
		expect(error.retryAfter).toBe(4000);
	});

	it('does not retry the documented daily plan quota error', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		if (!handler) throw new Error('Rate-limit handler is not registered.');
		const error = apiError(429, 4000, 45);
		await expect(handler.handler(error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry expired or insufficient-scope OAuth requests', async () => {
		for (const [name, status] of [
			['AUTH_ERROR', 401],
			['PERMISSION_ERROR', 403],
		] as const) {
			const handler = errorHandlers[name];
			if (!handler) throw new Error(`${name} is not registered.`);
			const error = apiError(status);
			expect(handler.match(error)).toBe(true);
			await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		}
	});

	it('does not retry not-found or invalid-request responses', async () => {
		for (const [name, status] of [
			['NOT_FOUND_ERROR', 404],
			['BAD_REQUEST_ERROR', 400],
		] as const) {
			const handler = errorHandlers[name];
			if (!handler) throw new Error(`${name} is not registered.`);
			const error = apiError(status);
			expect(handler.match(error)).toBe(true);
			await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		}
	});

	it('keeps 5xx failures non-replayable and dispatches DEFAULT last', async () => {
		const fallback = errorHandlers.DEFAULT;
		if (!fallback) throw new Error('Default error handler is not registered.');
		const error = apiError(503);
		expect(fallback.match()).toBe(true);
		await expect(fallback.handler()).resolves.toEqual({ maxRetries: 0 });
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});
