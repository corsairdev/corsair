import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GeocodioAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/** An HTTP failure as core's request() throws it. */
function httpError(
	status: number,
	method: 'GET' | 'POST' | 'DELETE' = 'GET',
	retryAfter?: number,
) {
	return new ApiError(
		{ method, url: '/geocode' },
		{
			url: 'https://api.geocod.io/v2.1/geocode',
			ok: false,
			status,
			statusText: '',
			body: { error: 'failed' },
		},
		`Geocodio ${status}: failed`,
		{ retryAfter },
	);
}

/** A request that got no answer. */
function transportError(method: 'GET' | 'POST' | 'DELETE', timedOut = false) {
	return new GeocodioAPIError('failed', { method, transport: true, timedOut });
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
	const handlers: CorsairErrorHandler = errorHandlers;
	const context: ErrorContext = {
		pluginId: 'geocodio',
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
	it("does not retry a 429 again, since core's request() already did", async () => {
		await expect(resolve(httpError(429, 'GET', 30_000))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry an invalid key, which answers 403', async () => {
		await expect(resolve(httpError(403))).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401 either', async () => {
		await expect(resolve(httpError(401))).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry an address the API could not use', async () => {
		await expect(resolve(httpError(422))).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a Zod failure', async () => {
		const zodError = new Error('invalid');
		zodError.name = 'ZodError';

		await expect(resolve(zodError)).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a missing list or job', async () => {
		await expect(resolve(httpError(404))).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a 5xx on a single GET lookup', async () => {
		await expect(resolve(httpError(500, 'GET'))).resolves.toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a batch POST after a 5xx, since its lookups may be billed', async () => {
		await expect(resolve(httpError(502, 'POST'))).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('does not replay a DELETE after a 5xx, since it may have landed', async () => {
		await expect(resolve(httpError(500, 'DELETE'))).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('retries a GET timeout once, and a timeout outranks the transport match', async () => {
		await expect(resolve(transportError('GET', true))).resolves.toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_2s',
		});
	});

	it('does not replay a batch that timed out', async () => {
		await expect(resolve(transportError('POST', true))).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('retries a dropped GET twice', async () => {
		await expect(resolve(transportError('GET'))).resolves.toMatchObject({
			maxRetries: 2,
		});
	});

	it('does not replay a dropped DELETE', async () => {
		await expect(resolve(transportError('DELETE'))).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('leaves an unclassified error alone, through DEFAULT', async () => {
		await expect(resolve(new Error('something else'))).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtins when there are no caller handlers', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts a caller handler first but keeps DEFAULT last', () => {
		const custom: CorsairErrorHandler = {
			CUSTOM: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(Object.keys(merged)[0]).toBe('CUSTOM');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.DEFAULT).toBe(custom.DEFAULT);
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});

	it('lets a caller replace one builtin without losing the rest', () => {
		const custom: CorsairErrorHandler = {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(merged.AUTH_ERROR).toBe(custom.AUTH_ERROR);
		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
	});
});
