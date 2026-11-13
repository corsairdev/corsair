import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	retryAfter?: number,
	body?: object,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2/[redacted]' },
		{
			url: 'https://api.getprospect.com/v2/',
			ok: false,
			status,
			statusText: '',
			body,
		},
		`GetProspect request failed (HTTP ${status})`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function handlerFor(error: Error): string {
	const matched = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!matched) throw new Error('No matching error handler');
	return matched[0];
}

describe('GetProspect error handlers', () => {
	it('retries short request-level 429s here and preserves Retry-After', async () => {
		const error = apiError(429, 2500);
		expect(handlerFor(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2500,
		});
	});

	it('does not retry daily quota refusals without a short Retry-After', async () => {
		const missingDelay = apiError(429);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(missingDelay),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: undefined,
		});
		const longDelay = apiError(429, 86_400_000);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(longDelay),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 86_400_000,
		});
		const dailyJobRefusal = apiError(429, 4000, {
			success: false,
			data: null,
			errors: [
				{
					name: 'RATE_LIMIT',
					payload: {
						code: 'rate_limit_exceeded',
						bucket: 'search',
						window: 'day',
						reset_seconds: 45,
					},
				},
			],
		});
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(dailyJobRefusal),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 4000 });
	});

	it('does not retry authentication, invalid input, missing records, or credit failures', async () => {
		for (const [status, handlerName] of [
			[401, 'AUTH_ERROR'],
			[403, 'AUTH_ERROR'],
			[400, 'BAD_REQUEST_ERROR'],
			[422, 'BAD_REQUEST_ERROR'],
			[404, 'NOT_FOUND_ERROR'],
			[402, 'PAYMENT_REQUIRED_ERROR'],
		] as const) {
			const error = apiError(status);
			expect(handlerFor(error)).toBe(handlerName);
		}
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(
			errorHandlers.PAYMENT_REQUIRED_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('leaves 5xx and network failures without automatic replay', async () => {
		const error = apiError(500);
		expect(handlerFor(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(handlerFor(new Error('GetProspect request failed'))).toBe('DEFAULT');
	});

	it('keeps the catch-all handler last', () => {
		const names = Object.keys(errorHandlers);
		expect(names[names.length - 1]).toBe('DEFAULT');
	});
});
