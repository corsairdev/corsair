import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { jobnimbus } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/contacts' },
		{
			url: 'https://app.jobnimbus.com/api1/contacts',
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
		throw new Error('No JobNimbus error handler matched.');
	}
	return matched[0];
}

describe('JobNimbus error handlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and forwards retryAfter when present', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1500 });
	});

	it('routes 429 without retryAfter to RATE_LIMIT_ERROR with undefined delay', async () => {
		const error = apiError(429, 'Rate Limit Exceeded');

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });
	});

	it('routes 401 and 403 to AUTH_ERROR without retrying', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('Invalid API Key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR without retrying', async () => {
		expect(route(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('contact not found'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 422 to VALIDATION_ERROR without retrying', async () => {
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'VALIDATION_ERROR',
		);
		expect(route(new Error('Validation failed'))).toBe('VALIDATION_ERROR');
		await expect(errorHandlers.VALIDATION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 to BAD_REQUEST_ERROR without retrying', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(new Error('invalid request payload'))).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 500 to SERVER_ERROR without retrying', async () => {
		expect(route(apiError(500, 'Internal Server Error'))).toBe('SERVER_ERROR');
		expect(route(apiError(503, 'Service Unavailable'))).toBe('SERVER_ERROR');
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unmatched errors to DEFAULT without retrying', async () => {
		const error = new Error('unexpected network glitch');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('preserves caller-supplied error handlers first with DEFAULT last', () => {
		const customRateLimitHandler = jest.fn();
		const customDefaultHandler = jest.fn();

		const instance = jobnimbus({
			errorHandlers: {
				CUSTOM_ERROR: {
					match: (err) => err.message.includes('custom'),
					handler: async () => ({ maxRetries: 1 }),
				},
				RATE_LIMIT_ERROR: {
					match: (err) => err.message.includes('custom-rate-limit'),
					handler: customRateLimitHandler,
				},
				DEFAULT: {
					match: () => true,
					handler: customDefaultHandler,
				},
			},
		});

		const handlers = instance.errorHandlers;
		const handlerKeys = Object.keys(handlers);

		// Caller-supplied custom handler is at the beginning
		expect(handlerKeys[0]).toBe('CUSTOM_ERROR');
		// DEFAULT is at the end
		expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');
		// Overridden RATE_LIMIT_ERROR is the caller's
		expect(handlers.RATE_LIMIT_ERROR.handler).toBe(customRateLimitHandler);
		expect(handlers.DEFAULT.handler).toBe(customDefaultHandler);
	});
});
