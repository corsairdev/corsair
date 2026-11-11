import type { CorsairErrorHandler } from 'corsair/core';
import { EventzillaAPIError, EventzillaTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Strategy = {
	maxRetries?: number;
	retryStrategy?: string;
	headersRetryAfterMs?: number;
};

/** Runs the first handler whose match passes, the way core does. */
async function resolve(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
): Promise<Strategy> {
	const context = {
		pluginId: 'eventzilla',
		operation: 'test',
		input: {},
		originalError: error,
	};
	for (const entry of Object.values(handlers)) {
		if (!entry?.match || !entry.handler) continue;
		if (entry.match(error, context)) {
			// Safe: the strategy a handler returns only carries the retry fields
			// read here; core's type is the wider RetryStrategy.
			return (await entry.handler(error, context)) as Strategy;
		}
	}
	throw new Error('No handler matched, and DEFAULT matches everything');
}

function apiError(options: {
	status?: number;
	method?: string;
	retryAfter?: number;
	kind?: EventzillaAPIError['kind'];
	code?: string;
}) {
	return new EventzillaAPIError('boom', options);
}

let consoleErrorSpy: jest.SpyInstance;

beforeEach(() => {
	consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	consoleErrorSpy.mockRestore();
});

describe('errorHandlers', () => {
	it('does not retry a missing or rejected key', async () => {
		expect(await resolve(apiError({ status: 401, method: 'GET' }))).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a route that does not exist', async () => {
		expect(
			await resolve(
				apiError({ status: 403, method: 'POST', kind: 'invalid_route' }),
			),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry a real permission refusal', async () => {
		expect(await resolve(apiError({ status: 403, method: 'GET' }))).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 400 or a 404', async () => {
		expect(await resolve(apiError({ status: 400, method: 'POST' }))).toEqual({
			maxRetries: 0,
		});
		expect(
			await resolve(
				apiError({ status: 404, method: 'GET', kind: 'not_found' }),
			),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry a zod parse failure', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		expect(await resolve(zodError)).toEqual({ maxRetries: 0 });
	});

	it('retries a 429 with the Retry-After it was given', async () => {
		const strategy = await resolve(
			apiError({ status: 429, method: 'POST', retryAfter: 5000 }),
		);
		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(5000);
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	/**
	 * Eventzilla documents no rate limit at all, so there is no documented
	 * window to fall back on; the fallback is short and a real Retry-After
	 * always wins over it.
	 */
	it('falls back to a short fixed wait when a 429 carries no Retry-After', async () => {
		const strategy = await resolve(apiError({ status: 429, method: 'GET' }));
		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(1000);
	});

	it('replays a 5xx on a read', async () => {
		const strategy = await resolve(apiError({ status: 503, method: 'GET' }));
		expect(strategy.maxRetries).toBe(2);
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	it('never replays a 5xx on a write', async () => {
		// The write may have landed, and none of Eventzilla's writes are
		// documented as idempotent.
		for (const method of ['POST', 'PATCH']) {
			expect(await resolve(apiError({ status: 500, method }))).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('replays a transport failure on a read', async () => {
		const strategy = await resolve(
			new EventzillaTransportError('reset', 'network', 'GET'),
		);
		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a transport failure on a write', async () => {
		expect(
			await resolve(new EventzillaTransportError('reset', 'network', 'POST')),
		).toEqual({ maxRetries: 0 });
	});

	it('does not replay a timeout, even on a read', async () => {
		// The request may have been received and completed server-side.
		expect(
			await resolve(
				new EventzillaTransportError('timed out', 'timeout', 'GET'),
			),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry an unrecognised error', async () => {
		expect(await resolve(new Error('something else'))).toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	const builtin: CorsairErrorHandler = {
		A: { match: () => false, handler: async () => ({ maxRetries: 1 }) },
		DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
	};

	it('returns the builtin map when the caller adds nothing', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('puts a caller handler ahead of the builtin default', async () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
		});

		// The trap: a builtin-first spread would keep this handler after DEFAULT
		// and it would never run.
		expect(await resolve(new Error('x'), merged)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last', () => {
		const merged = mergeErrorHandlers(builtin, {
			ZEBRA: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a caller DEFAULT replace the builtin one', async () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 7 }) },
		});
		expect(await resolve(new Error('x'), merged)).toEqual({ maxRetries: 7 });
	});

	it('keeps every builtin handler the caller did not name', () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});
		expect(merged.A).toBe(builtin.A);
	});

	it('lets a caller override a builtin by name', async () => {
		const merged = mergeErrorHandlers(builtin, {
			A: { match: () => true, handler: async () => ({ maxRetries: 5 }) },
		});
		expect(await resolve(new Error('x'), merged)).toEqual({ maxRetries: 5 });
	});

	it('merges the shipped handlers without losing DEFAULT', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SOMETHING: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(Object.keys(merged)).toContain('RATE_LIMIT_ERROR');
	});
});
