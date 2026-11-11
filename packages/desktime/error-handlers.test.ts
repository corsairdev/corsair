import type { CorsairErrorHandler } from 'corsair/core';
import { DeskTimeAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/** Runs the first handler whose match accepts the error, as core does. */
async function strategyFor(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
) {
	const context = {
		pluginId: 'desktime',
		operation: 'test',
		input: {},
		originalError: error,
	};
	for (const entry of Object.values(handlers)) {
		const handler = entry?.handler;
		if (!handler) continue;
		if (entry.match(error, context)) {
			return handler(error, context);
		}
	}
	throw new Error('no handler matched');
}

describe('error handlers', () => {
	it('retries a 429', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('rate limited', { status: 429 }),
		);
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('uses a real Retry-After delay when the server sends one', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('rate limited', { status: 429, retryAfter: 2_000 }),
		);
		expect(strategy.headersRetryAfterMs).toBe(2_000);
	});

	it('falls back to one minute when there is no Retry-After', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('rate limited', { status: 429 }),
		);
		expect(strategy.headersRetryAfterMs).toBe(60_000);
	});

	it('does not retry a missing or invalid key', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('DeskTime 401: API Key is invalid', {
				status: 401,
				code: 401,
			}),
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a deactivated key', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('DeskTime 403: app key was deactivated', {
				status: 403,
			}),
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a 5xx on a replay-safe read', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('DeskTime 500', { status: 500 }),
		);
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		const strategy = await strategyFor(zodError);
		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a transport failure that never reached the provider', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('fetch failed', { transport: true }),
		);
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('bounds the transport retries rather than retrying forever', async () => {
		const strategy = await strategyFor(
			new DeskTimeAPIError('fetch failed', { transport: true }),
		);
		expect(strategy.maxRetries).toBeLessThanOrEqual(3);
	});

	it('does not retry an unrecognized error', async () => {
		const strategy = await strategyFor(new Error('something else'));
		expect(strategy.maxRetries).toBe(0);
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 9 }) },
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a caller override a builtin name and win on its value', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: (error: Error) =>
					error instanceof DeskTimeAPIError && error.isRateLimit,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const strategy = await strategyFor(
			new DeskTimeAPIError('rate limited', { status: 429 }),
			merged,
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('runs a caller handler for a status no builtin covers', async () => {
		// Under a builtin-first spread DEFAULT would claim this first, because
		// core takes the first match in key order.
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_SERVER: {
				match: (error: Error) =>
					error instanceof DeskTimeAPIError && error.status === 500,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		const strategy = await strategyFor(
			new DeskTimeAPIError('Server error', { status: 500 }),
			merged,
		);
		expect(strategy.maxRetries).toBe(7);
	});

	it('keeps builtin handlers the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_SERVER: {
				match: () => false,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
		expect(merged.TRANSPORT_ERROR).toBe(errorHandlers.TRANSPORT_ERROR);
	});

	it('returns the builtin handlers unchanged without user handlers', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
