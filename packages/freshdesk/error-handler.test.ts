import { ApiError } from 'corsair/http';
import { FreshdeskAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number) {
	return new ApiError(
		{ method: 'GET', url: '/api/v2/tickets' },
		{
			url: 'https://acme.freshdesk.com/api/v2/tickets',
			ok: false,
			status,
			statusText: `HTTP ${status}`,
			body: { description: 'safe test body' },
		},
		`HTTP ${status}`,
		status === 429 ? { retryAfter: 5000 } : undefined,
	);
}

describe('Freshdesk error handlers', () => {
	it('recognizes 429 and carries the documented Retry-After delay', async () => {
		const limited = new FreshdeskAPIError('Rate limited', 429, 5000, true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(limited)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(limited)).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 5000,
		});
	});

	it('does not retry non-idempotent operations after 429', async () => {
		const limitedWrite = new FreshdeskAPIError(
			'Rate limited',
			429,
			5000,
			false,
		);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(limitedWrite)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 5000,
		});
	});

	it.each([400, 404, 405, 409, 422])(
		'classifies HTTP %s as a non-retryable request error',
		async (status) => {
			const error = new FreshdeskAPIError(`HTTP ${status}`, status);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
			expect(await errorHandlers.BAD_REQUEST_ERROR.handler()).toEqual({
				maxRetries: 0,
			});
		},
	);

	it('classifies 401/403 as authentication failures', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new FreshdeskAPIError('Unauthorized', 401),
			),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(new FreshdeskAPIError('Forbidden', 403)),
		).toBe(true);
	});

	it('does not retry 5xx and places the catch-all handler last', async () => {
		const serverError = new FreshdeskAPIError('HTTP 500', 500);
		expect(errorHandlers.SERVER_ERROR.match(serverError)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('matches raw transport ApiErrors before client sanitization', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
	});
});
