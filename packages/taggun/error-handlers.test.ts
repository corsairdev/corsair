import type { CorsairErrorHandler } from 'corsair/core';
import { TaggunAPIError } from './client';
import { mergeErrorHandlers } from './error-handlers';

function taggunError(
	status: number | undefined,
	options: { method?: string; transport?: boolean; message?: string } = {},
): TaggunAPIError {
	return new TaggunAPIError(options.message ?? 'failure', {
		status,
		method: options.method,
		isTransportError: options.transport,
	});
}

/** The context core passes to every handler and matcher. */
function matcherContext(error: Error) {
	return {
		pluginId: 'taggun',
		operation: 'simple.url',
		input: {},
		originalError: error,
	};
}

async function strategyFor(
	error: Error,
): Promise<{ maxRetries?: number; headersRetryAfterMs?: number }> {
	const { errorHandlers } = await import('./error-handlers');
	// Viewed as the type core reads it by: the literal's own inference narrows
	// `match` to the single parameter each builtin happens to use.
	const handlers: CorsairErrorHandler = errorHandlers;
	// Core runs the first matcher that passes, in key order, and then that
	// entry's handler.
	const matched = Object.values(handlers).find(
		(entry) => entry?.match(error, matcherContext(error)) === true,
	);
	if (!matched) throw new Error('no error handler matched the error');
	return matched.handler(error, matcherContext(error));
}

describe('rate limits', () => {
	it('retries a rate-limited read and keeps the header delay', async () => {
		const error = new TaggunAPIError('Taggun 429: rate', {
			status: 429,
			method: 'GET',
			retryAfter: 7000,
		});

		const strategy = await strategyFor(error);

		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(7000);
	});

	it('retries a rate-limited write fewer times, since each attempt is a scan', async () => {
		const strategy = await strategyFor(taggunError(429, { method: 'POST' }));

		expect(strategy.maxRetries).toBe(2);
	});

	it('falls back to a fixed window when Taggun sends no Retry-After', async () => {
		const strategy = await strategyFor(taggunError(429, { method: 'POST' }));

		expect(strategy.headersRetryAfterMs).toBe(1000);
	});
});

describe('what never retries', () => {
	it.each([
		['a missing key', 401],
		['an invalid key', 403],
		['bad input', 400],
		['a missing campaign', 404],
		['a body over the size limit', 413],
		['an unsupported media type', 415],
	])('does not retry %s', async (_label, status) => {
		const strategy = await strategyFor(taggunError(status, { method: 'POST' }));

		expect(strategy.maxRetries).toBe(0);
	});

	it('does not retry a 400 naming the Campaign Validation feature', async () => {
		const error = new TaggunAPIError(
			'Taggun 400: Please contact Taggun for the feature Campaign Validation',
			{ status: 400, method: 'GET' },
		);

		expect(await strategyFor(error)).toMatchObject({ maxRetries: 0 });
	});

	it('does not retry a local schema rejection, which was never billed', async () => {
		const error = new Error('invalid input');
		error.name = 'ZodError';

		expect(await strategyFor(error)).toMatchObject({ maxRetries: 0 });
	});
});

describe('server errors', () => {
	it('retries a 500 on a read', async () => {
		const strategy = await strategyFor(taggunError(500, { method: 'GET' }));

		expect(strategy.maxRetries).toBe(2);
	});

	it('never replays a 500 on a write, which may have been billed', async () => {
		const strategy = await strategyFor(taggunError(500, { method: 'POST' }));

		expect(strategy.maxRetries).toBe(0);
	});

	it('never replays a 502 on a write, which Taggun may have already processed', async () => {
		expect(
			await strategyFor(taggunError(502, { method: 'POST' })),
		).toMatchObject({ maxRetries: 0 });
	});

	it('replays a 502 on a read, which changes nothing and is not billed', async () => {
		expect(
			await strategyFor(taggunError(502, { method: 'GET' })),
		).toMatchObject({
			maxRetries: 2,
		});
	});

	it('retries a dropped connection on a read but not on a write', async () => {
		const read = taggunError(undefined, { method: 'GET', transport: true });
		const write = taggunError(undefined, { method: 'POST', transport: true });

		expect(await strategyFor(read)).toMatchObject({ maxRetries: 1 });
		expect(await strategyFor(write)).toMatchObject({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	function handlerNames(handlers: object): string[] {
		return Object.keys(handlers);
	}

	it('puts a caller handler before DEFAULT, so it actually runs', async () => {
		const { errorHandlers } = await import('./error-handlers');
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		const names = await handlerNames(merged);
		expect(names[0]).toBe('CUSTOM_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');

		// The caller's handler must be the one core resolves for a 500 write,
		// which no builtin would retry.
		const error = taggunError(500, { method: 'POST' });
		const first = Object.entries(merged).find(([, handler]) =>
			handler?.match(error, matcherContext(error)),
		);
		expect(first?.[0]).toBe('CUSTOM_ERROR');
	});

	it('keeps every builtin the caller did not name', async () => {
		const { errorHandlers } = await import('./error-handlers');
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		const names = await handlerNames(merged);
		for (const builtin of Object.keys(errorHandlers)) {
			expect(names).toContain(builtin);
		}
	});

	it('uses the caller DEFAULT as the fallback', async () => {
		const { errorHandlers } = await import('./error-handlers');
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 5 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});

		expect(merged.DEFAULT).toBe(callerDefault);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtins untouched when the caller adds nothing', async () => {
		const { errorHandlers } = await import('./error-handlers');
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
