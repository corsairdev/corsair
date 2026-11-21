import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GoogleAdminTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { googleadmin } from './index';

/** An ApiError shaped the way core's request() throws one. */
function apiError(
	status: number,
	options: {
		reason?: string;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	} = {},
): ApiError {
	return new ApiError(
		{ method: options.method ?? 'GET', url: '/users' },
		{
			url: `https://admin.googleapis.com/admin/directory/v1/users`,
			ok: false,
			status,
			statusText: 'failed',
			body:
				options.reason === undefined
					? undefined
					: {
							error: {
								code: status,
								message: 'failed',
								status: 'FAILED',
								errors: [
									{
										message: 'failed',
										domain: 'global',
										reason: options.reason,
									},
								],
							},
						},
		},
		'failed',
	);
}

/** Runs a handler the way core does: first named match in key order, else DEFAULT. */
async function handlerFor(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
): Promise<RetryStrategy> {
	const name = Object.keys(handlers).find(
		(key) =>
			key !== 'DEFAULT' &&
			handlers[key]?.match?.(error, {
				pluginId: 'googleadmin',
				operation: 'users.list',
				input: {},
				originalError: error,
			}),
	);
	const picked = handlers[name ?? 'DEFAULT']?.handler;
	if (!picked) throw new Error('no handler matched, not even DEFAULT');
	return picked(error, {
		pluginId: 'googleadmin',
		operation: 'users.list',
		input: {},
		originalError: error,
	});
}

describe('rate limits', () => {
	it('retries a 429 with exponential backoff', async () => {
		const strategy = await handlerFor(apiError(429));

		expect(strategy.maxRetries).toBe(3);
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	it('retries a 403 userRateLimitExceeded, which Google documents as a rate limit', async () => {
		const strategy = await handlerFor(
			apiError(403, { reason: 'userRateLimitExceeded' }),
		);

		expect(strategy.maxRetries).toBe(3);
	});

	it('retries a 403 quotaExceeded, the concurrency limit', async () => {
		const strategy = await handlerFor(
			apiError(403, { reason: 'quotaExceeded' }),
		);

		expect(strategy.maxRetries).toBe(3);
	});

	it('does not retry a 403 dailyLimitExceeded, which no backoff can refill', async () => {
		const strategy = await handlerFor(
			apiError(403, { reason: 'dailyLimitExceeded' }),
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 403 limitExceeded', async () => {
		const strategy = await handlerFor(
			apiError(403, { reason: 'limitExceeded' }),
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('waits as long as a Retry-After asks when Google sends one', async () => {
		const limited = new ApiError(
			{ method: 'POST', url: '/groups' },
			{ url: '/groups', ok: false, status: 429, statusText: 'x', body: {} },
			'Too Many Requests',
			{ retryAfter: 7_000 },
		);

		const strategy = await handlerFor(limited);

		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(7_000);
	});

	it('leaves the backoff alone when there is no Retry-After', async () => {
		const strategy = await handlerFor(apiError(429));

		expect(strategy.headersRetryAfterMs).toBeUndefined();
	});

	it('does not retry a 429 whose reason is a spent daily quota', async () => {
		const strategy = await handlerFor(
			apiError(429, { reason: 'dailyLimitExceeded' }),
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 429 whose message names a per-day quota', async () => {
		const spent = new ApiError(
			{ method: 'GET', url: '/users' },
			{
				url: '/users',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {
					error: {
						code: 429,
						status: 'RESOURCE_EXHAUSTED',
						message:
							"Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'admin.googleapis.com'",
						errors: [{ reason: 'rateLimitExceeded', domain: 'global' }],
					},
				},
			},
			'Too Many Requests',
		);

		const strategy = await handlerFor(spent);

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 403 with no reason at all', async () => {
		const strategy = await handlerFor(apiError(403));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('auth and permission failures', () => {
	it('does not retry a 401, which core already refreshed once', async () => {
		const strategy = await handlerFor(apiError(401, { reason: 'authError' }));

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a forbidden 403', async () => {
		const strategy = await handlerFor(apiError(403, { reason: 'forbidden' }));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('input and state failures', () => {
	it.each([
		['invalid', 400],
		['duplicate', 409],
		['conditionNotMet', 412],
	])('does not retry a %s failure (%i)', async (reason, status) => {
		const strategy = await handlerFor(apiError(status, { reason }));

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 404, and routes it to its own handler', async () => {
		const missing = apiError(404, { reason: 'notFound' });
		const handlers: CorsairErrorHandler = errorHandlers;
		const name = Object.keys(handlers).find(
			(key) =>
				key !== 'DEFAULT' &&
				handlers[key]?.match?.(missing, {
					pluginId: 'googleadmin',
					operation: 'users.get',
					input: {},
					originalError: missing,
				}),
		);

		expect(name).toBe('NOT_FOUND_ERROR');
		expect((await handlerFor(missing)).maxRetries).toBe(0);
	});

	it('does not retry a refused input, which never reached Google', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		const strategy = await handlerFor(zodError);

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('transport and server failures', () => {
	it('retries a 5xx on a read', async () => {
		const strategy = await handlerFor(apiError(503, { method: 'GET' }));

		expect(strategy.maxRetries).toBe(2);
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	it('does not replay a 5xx on a write, which may have landed', async () => {
		const strategy = await handlerFor(apiError(500, { method: 'POST' }));

		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a dropped connection on a read', async () => {
		const dropped = new GoogleAdminTransportError(
			'fetch failed',
			'GET',
			new TypeError('fetch failed'),
		);

		const strategy = await handlerFor(dropped);

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a dropped connection on a write', async () => {
		const dropped = new GoogleAdminTransportError(
			'fetch failed',
			'POST',
			new TypeError('fetch failed'),
		);

		const strategy = await handlerFor(dropped);

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a timeout on a write', async () => {
		// A timeout is the one failure where the request may have been applied
		// even though no response arrived.
		const timeout = new GoogleAdminTransportError(
			'The operation was aborted due to timeout',
			'PUT',
			new DOMException('aborted', 'TimeoutError'),
		);

		const strategy = await handlerFor(timeout);

		expect(strategy.maxRetries).toBe(0);
	});

	it('keeps DEFAULT last after a caller adds a handler', async () => {
		const custom = googleadmin({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});

	it('runs a caller handler registered through googleadmin() before a builtin that also matches', async () => {
		const plugin = googleadmin({
			errorHandlers: {
				CUSTOM_503: {
					match: (error: Error) =>
						error instanceof ApiError && error.status === 503,
					handler: async () => ({ maxRetries: 7 }),
				},
			},
		});

		// SERVER_ERROR also matches a 503; the caller's handler must win.
		const strategy = await handlerFor(
			apiError(503, { method: 'GET' }),
			plugin.errorHandlers ?? {},
		);

		expect(strategy.maxRetries).toBe(7);
	});

	it('lets a caller handler take a status no builtin covers', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_500: {
				match: (error: Error) =>
					error instanceof ApiError && error.status === 500,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		// The caller's key comes first, so it is the one that resolves.
		const strategy = await handlerFor(apiError(500, { method: 'GET' }), merged);

		expect(strategy.maxRetries).toBe(9);
	});

	it('keeps the caller DEFAULT as the fallback', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 42 }),
			},
		});

		const strategy = await handlerFor(new Error('unmatched'), merged);

		expect(strategy.maxRetries).toBe(42);
	});
});
