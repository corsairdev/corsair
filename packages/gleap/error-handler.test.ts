import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { gleap } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/tickets' },
		{
			url: 'https://api.gleap.io/v3/tickets',
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

describe('Gleap errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR with single-owner maxRetries: 0', async () => {
		const error = apiError(429, 'Too Many Requests', 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes string rate limit messages to RATE_LIMIT_ERROR', async () => {
		expect(route(new Error('Rate limit exceeded'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('Too many requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid api key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with no retries', async () => {
		expect(route(apiError(404, 'Ticket not found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('Resource not found'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with no retries', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(route(new Error('validation failed'))).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 5xx to SERVER_ERROR with no retries', async () => {
		expect(route(apiError(500, 'Internal Server Error'))).toBe('SERVER_ERROR');
		expect(route(apiError(502, 'Bad Gateway'))).toBe('SERVER_ERROR');
		expect(route(apiError(503, 'Service Unavailable'))).toBe('SERVER_ERROR');
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = new Error('Random unexpected failure');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('orders caller error handlers ahead of built-in error handlers', () => {
		const customRateLimitMatch = jest.fn().mockReturnValue(true);
		const customDefaultMatch = jest.fn().mockReturnValue(true);

		const plugin = gleap({
			errorHandlers: {
				CUSTOM_RATE_LIMIT: {
					match: customRateLimitMatch,
					handler: async () => ({ maxRetries: 2 }),
				},
				DEFAULT: {
					match: customDefaultMatch,
					handler: async () => ({ maxRetries: 1 }),
				},
			},
		});

		const handlerKeys = Object.keys(plugin.errorHandlers ?? {});
		// Custom handlers should be placed before built-in handlers
		expect(handlerKeys[0]).toBe('CUSTOM_RATE_LIMIT');
		// DEFAULT should be at the end
		expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');
	});
});
