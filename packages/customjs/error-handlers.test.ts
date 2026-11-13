import type { CorsairErrorHandler } from 'corsair/core';
import { CustomjsAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function error(
	status: number | undefined,
	options: {
		providerMessage?: string;
		replayable?: boolean;
		retryAfter?: number;
	} = {},
) {
	return new CustomjsAPIError(`CustomJS ${status}: something`, {
		method: 'POST',
		replayable: options.replayable ?? true,
		status,
		providerMessage: options.providerMessage,
		retryAfter: options.retryAfter,
	});
}

/**
 * Runs one handler and returns its policy. The return type is the handler's own,
 * so no cast is needed.
 */
async function decide(handler: CorsairErrorHandler[string], value: Error) {
	if (!handler?.handler) return undefined;
	return handler.handler(value, {} as never);
}

/** The first handler whose `match` passes, in key order, as core runs them. */
function resolve(handlers: CorsairErrorHandler, value: Error) {
	for (const [name, entry] of Object.entries(handlers)) {
		if (entry?.match?.(value, {} as never)) return name;
	}
	return undefined;
}

describe('error handler matching', () => {
	it.each([
		[
			'an exhausted window (403 with the message)',
			error(403, { providerMessage: 'Too Many Requests' }),
			'RATE_LIMIT_ERROR',
		],
		['a 429', error(429), 'RATE_LIMIT_ERROR'],
		[
			'a 403 naming the key',
			error(403, { providerMessage: 'Api Key is invalid' }),
			'AUTH_ERROR',
		],
		['a 401', error(401), 'AUTH_ERROR'],
		['a 400', error(400), 'VALIDATION_ERROR'],
		['a 404', error(404), 'VALIDATION_ERROR'],
		['a 500 that can be replayed', error(500), 'SERVER_ERROR'],
		[
			'a 500 that cannot be replayed',
			error(500, { replayable: false }),
			'DEFAULT',
		],
	])('routes %s to %s', (_, value, expected) => {
		expect(resolve(errorHandlers, value)).toBe(expected);
	});

	// A rate limit and a bad key share the 403 status, so ordering decides it: the
	// rate-limit handler has to sit first, or an exhausted window reports a bad key.
	it('tests the rate limit before the auth failure', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			keys.indexOf('AUTH_ERROR'),
		);
	});

	it('puts DEFAULT last, because it matches everything', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});

describe('error handler decisions', () => {
	it('retries a rate limit and carries the Retry-After it was given', async () => {
		const decision = await decide(
			errorHandlers.RATE_LIMIT_ERROR,
			error(403, { providerMessage: 'Too Many Requests', retryAfter: 30_000 }),
		);

		expect(decision).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 30_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	// The live 403 for an exhausted day carries no Retry-After; a retry within
	// the same day cannot succeed.
	it('does not retry an exhausted daily quota (403, no Retry-After)', async () => {
		const decision = await decide(
			errorHandlers.RATE_LIMIT_ERROR,
			error(403, { providerMessage: 'Too Many Requests' }),
		);

		expect(decision).toMatchObject({ maxRetries: 0 });
	});

	it('waits a minute on a 429 that names no reset time', async () => {
		const decision = await decide(errorHandlers.RATE_LIMIT_ERROR, error(429));

		expect(decision).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 60_000,
		});
	});

	it('never retries a bad key', async () => {
		await expect(
			decide(errorHandlers.AUTH_ERROR, error(401)),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('never retries a malformed request', async () => {
		await expect(
			decide(errorHandlers.VALIDATION_ERROR, error(400)),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a 500 on a render, because repeating it leaves nothing behind', async () => {
		await expect(
			decide(errorHandlers.SERVER_ERROR, error(500)),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	// Publishing is the case that matters: a 500 may have created the page before
	// it failed, and a replay would publish a second one.
	it('gives up on a 500 during a page creation', async () => {
		const publishFailure = error(500, { replayable: false });

		expect(resolve(errorHandlers, publishFailure)).toBe('DEFAULT');
		await expect(
			decide(errorHandlers.DEFAULT, publishFailure),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a transport failure for a read', async () => {
		const dropped = new CustomjsAPIError('fetch failed', {
			method: 'POST',
			replayable: true,
		});

		expect(resolve(errorHandlers, dropped)).toBe('NETWORK_ERROR');
		await expect(
			decide(errorHandlers.NETWORK_ERROR, dropped),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('gives up on a transport failure it must not replay', async () => {
		const dropped = new CustomjsAPIError('fetch failed', {
			method: 'POST',
			replayable: false,
		});

		await expect(
			decide(errorHandlers.NETWORK_ERROR, dropped),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('gives a timeout its own bounded retry', async () => {
		const timeout = new CustomjsAPIError(
			'CustomJS request timed out after 120s',
			{ method: 'POST', replayable: true },
		);

		expect(resolve(errorHandlers, timeout)).toBe('TIMEOUT_ERROR');
		await expect(
			decide(errorHandlers.TIMEOUT_ERROR, timeout),
		).resolves.toMatchObject({ maxRetries: 2 });
	});
});

describe('mergeErrorHandlers', () => {
	const custom: CorsairErrorHandler = {
		MY_HANDLER: {
			match: (value: Error) => value.message.includes('mine'),
			handler: async () => ({ maxRetries: 7 }),
		},
		DEFAULT: {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		},
	};

	it('returns the builtins when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	// Core takes the first handler in key order, so a caller key that lands after
	// the builtin DEFAULT never runs at all.
	it('puts the caller handlers first and keeps DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);
		const keys = Object.keys(merged);

		expect(keys[0]).toBe('MY_HANDLER');
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toEqual(
			expect.arrayContaining(['RATE_LIMIT_ERROR', 'AUTH_ERROR']),
		);
	});

	it('keeps a builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
	});

	// Without this, a caller handler for a status no builtin covers would be
	// shadowed by the trailing DEFAULT and never called.
	it('lets a caller handler resolve an error the builtins miss', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);
		const onlyMine = new Error('mine');

		expect(resolve(errorHandlers, onlyMine)).toBe('DEFAULT');
		expect(resolve(merged, onlyMine)).toBe('MY_HANDLER');
	});

	it('uses the caller DEFAULT when one is given', async () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);

		await expect(
			decide(merged.DEFAULT, new Error('anything')),
		).resolves.toMatchObject({ maxRetries: 9 });
	});

	it('lets a caller replace a builtin by name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 4 }),
			},
		});

		await expect(decide(merged.AUTH_ERROR, error(401))).resolves.toMatchObject({
			maxRetries: 4,
		});
		expect(Object.keys(merged)).toContain('RATE_LIMIT_ERROR');
	});
});
