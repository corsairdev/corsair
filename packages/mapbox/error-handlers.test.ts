import type { CorsairErrorHandler } from 'corsair/core';
import { MapboxAPIError } from './client';
import {
	errorHandlers,
	MAPBOX_RATE_LIMIT_WINDOW_MS,
	mergeErrorHandlers,
} from './error-handlers';
import { mapbox } from './index';

/**
 * Which handler core would pick, and what it tells the caller to do. Core takes
 * the first key, in order, whose `match` passes (core/errors/handler.ts).
 */
async function resolve(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
) {
	const context = {
		pluginId: 'mapbox',
		operation: 'directions.route',
		input: {},
		originalError: error,
	};
	const name = Object.keys(handlers).find((key) =>
		handlers[key]?.match(error, context),
	);
	const strategy = (await handlers[name ?? 'DEFAULT']?.handler(
		error,
		context,
	)) ?? { maxRetries: 0 };
	return { name, strategy };
}

const http = (
	status: number,
	extra: ConstructorParameters<typeof MapboxAPIError>[1] = {},
) =>
	new MapboxAPIError(`Mapbox ${status}`, { status, method: 'GET', ...extra });

describe('Mapbox error handlers', () => {
	describe('429', () => {
		it('retries twice and waits for the x-rate-limit-reset delay', async () => {
			const { name, strategy } = await resolve(
				http(429, { retryAfter: 12_000 }),
			);

			expect(name).toBe('RATE_LIMIT_ERROR');
			expect(strategy.maxRetries).toBe(2);
			expect(strategy.headersRetryAfterMs).toBe(12_000);
		});

		it('falls back to the documented 60 second window when no header came', async () => {
			const { strategy } = await resolve(http(429));

			expect(MAPBOX_RATE_LIMIT_WINDOW_MS).toBe(60_000);
			expect(strategy.headersRetryAfterMs).toBe(60_000);
			expect(strategy.maxRetries).toBe(2);
		});
	});

	describe('failures that a retry cannot fix', () => {
		it.each([
			['AUTH_ERROR', 401],
			['PERMISSION_ERROR', 403],
			['NOT_FOUND_ERROR', 404],
			['VALIDATION_ERROR', 400],
			['VALIDATION_ERROR', 422],
		])('%s for %i is never retried', async (expected, status) => {
			const { name, strategy } = await resolve(http(status));

			expect(name).toBe(expected);
			expect(strategy.maxRetries).toBe(0);
		});

		it('treats a ZodError from input validation as a validation error', async () => {
			const zodError = Object.assign(new Error('bad input'), {
				name: 'ZodError',
			});

			const { name, strategy } = await resolve(zodError);

			expect(name).toBe('VALIDATION_ERROR');
			expect(strategy.maxRetries).toBe(0);
		});

		it.each(['NoRoute', 'NoSegment', 'NotImplemented'])(
			'does not retry a 200 %s',
			async (code) => {
				const { name, strategy } = await resolve(http(200, { code }));

				expect(name).toBe('ROUTING_ERROR');
				expect(strategy.maxRetries).toBe(0);
			},
		);

		it('falls through to DEFAULT for a code it does not list on a 200', async () => {
			const { name, strategy } = await resolve(http(200, { code: 'Mystery' }));

			expect(name).toBe('DEFAULT');
			expect(strategy.maxRetries).toBe(0);
		});
	});

	describe('retryable failures', () => {
		it.each([500, 502, 503])('retries a GET that got a %i', async (status) => {
			const { name, strategy } = await resolve(http(status));

			expect(name).toBe('SERVER_ERROR');
			expect(strategy.maxRetries).toBe(2);
			expect(strategy.retryStrategy).toBe('exponential_backoff');
		});

		it('does not replay a 5xx that did not come from a GET', async () => {
			const { name, strategy } = await resolve(http(503, { method: 'POST' }));

			expect(name).toBe('DEFAULT');
			expect(strategy.maxRetries).toBe(0);
		});

		it('retries a dropped connection, which never reached Mapbox', async () => {
			const { name, strategy } = await resolve(
				new MapboxAPIError('Mapbox request failed: fetch failed', {
					method: 'GET',
					transport: true,
				}),
			);

			expect(name).toBe('TRANSPORT_ERROR');
			expect(strategy.maxRetries).toBe(2);
		});

		it('does not replay a transport failure on a non-GET', async () => {
			const { name } = await resolve(
				new MapboxAPIError('boom', { method: 'POST', transport: true }),
			);

			expect(name).toBe('DEFAULT');
		});
	});

	it('ends with DEFAULT, which does not retry', async () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');

		const { name, strategy } = await resolve(new Error('anything else'));

		expect(name).toBe('DEFAULT');
		expect(strategy.maxRetries).toBe(0);
	});
});

describe('mergeErrorHandlers', () => {
	const custom = {
		QUOTA_ERROR: {
			match: (error: Error) =>
				error instanceof MapboxAPIError && error.status === 402,
			handler: async () => ({ maxRetries: 0 }),
		},
		SERVER_ERROR: {
			match: (error: Error) =>
				error instanceof MapboxAPIError && error.status === 500,
			handler: async () => ({ maxRetries: 7 }),
		},
	} satisfies CorsairErrorHandler;

	it('returns the builtin handlers when the caller gave none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts caller handlers first and keeps DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);
		const names = Object.keys(merged);

		expect(names.slice(0, 2)).toEqual(['QUOTA_ERROR', 'SERVER_ERROR']);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names.filter((name) => name === 'SERVER_ERROR')).toHaveLength(1);
	});

	it('runs a caller handler for a status no builtin covers, before DEFAULT claims it', async () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		const { name } = await resolve(http(402), merged);

		expect(name).toBe('QUOTA_ERROR');
	});

	it('lets the caller override a builtin by name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		const { name, strategy } = await resolve(http(500), merged);

		expect(name).toBe('SERVER_ERROR');
		expect(strategy.maxRetries).toBe(7);
	});

	it('still reaches the builtin handlers the caller did not name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		const { name } = await resolve(http(429), merged);

		expect(name).toBe('RATE_LIMIT_ERROR');
	});

	it('uses a caller DEFAULT as the final fallback', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		const { name, strategy } = await resolve(new Error('x'), merged);

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(name).toBe('DEFAULT');
		expect(strategy.maxRetries).toBe(9);
	});

	it('is what the plugin installs', () => {
		const plugin = mapbox({ errorHandlers: custom });

		expect(Object.keys(plugin.errorHandlers ?? {}).slice(0, 2)).toEqual([
			'QUOTA_ERROR',
			'SERVER_ERROR',
		]);
		expect(Object.keys(plugin.errorHandlers ?? {}).at(-1)).toBe('DEFAULT');
	});
});
