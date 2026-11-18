import { ApiError } from 'corsair/http';
import { ENDORSAL_API_BASE } from './client';
import { errorHandlers } from './error-handlers';

function apiError(method: 'GET' | 'POST', status: number, retryAfter?: number) {
	return new ApiError(
		{ method, url: '/v1/testimonials' },
		{
			url: `${ENDORSAL_API_BASE}/v1/testimonials`,
			ok: false,
			status,
			statusText: 'Provider error',
			body: {},
		},
		'Provider error',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!match) throw new Error('No Endorsal error handler matched');
	return match[0];
}

describe('Endorsal error handlers', () => {
	it('handles 429 first and retries safe GETs using Retry-After', async () => {
		const error = apiError('GET', 429, 2500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
		});
	});

	it('does not retry a non-idempotent write after 429', async () => {
		const error = apiError('POST', 429, 1500);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not retry authentication failures', async () => {
		for (const status of [401, 403]) {
			const error = apiError('GET', status);
			expect(route(error)).toBe('AUTH_ERROR');
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('routes bad requests and missing resources without retries', async () => {
		for (const status of [400, 422]) {
			const error = apiError('POST', status);
			expect(route(error)).toBe('BAD_REQUEST_ERROR');
			await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
		const missing = apiError('GET', 404);
		expect(route(missing)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries safe GET server errors but never retries writes', async () => {
		const readError = apiError('GET', 503);
		const writeError = apiError('POST', 503);
		expect(route(readError)).toBe('SERVER_ERROR');
		await expect(
			errorHandlers.SERVER_ERROR.handler(readError),
		).resolves.toEqual({
			maxRetries: 2,
		});
		await expect(
			errorHandlers.SERVER_ERROR.handler(writeError),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('keeps DEFAULT last and routes unknown errors there', async () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
		const error = new Error('unclassified provider error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
