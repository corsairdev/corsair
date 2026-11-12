import type { CorsairErrorHandler } from 'corsair/core';
import { MemberSpotAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/** Runs the first handler whose match accepts the error, as core does. */
async function strategyFor(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
) {
	const context = {
		pluginId: 'memberspot',
		operation: 'test',
		input: {},
		originalError: error,
	};
	for (const entry of Object.values(handlers)) {
		const handler = entry?.handler;
		if (!handler) continue;
		if (entry.match(error, context)) return handler(error, context);
	}
	throw new Error('no handler matched');
}

describe('error handlers', () => {
	it('retries a 429', async () => {
		const strategy = await strategyFor(
			new MemberSpotAPIError('rate limited', { status: 429 }),
		);
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('honours a Retry-After on a 429', async () => {
		const strategy = await strategyFor(
			new MemberSpotAPIError('rate limited', {
				status: 429,
				retryAfter: 1_500,
			}),
		);
		expect(strategy.headersRetryAfterMs).toBe(1_500);
	});

	it('falls back to a minute when no Retry-After is sent', async () => {
		const strategy = await strategyFor(
			new MemberSpotAPIError('rate limited', { status: 429 }),
		);
		expect(strategy.headersRetryAfterMs).toBe(60_000);
	});

	it('does not retry an invalid key', async () => {
		const strategy = await strategyFor(
			new MemberSpotAPIError('MemberSpot 401: Unauthorized', { status: 401 }),
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 400 that reports a missing key', async () => {
		// MemberSpot answers 400, not 401, when the header is absent.
		const strategy = await strategyFor(
			new MemberSpotAPIError('MemberSpot 400: API key is missing', {
				status: 400,
			}),
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 400 that is a rejected DTO', async () => {
		const strategy = await strategyFor(
			new MemberSpotAPIError('MemberSpot 400: email must be an email', {
				status: 400,
			}),
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a transport failure only when the call was replay-safe', async () => {
		const safe = await strategyFor(
			new MemberSpotAPIError('fetch failed', {
				transport: true,
				replaySafe: true,
			}),
		);
		expect(safe.maxRetries).toBeGreaterThan(0);

		const unsafe = await strategyFor(
			new MemberSpotAPIError('fetch failed', {
				transport: true,
				replaySafe: false,
			}),
		);
		expect(unsafe.maxRetries).toBe(0);
	});

	it('retries a 5xx only when the call was replay-safe', async () => {
		const safe = await strategyFor(
			new MemberSpotAPIError('MemberSpot 500', {
				status: 500,
				replaySafe: true,
			}),
		);
		expect(safe.maxRetries).toBeGreaterThan(0);

		const unsafe = await strategyFor(
			new MemberSpotAPIError('MemberSpot 500', { status: 500 }),
		);
		expect(unsafe.maxRetries).toBe(0);
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		expect((await strategyFor(zodError)).maxRetries).toBe(0);
	});

	it('does not retry an unrecognized error', async () => {
		expect((await strategyFor(new Error('other'))).maxRetries).toBe(0);
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
					error instanceof MemberSpotAPIError && error.isRateLimit,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		expect(
			(
				await strategyFor(
					new MemberSpotAPIError('rate limited', { status: 429 }),
					merged,
				)
			).maxRetries,
		).toBe(0);
	});

	it('runs a caller handler for a status no builtin covers', async () => {
		// Under a builtin-first spread DEFAULT would claim this first.
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_4XX: {
				match: (error: Error) =>
					error instanceof MemberSpotAPIError && error.status === 404,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		expect(
			(
				await strategyFor(
					new MemberSpotAPIError('MemberSpot 404', { status: 404 }),
					merged,
				)
			).maxRetries,
		).toBe(7);
	});

	it('keeps builtins the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_4XX: { match: () => false, handler: async () => ({ maxRetries: 1 }) },
		});
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
		expect(merged.TRANSPORT_ERROR).toBe(errorHandlers.TRANSPORT_ERROR);
	});

	it('returns the builtins unchanged without a caller', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
