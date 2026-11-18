import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GoogleSearchConsoleTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { googlesearchconsole } from './index';

/** An ApiError shaped the way core's request() throws one. */
function apiError(
	status: number,
	options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' } = {},
): ApiError {
	return new ApiError(
		{ method: options.method ?? 'GET', url: '/sites' },
		{
			url: 'https://searchconsole.googleapis.com/webmasters/v3/sites',
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
				pluginId: 'googlesearchconsole',
				operation: 'sites.list',
				input: {},
				originalError: error,
			}),
	);
	const picked = handlers[name ?? 'DEFAULT']?.handler;
	if (!picked) throw new Error('no handler matched, not even DEFAULT');
	return picked(error, {
		pluginId: 'googlesearchconsole',
		operation: 'sites.list',
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
	it.each([500, 503, 408])('retries a %i on a read', async (status) => {
		const strategy = await handlerFor(apiError(status, { method: 'GET' }));

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a 5xx on a sitemap submit', async () => {
		const strategy = await handlerFor(apiError(500, { method: 'PUT' }));

		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a dropped connection on a read', async () => {
		const strategy = await handlerFor(
			new GoogleSearchConsoleTransportError(
				'fetch failed',
				true,
				new TypeError('x'),
			),
		);

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a dropped connection on a write', async () => {
		const strategy = await handlerFor(
			new GoogleSearchConsoleTransportError(
				'fetch failed',
				false,
				new TypeError('x'),
			),
		);

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('merging', () => {
	it('keeps DEFAULT last after a caller adds a handler', async () => {
		const custom = googlesearchconsole({
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
