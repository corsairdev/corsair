import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createErrorHandlers, mergeErrorHandlers } from './error-handlers';
import { gmail, isReadOperation } from './index';

function apiError(
	status: number,
	message = `Request failed with status ${status}`,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/users/me/profile' },
		{
			url: 'https://gmail.googleapis.com/gmail/v1/users/me/profile',
			ok: false,
			status,
			statusText: 'Error',
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function contextFor(operation: string, error: Error): ErrorContext {
	return { pluginId: 'gmail', operation, input: {}, originalError: error };
}

const handlers = createErrorHandlers(isReadOperation);

/** The handler Corsair would pick: the first one whose match returns true. */
function firstMatch(error: Error): string | undefined {
	const context = contextFor('users.getProfile', error);
	return Object.entries(handlers).find(([, h]) => h.match(error, context))?.[0];
}

describe('Gmail error handler matching', () => {
	it.each([
		[429, 'RATE_LIMIT_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'VALIDATION_ERROR'],
		[500, 'SERVER_ERROR'],
		[503, 'SERVER_ERROR'],
		[409, 'DEFAULT'],
	])('routes an ApiError with status %i to %s', (status, expected) => {
		expect(firstMatch(apiError(status))).toBe(expected);
	});

	it('treats a 403 with a Gmail quota reason as a rate limit', () => {
		expect(firstMatch(apiError(403, 'userRateLimitExceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(firstMatch(apiError(403, 'rateLimitExceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('lets the status decide, even when the message contains another code', () => {
		// A message ID that happens to contain "429" or "500".
		expect(firstMatch(apiError(404, 'Message 18f4290ab429 not found'))).toBe(
			'NOT_FOUND_ERROR',
		);
		expect(firstMatch(apiError(400, 'Too many recipients (500)'))).toBe(
			'VALIDATION_ERROR',
		);
		expect(firstMatch(apiError(404, 'rate limit'))).toBe('NOT_FOUND_ERROR');
	});

	it('matches plain errors by message, without bare status numbers', () => {
		expect(firstMatch(new Error('Too Many Requests'))).toBe('RATE_LIMIT_ERROR');
		expect(firstMatch(new Error('Invalid Credentials'))).toBe('AUTH_ERROR');
		expect(firstMatch(new Error('Insufficient Permission'))).toBe(
			'PERMISSION_ERROR',
		);
		expect(firstMatch(new Error('Requested entity was not found'))).toBe(
			'NOT_FOUND_ERROR',
		);
		expect(firstMatch(new Error('Backend Error'))).toBe('SERVER_ERROR');
		expect(firstMatch(new Error('thread 18f4290ab429 failed'))).toBe('DEFAULT');
	});
});

describe('Gmail error handler retries', () => {
	it('retries a rate limit on a read, honouring Retry-After', async () => {
		const error = apiError(429, 'Too Many Requests', 3000);
		const result = await handlers.RATE_LIMIT_ERROR.handler(
			error,
			contextFor('users.getProfile', error),
		);
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(3000);
	});

	it('retries a server error on a read', async () => {
		const error = apiError(503);
		const result = await handlers.SERVER_ERROR.handler(
			error,
			contextFor('messages.get', error),
		);
		expect(result.maxRetries).toBe(3);
	});

	it.each(['messages.send', 'drafts.send', 'messages.modify', 'labels.delete'])(
		'never retries the write %s, so it cannot run twice',
		async (operation) => {
			const rateLimited = apiError(429);
			const serverError = apiError(500);
			expect(
				(
					await handlers.RATE_LIMIT_ERROR.handler(
						rateLimited,
						contextFor(operation, rateLimited),
					)
				).maxRetries,
			).toBe(0);
			expect(
				(
					await handlers.SERVER_ERROR.handler(
						serverError,
						contextFor(operation, serverError),
					)
				).maxRetries,
			).toBe(0);
		},
	);

	it('does not retry auth, permission, not found or validation errors', async () => {
		for (const name of [
			'AUTH_ERROR',
			'PERMISSION_ERROR',
			'NOT_FOUND_ERROR',
			'VALIDATION_ERROR',
			'DEFAULT',
		] as const) {
			const error = new Error(name);
			const result = await handlers[name].handler(
				error,
				contextFor('users.getProfile', error),
			);
			expect(result.maxRetries).toBe(0);
		}
	});

	it('classifies reads and writes from the endpoint metadata', () => {
		expect(isReadOperation('users.getProfile')).toBe(true);
		expect(isReadOperation('messages.get')).toBe(true);
		expect(isReadOperation('messages.send')).toBe(false);
		expect(isReadOperation('drafts.send')).toBe(false);
		expect(isReadOperation('not.an.endpoint')).toBe(false);
	});
});

describe('mergeErrorHandlers', () => {
	const custom = {
		match: () => true,
		handler: async () => ({ maxRetries: 1 }),
	};

	it('keeps DEFAULT last when a caller adds a new handler key', () => {
		const merged = mergeErrorHandlers(
			createErrorHandlers(() => true),
			{
				NETWORK_ERROR: custom,
			},
		);
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys.indexOf('NETWORK_ERROR')).toBeLessThan(keys.indexOf('DEFAULT'));
	});

	it('uses a caller DEFAULT in place of the built-in one', () => {
		const merged = mergeErrorHandlers(
			createErrorHandlers(() => true),
			{
				DEFAULT: custom,
			},
		);
		expect(merged.DEFAULT).toBe(custom);
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});

	it('lets a caller replace a built-in handler', () => {
		const merged = mergeErrorHandlers(
			createErrorHandlers(() => true),
			{
				RATE_LIMIT_ERROR: custom,
			},
		);
		expect(merged.RATE_LIMIT_ERROR).toBe(custom);
	});

	it('is what the plugin registers', () => {
		const plugin = gmail({ errorHandlers: { TIMEOUT_ERROR: custom } });
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(plugin.errorHandlers?.TIMEOUT_ERROR).toBe(custom);
		expect(plugin.errorHandlers?.RATE_LIMIT_ERROR).toBeDefined();
	});
});
