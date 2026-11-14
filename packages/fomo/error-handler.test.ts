import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { fomo } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/applications/me/events' },
		{
			url: 'https://api.fomo.com/api/v1/applications/me/events',
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

describe('Fomo errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR with maxRetries 0 (transport owns retries)', async () => {
		const error = apiError(429, 'Too Many Requests', 2500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes rate limit message strings without status code to RATE_LIMIT_ERROR', () => {
		expect(route(new Error('rate_limited by server'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('hit rate limit'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR with 0 retries', async () => {
		const err401 = apiError(401, 'Unauthorized');
		const err403 = apiError(403, 'Forbidden');

		expect(route(err401)).toBe('AUTH_ERROR');
		expect(route(err403)).toBe('AUTH_ERROR');

		await expect(errorHandlers.AUTH_ERROR.handler(err401)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes Token is required message to AUTH_ERROR', () => {
		expect(route(new Error('Token is required.'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid_auth credentials'))).toBe('AUTH_ERROR');
	});

	it('routes 404 to NOT_FOUND_ERROR with 0 retries', async () => {
		const err404 = apiError(404, 'Not Found');
		expect(route(err404)).toBe('NOT_FOUND_ERROR');

		await expect(
			errorHandlers.NOT_FOUND_ERROR.handler(err404),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with 0 retries', async () => {
		const err400 = apiError(400, 'Bad Request');
		const err422 = apiError(422, 'Unprocessable Entity');

		expect(route(err400)).toBe('BAD_REQUEST_ERROR');
		expect(route(err422)).toBe('BAD_REQUEST_ERROR');

		await expect(
			errorHandlers.BAD_REQUEST_ERROR.handler(err400),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 500 and other errors to DEFAULT with 0 retries', async () => {
		const err500 = apiError(500, 'Internal Server Error');
		expect(route(err500)).toBe('DEFAULT');

		await expect(errorHandlers.DEFAULT.handler(err500)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('prioritizes caller handlers before built-ins and places DEFAULT last', () => {
		const customRateLimitHandler = {
			match: (e: Error) => e.message.includes('custom_rate_limit'),
			handler: async () => ({ maxRetries: 2 }),
		};
		const customDefaultHandler = {
			match: () => true,
			handler: async () => ({ maxRetries: 99 }),
		};

		const plugin = fomo({
			errorHandlers: {
				CUSTOM_RATE: customRateLimitHandler,
				DEFAULT: customDefaultHandler,
			},
		});

		expect(plugin.errorHandlers).toBeDefined();
		if (!plugin.errorHandlers) throw new Error('errorHandlers missing');

		const keys = Object.keys(plugin.errorHandlers);
		// 1. Caller handlers come before built-in handlers
		expect(keys[0]).toBe('CUSTOM_RATE');
		// 2. Custom handler appears before RATE_LIMIT_ERROR and before other built-ins
		expect(keys.indexOf('CUSTOM_RATE')).toBeLessThan(
			keys.indexOf('RATE_LIMIT_ERROR'),
		);
		expect(keys.indexOf('CUSTOM_RATE')).toBeLessThan(
			keys.indexOf('AUTH_ERROR'),
		);
		expect(keys.indexOf('CUSTOM_RATE')).toBeLessThan(
			keys.indexOf('NOT_FOUND_ERROR'),
		);
		expect(keys.indexOf('CUSTOM_RATE')).toBeLessThan(
			keys.indexOf('BAD_REQUEST_ERROR'),
		);
		// 4. DEFAULT is always the last key
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(plugin.errorHandlers.CUSTOM_RATE).toBe(customRateLimitHandler);
		expect(plugin.errorHandlers.DEFAULT).toBe(customDefaultHandler);
	});

	it('preserves caller-supplied handler when overriding a built-in without duplicating it', () => {
		const customRateLimitHandler = {
			match: (e: Error) => e.message.includes('custom_429'),
			handler: async () => ({ maxRetries: 7 }),
		};

		const plugin = fomo({
			errorHandlers: {
				RATE_LIMIT_ERROR: customRateLimitHandler,
			},
		});

		expect(plugin.errorHandlers).toBeDefined();
		if (!plugin.errorHandlers) throw new Error('errorHandlers missing');

		const keys = Object.keys(plugin.errorHandlers);
		// 3. Caller handler is preserved and not duplicated
		expect(plugin.errorHandlers.RATE_LIMIT_ERROR).toBe(customRateLimitHandler);
		expect(keys.filter((k) => k === 'RATE_LIMIT_ERROR')).toHaveLength(1);
		expect(keys[0]).toBe('RATE_LIMIT_ERROR');
		// 4. Built-in DEFAULT remains last key when not overridden
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});
