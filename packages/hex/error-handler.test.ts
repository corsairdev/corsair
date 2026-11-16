import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { hex } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/users/me' },
		{
			url: 'https://app.hex.tech/api/v1/users/me',
			ok: false,
			status,
			statusText: message,
			body: { message, status },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const matched = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (matched === undefined) {
		throw new Error('No Hex error handler matched.');
	}
	return matched[0];
}

describe('Hex error handlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and forwards retryAfter when present', async () => {
		const error = apiError(429, 'Too Many Requests', 2500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 3, headersRetryAfterMs: 2500 });
	});

	it('routes rate limit message to RATE_LIMIT_ERROR even if not ApiError', async () => {
		const error = new Error('Client rate limit exceeded');
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 3, headersRetryAfterMs: undefined });
	});

	it('routes 401 and 403 to AUTH_ERROR without retrying', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR without retrying', async () => {
		const error = apiError(404, 'Not Found');
		expect(route(error)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 422 to VALIDATION_ERROR without retrying', async () => {
		const error = apiError(422, 'Unprocessable Entity');
		expect(route(error)).toBe('VALIDATION_ERROR');
		await expect(errorHandlers.VALIDATION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 to BAD_REQUEST_ERROR without retrying', async () => {
		const error = apiError(400, 'Bad Request');
		expect(route(error)).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 503 to SERVICE_UNAVAILABLE_ERROR without retrying', async () => {
		const error = apiError(503, 'Service Unavailable');
		expect(route(error)).toBe('SERVICE_UNAVAILABLE_ERROR');
		await expect(
			errorHandlers.SERVICE_UNAVAILABLE_ERROR.handler(),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes an ApiError by status, not by words in its message', async () => {
		const timeout = apiError(504, 'rate limit service timed out');
		expect(route(timeout)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler(timeout)).resolves.toEqual({
			maxRetries: 0,
		});
		expect(route(apiError(500, 'Resource not found upstream'))).toBe('DEFAULT');
	});

	it('routes unknown failures to DEFAULT without retrying', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes caller handlers before built-ins and keeps DEFAULT last', () => {
		const callerCustom: NonNullable<CorsairErrorHandler['NETWORK_ERROR']> = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const callerDefault: NonNullable<CorsairErrorHandler['DEFAULT']> = {
			match: () => true,
			handler: async () => ({ maxRetries: 8 }),
		};

		const plugin = hex({
			errorHandlers: {
				NETWORK_ERROR: callerCustom,
				DEFAULT: callerDefault,
			},
		});

		const handlers = plugin.errorHandlers ?? {};
		const names = Object.keys(handlers);

		expect(handlers.NETWORK_ERROR).toBe(callerCustom);
		expect(handlers.DEFAULT).toBe(callerDefault);
		expect(names.indexOf('NETWORK_ERROR')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
		expect(names.at(-1)).toBe('DEFAULT');
	});
});
