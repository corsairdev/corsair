import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GooglePhotosTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { googlephotos } from './index';

/** An ApiError shaped the way core's request() throws one. */
function apiError(
	status: number,
	options: {
		method?: 'GET' | 'POST';
		retryAfter?: number;
		// unknown: a test can send any error envelope shape.
		body?: unknown;
	} = {},
): ApiError {
	return new ApiError(
		{ method: options.method ?? 'GET', url: '/albums' },
		{
			url: 'https://photoslibrary.googleapis.com/v1/albums',
			ok: false,
			status,
			statusText: 'failed',
			body: options.body ?? {
				error: { code: status, message: 'failed', status: 'FAILED' },
			},
		},
		'failed',
		options.retryAfter === undefined
			? undefined
			: { retryAfter: options.retryAfter },
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
				pluginId: 'googlephotos',
				operation: 'albums.list',
				input: {},
				originalError: error,
			}),
	);
	const picked = handlers[name ?? 'DEFAULT']?.handler;
	if (!picked) throw new Error('no handler matched, not even DEFAULT');
	return picked(error, {
		pluginId: 'googlephotos',
		operation: 'albums.list',
		input: {},
		originalError: error,
	});
}

describe('rate limits', () => {
	it('retries a 429 with the documented 30 second floor', async () => {
		const strategy = await handlerFor(apiError(429));

		expect(strategy.maxRetries).toBe(2);
		// The upload guide asks for at least 30 seconds before a retry.
		expect(strategy.headersRetryAfterMs).toBe(30_000);
	});

	it('waits for a Retry-After longer than the floor', async () => {
		const strategy = await handlerFor(apiError(429, { retryAfter: 120_000 }));

		expect(strategy.headersRetryAfterMs).toBe(120_000);
	});

	it('keeps the 30 second floor when Retry-After is shorter', async () => {
		const strategy = await handlerFor(apiError(429, { retryAfter: 5_000 }));

		expect(strategy.headersRetryAfterMs).toBe(30_000);
	});

	it('does not retry a 429 whose ErrorInfo names a per-day quota', async () => {
		const strategy = await handlerFor(
			apiError(429, {
				method: 'POST',
				body: {
					error: {
						code: 429,
						message: 'Quota exceeded',
						status: 'RESOURCE_EXHAUSTED',
						details: [
							{
								'@type': 'type.googleapis.com/google.rpc.ErrorInfo',
								reason: 'RATE_LIMIT_EXCEEDED',
								domain: 'googleapis.com',
								metadata: {
									quota_limit: 'ApiCallsPerDayPerProject',
									quota_metric: 'photoslibrary.googleapis.com/all_requests',
									service: 'photoslibrary.googleapis.com',
								},
							},
						],
					},
				},
			}),
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 429 whose QuotaFailure names a daily quota', async () => {
		const strategy = await handlerFor(
			apiError(429, {
				body: {
					error: {
						code: 429,
						status: 'RESOURCE_EXHAUSTED',
						details: [
							{
								'@type': 'type.googleapis.com/google.rpc.QuotaFailure',
								violations: [{ quotaId: 'AllRequestsPerDayPerProject' }],
							},
						],
					},
				},
			}),
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a legacy dailyLimitExceeded 429', async () => {
		const strategy = await handlerFor(
			apiError(429, {
				body: {
					error: { code: 429, errors: [{ reason: 'dailyLimitExceeded' }] },
				},
			}),
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('still retries a 429 whose quota is per minute', async () => {
		const strategy = await handlerFor(
			apiError(429, {
				body: {
					error: {
						code: 429,
						status: 'RESOURCE_EXHAUSTED',
						details: [
							{
								'@type': 'type.googleapis.com/google.rpc.ErrorInfo',
								reason: 'RATE_LIMIT_EXCEEDED',
								metadata: { quota_limit: 'ApiCallsPerMinutePerUser' },
							},
						],
					},
				},
			}),
		);

		expect(strategy.maxRetries).toBe(2);
	});
});

describe('auth and permission failures', () => {
	it.each([401, 403])('does not retry a %i', async (status) => {
		const strategy = await handlerFor(apiError(status));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('input and state failures', () => {
	it.each([400, 404, 409])('does not retry a %i', async (status) => {
		const strategy = await handlerFor(apiError(status));

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a refused input, which never reached Google', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect((await handlerFor(zodError)).maxRetries).toBe(0);
	});
});

describe('server and transport failures', () => {
	it('retries a 5xx on a read', async () => {
		const strategy = await handlerFor(apiError(500, { method: 'GET' }));

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a 5xx on an upload, whose token would be lost', async () => {
		const strategy = await handlerFor(apiError(500, { method: 'POST' }));

		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a dropped connection on a read', async () => {
		const strategy = await handlerFor(
			new GooglePhotosTransportError('fetch failed', true, new TypeError('x')),
		);

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a dropped connection on an upload', async () => {
		const strategy = await handlerFor(
			new GooglePhotosTransportError('fetch failed', false, new TypeError('x')),
		);

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('merging', () => {
	it('keeps DEFAULT last after a caller adds a handler', async () => {
		const custom = googlephotos({
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

	it('lets a caller handler take a status a builtin also matches', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_429: {
				match: (error: Error) =>
					error instanceof ApiError && error.status === 429,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect((await handlerFor(apiError(429), merged)).maxRetries).toBe(9);
	});

	it('keeps the caller DEFAULT as the fallback', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 42 }),
			},
		});

		expect((await handlerFor(new Error('unmatched'), merged)).maxRetries).toBe(
			42,
		);
	});
});
