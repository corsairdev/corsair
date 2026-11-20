import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { errorHandlers } from './error-handlers';
import { interzoid } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/getremainingcredits' },
		{
			url: 'https://api.interzoid.com/getremainingcredits',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Interzoid errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR with zero retries', async () => {
		const error = apiError(429, 'Too Many Requests', 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 402 status to INSUFFICIENT_CREDITS_ERROR', async () => {
		const error = apiError(402, 'Payment Required');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes insufficient credits message to INSUFFICIENT_CREDITS_ERROR', async () => {
		const error = new Error('insufficient credits for this operation');
		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'API License Key not found'))).toBe(
			'AUTH_ERROR',
		);
		expect(route(new Error('invalid license API key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR', async () => {
		expect(route(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400, 422, and ZodError to BAD_REQUEST_ERROR', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable'))).toBe('BAD_REQUEST_ERROR');
		const zodErr = new ZodError([]);
		expect(route(zodErr)).toBe('BAD_REQUEST_ERROR');
		expect(
			route(new Error('insufficient parameters: lookup is required')),
		).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 500 to SERVICE_ERROR', async () => {
		expect(route(apiError(500, 'Internal Server Error'))).toBe('SERVICE_ERROR');
		expect(route(apiError(503, 'Service Unavailable'))).toBe('SERVICE_ERROR');
		await expect(errorHandlers.SERVICE_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unclassified errors to DEFAULT', async () => {
		const generic = new Error('unexpected network disconnect');
		expect(route(generic)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('respects caller error handler override precedence', () => {
		const customRateLimit = {
			match: (e: Error) => e.message.includes('custom-429'),
			handler: async () => ({ maxRetries: 3 }),
		};

		const plugin = interzoid({
			errorHandlers: {
				CUSTOM_HANDLER: customRateLimit,
			},
		});

		expect(plugin.errorHandlers?.CUSTOM_HANDLER).toBe(customRateLimit);
		// Core tries handlers in key order, so the caller's must come first.
		const order = Object.keys(plugin.errorHandlers ?? {});
		expect(order.indexOf('CUSTOM_HANDLER')).toBeLessThan(
			order.indexOf('RATE_LIMIT_ERROR'),
		);
		expect(order.at(-1)).toBe('DEFAULT');
	});
});
