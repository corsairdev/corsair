import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GoogleAdsTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { googleads } from './index';

/** An ApiError shaped the way core's request() throws one. */
function apiError(status: number, method: 'GET' | 'POST' = 'POST'): ApiError {
	return new ApiError(
		{ method, url: '/customers/1/googleAds:search' },
		{
			url: 'https://googleads.googleapis.com/v26/customers/1/googleAds:search',
			ok: false,
			status,
			statusText: 'failed',
			body: { error: { code: status, message: 'failed', status: 'FAILED' } },
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
				pluginId: 'googleads',
				operation: 'reporting.search',
				input: {},
				originalError: error,
			}),
	);
	const picked = handlers[name ?? 'DEFAULT']?.handler;
	if (!picked) throw new Error('no handler matched, not even DEFAULT');
	return picked(error, {
		pluginId: 'googleads',
		operation: 'reporting.search',
		input: {},
		originalError: error,
	});
}

describe('rate limits and transient failures', () => {
	it('retries a 429 with exponential backoff', async () => {
		const strategy = await handlerFor(apiError(429));

		expect(strategy.maxRetries).toBe(3);
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	it('retries a 503 UNAVAILABLE on a read', async () => {
		const strategy = await handlerFor(apiError(503, 'GET'));

		expect(strategy.maxRetries).toBe(2);
	});

	it('retries a 504 DEADLINE_EXCEEDED on a read', async () => {
		const strategy = await handlerFor(apiError(504, 'GET'));

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a 503 on a mutate, which has no idempotency key', async () => {
		const strategy = await handlerFor(apiError(503, 'POST'));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('server failures', () => {
	it('retries a 500 on a read, where UNKNOWN and INTERNAL live', async () => {
		const strategy = await handlerFor(apiError(500, 'GET'));

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a 500 on a write', async () => {
		const strategy = await handlerFor(apiError(500, 'POST'));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('auth and permission failures', () => {
	it.each([401, 403])('does not retry a %i', async (status) => {
		const strategy = await handlerFor(apiError(status));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('input and state failures', () => {
	it.each([
		['invalid argument', 400],
		['already exists', 409],
	])('does not retry a %s failure (%i)', async (_label, status) => {
		const strategy = await handlerFor(apiError(status));

		expect(strategy.maxRetries).toBe(0);
	});

	it('routes a 404 to NOT_FOUND_ERROR, which no earlier handler claims', async () => {
		const missing = apiError(404);
		const handlers: CorsairErrorHandler = errorHandlers;
		const name = Object.keys(handlers).find(
			(key) =>
				key !== 'DEFAULT' &&
				handlers[key]?.match?.(missing, {
					pluginId: 'googleads',
					operation: 'reporting.search',
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

		expect((await handlerFor(zodError)).maxRetries).toBe(0);
	});
});

describe('transport failures', () => {
	it('retries a dropped connection on a read once', async () => {
		const strategy = await handlerFor(
			new GoogleAdsTransportError('fetch failed', true, new TypeError('x')),
		);

		expect(strategy.maxRetries).toBe(1);
	});

	it('does not replay a dropped connection on a mutate', async () => {
		const strategy = await handlerFor(
			new GoogleAdsTransportError('fetch failed', false, new TypeError('x')),
		);

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('merging', () => {
	it('keeps DEFAULT last after a caller adds a handler', async () => {
		const custom = googleads({
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
