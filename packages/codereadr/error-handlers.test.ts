import type { CorsairErrorHandler } from 'corsair/core';
import { CodereadrAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/** Runs the first handler whose match accepts the error, as core does. */
async function strategyFor(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
) {
	const context = {
		pluginId: 'codereadr',
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

function providerError(code: number, replaySafe = false) {
	return new CodereadrAPIError(`CodeREADr error (code ${code})`, {
		code,
		replaySafe,
	});
}

describe('error handlers', () => {
	it('retries the per-minute limit code', async () => {
		const strategy = await strategyFor(providerError(111));
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('does not retry the per-day limit code, which resets at midnight', async () => {
		const strategy = await strategyFor(providerError(113));
		expect(strategy.maxRetries).toBe(0);
	});

	it('waits the documented minute when no Retry-After header exists', async () => {
		const strategy = await strategyFor(providerError(111));
		expect(strategy.headersRetryAfterMs).toBe(60_000);
	});

	it('does not retry an invalid API key', async () => {
		const strategy = await strategyFor(providerError(100));
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a missing API key', async () => {
		const strategy = await strategyFor(providerError(101));
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a missing account permission', async () => {
		const strategy = await strategyFor(providerError(10));
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a rejected variable', async () => {
		const strategy = await strategyFor(providerError(50));
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry an unknown record', async () => {
		const strategy = await strategyFor(providerError(200));
		expect(strategy.maxRetries).toBe(0);
	});

	it('retries the provider transient failure only on a replay-safe call', async () => {
		const readStrategy = await strategyFor(providerError(2, true));
		expect(readStrategy.maxRetries).toBeGreaterThan(0);

		const writeStrategy = await strategyFor(providerError(2, false));
		expect(writeStrategy.maxRetries).toBe(0);
	});

	it('retries a 5xx only on a replay-safe call', async () => {
		const readError = new CodereadrAPIError('HTTP 500', {
			status: 500,
			replaySafe: true,
		});
		expect((await strategyFor(readError)).maxRetries).toBeGreaterThan(0);

		const writeError = new CodereadrAPIError('HTTP 500', { status: 500 });
		expect((await strategyFor(writeError)).maxRetries).toBe(0);
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		const strategy = await strategyFor(zodError);
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry an unrecognized error', async () => {
		const strategy = await strategyFor(new Error('something else'));
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry an HTTP transport failure', async () => {
		const error = new CodereadrAPIError('CodeREADr HTTP 502', { status: 502 });
		const strategy = await strategyFor(error);
		expect(strategy.maxRetries).toBe(0);
	});

	it('retries an HTTP 429, which never carries a body code', async () => {
		const error = new CodereadrAPIError('CodeREADr HTTP 429', { status: 429 });
		const strategy = await strategyFor(error);
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('uses a real Retry-After delay instead of the one minute fallback', async () => {
		const error = new CodereadrAPIError('CodeREADr HTTP 429', {
			status: 429,
			retryAfter: 2_500,
		});
		const strategy = await strategyFor(error);
		expect(strategy.headersRetryAfterMs).toBe(2_500);
	});

	it('falls back to one minute when the server sent no Retry-After', async () => {
		const error = new CodereadrAPIError('CodeREADr HTTP 429', { status: 429 });
		const strategy = await strategyFor(error);
		expect(strategy.headersRetryAfterMs).toBe(60_000);
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last so it cannot shadow a specific handler', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a user handler under a new name win an overlapping match', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_RATE_LIMIT: {
				match: (error: Error) =>
					error instanceof CodereadrAPIError && error.code === 111,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys.indexOf('MY_RATE_LIMIT')).toBeLessThan(
			keys.indexOf('RATE_LIMIT_ERROR'),
		);
	});

	it('lets a user handler that reuses a builtin name win on its values', async () => {
		// The caller turning retries off must not be silently restored by the
		// builtin handler sitting under the same key.
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: (error: Error) =>
					error instanceof CodereadrAPIError && error.isRateLimit,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const strategy = await strategyFor(providerError(111), merged);
		expect(strategy.maxRetries).toBe(0);
	});

	it('keeps builtin handlers the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: {
				match: () => false,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
		expect(merged.SERVER_ERROR).toBe(errorHandlers.SERVER_ERROR);
	});

	it('returns the builtin handlers unchanged without user handlers', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
