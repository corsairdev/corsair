import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { ignisign } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v4/signature-requests/one-call-sign' },
		{
			url: 'https://api.ignisign.io/v4/signature-requests/one-call-sign',
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
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Ignisign errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR with zero retries so transport owns backoff', async () => {
		const error = apiError(429, 'Too Many Requests', 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes textual rate limit error messages when status is absent', () => {
		expect(route(new Error('rate limit exceeded'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid_token'))).toBe('AUTH_ERROR');
		expect(route(new Error('authentication_failed'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with no retries', async () => {
		expect(route(apiError(404, 'Document not found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('entity not found'))).toBe('NOT_FOUND_ERROR');
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

	it('routes 500+ to SERVER_ERROR with no retries', async () => {
		expect(route(apiError(500, 'Internal Server Error'))).toBe('SERVER_ERROR');
		expect(route(apiError(503, 'Service Unavailable'))).toBe('SERVER_ERROR');
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const customError = new Error('something unpredictable happened');
		expect(route(customError)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('preserves caller error handlers in correct evaluation order', () => {
		const customMatch = jest.fn().mockReturnValue(true);
		const customHandler = jest.fn().mockResolvedValue({ maxRetries: 3 });

		const plugin = ignisign({
			errorHandlers: {
				CUSTOM_HANDLER: {
					match: customMatch,
					handler: customHandler,
				},
			},
		});

		const handlerKeys = Object.keys(plugin.errorHandlers ?? {});
		expect(handlerKeys[0]).toBe('CUSTOM_HANDLER');
		expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');
	});

	it('preserves caller handlers that override built-in names', async () => {
		const customMatch = jest.fn().mockReturnValue(true);
		const customHandler = jest.fn().mockResolvedValue({ maxRetries: 3 });
		const plugin = ignisign({
			errorHandlers: {
				RATE_LIMIT_ERROR: {
					match: customMatch,
					handler: customHandler,
				},
			},
		});
		const callerRateLimit = plugin.errorHandlers?.RATE_LIMIT_ERROR;
		const error = new Error('custom error');
		const context = {
			pluginId: 'ignisign',
			operation: 'signers.create',
			input: {},
			originalError: error,
		};

		expect(callerRateLimit?.match(error, context)).toBe(true);
		await callerRateLimit?.handler(error, context);
		expect(customMatch).toHaveBeenCalledTimes(1);
		expect(customHandler).toHaveBeenCalledTimes(1);
		expect(Object.keys(plugin.errorHandlers ?? {}).at(-1)).toBe('DEFAULT');
	});
});
