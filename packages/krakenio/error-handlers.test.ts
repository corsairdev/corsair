import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KrakenAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// An answered request fails as core's ApiError; a 200 with `success: false`
// or a request that got no answer as KrakenAPIError.
function apiError(options: {
	status?: number;
	method?: string;
	transport?: boolean;
	timedOut?: boolean;
	retryAfter?: number;
	url?: string;
}): Error {
	if (options.status === undefined) {
		return new KrakenAPIError('failed', options);
	}
	return new ApiError(
		{ method: 'POST', url: options.url ?? '/v1/url' },
		{
			url: `https://api.kraken.io${options.url ?? '/v1/url'}`,
			ok: false,
			status: options.status,
			statusText: '',
			body: { success: false, message: 'failed' },
		},
		'failed',
		{ retryAfter: options.retryAfter },
	);
}

/**
 * The first handler whose `match` passes, as core runs them: key order, with
 * DEFAULT last.
 */
// unknown: a handler result is a Partial of the retry options, and each test
// reads a different field of it.
async function resolve(
	error: Error,
): Promise<Record<string, unknown> | undefined> {
	// Every builtin handler ignores the context, but the map is typed as the
	// full handler contract here so both arguments can be passed.
	const handlers: CorsairErrorHandler = errorHandlers;
	const context: ErrorContext = {
		pluginId: 'krakenio',
		operation: 'test',
		input: {},
		originalError: error,
	};
	for (const entry of Object.values(handlers)) {
		if (!entry) continue;
		if (entry.match(error, context)) {
			return (await entry.handler(error, context)) as Record<string, unknown>;
		}
	}
	return undefined;
}

describe('error handler selection', () => {
	it('adds no 429 retries to the three core already made', async () => {
		await expect(resolve(apiError({ status: 429 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('reads the 404 from /user_status as an auth failure', async () => {
		await expect(
			resolve(apiError({ status: 404, url: '/user_status' })),
		).resolves.toEqual({ maxRetries: 0 });
		expect(
			errorHandlers.AUTH_ERROR.match(
				apiError({ status: 404, url: '/user_status' }),
			),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(apiError({ status: 404, url: '/v1/url' })),
		).toBe(false);
	});

	it('does not retry an unknown key', async () => {
		await expect(resolve(apiError({ status: 401 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a spent quota', async () => {
		await expect(resolve(apiError({ status: 403 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it.each([[400], [422]])('does not retry a %i', async (status) => {
		await expect(resolve(apiError({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('never replays an optimization after a 5xx, which may have been billed', async () => {
		await expect(
			resolve(apiError({ status: 500, method: 'POST' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('never replays a dropped connection, since Kraken may have billed it', async () => {
		await expect(
			resolve(apiError({ transport: true, method: 'POST' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('never replays a timeout either', async () => {
		await expect(
			resolve(apiError({ transport: true, timedOut: true, method: 'POST' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		await expect(resolve(zodError)).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry anything else', async () => {
		await expect(resolve(new Error('something else'))).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('puts a caller handler where it runs, ahead of DEFAULT', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			UPSTREAM_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(Object.keys(merged)[0]).toBe('UPSTREAM_ERROR');
		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
	});

	it('keeps every builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			UPSTREAM_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		for (const name of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(name);
		}
	});

	it('lets a caller override a builtin by name', () => {
		const custom = {
			match: () => false,
			handler: async () => ({ maxRetries: 9 }),
		};

		const merged = mergeErrorHandlers(errorHandlers, { AUTH_ERROR: custom });

		expect(merged.AUTH_ERROR).toBe(custom);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('uses the caller DEFAULT as the fallback and keeps it last', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};

		const merged = mergeErrorHandlers(errorHandlers, { DEFAULT: custom });

		expect(merged.DEFAULT).toBe(custom);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtin map when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
