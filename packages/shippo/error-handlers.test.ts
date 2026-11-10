import type { CorsairErrorHandler } from 'corsair/core';
import { ShippoAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(
	status: number,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
	retryAfter?: number,
) {
	return new ShippoAPIError(`Shippo ${status}`, {
		status,
		body: { detail: 'test' },
		method,
		retryAfter,
	});
}

// unknown: every handler returns the same retry-strategy shape; each assertion
// reads one field from it.
async function retryOf(
	name: keyof typeof errorHandlers,
	error: Error,
	// unknown: every handler returns the same retry-strategy shape; each
	// assertion reads one field from it.
): Promise<Record<string, unknown>> {
	const entry = errorHandlers[name];
	if (!entry?.handler) throw new Error(`${name} has no handler`);
	const result = await entry.handler(error);
	// unknown: see the return type above.
	return result as Record<string, unknown>;
}

function matches(name: keyof typeof errorHandlers, error: Error): boolean {
	const entry = errorHandlers[name];
	if (!entry?.match) return false;
	return entry.match(error);
}

describe('errorHandlers', () => {
	it('retries a 429 with a one-minute default, since every window is a minute', async () => {
		const error = apiError(429);

		expect(matches('RATE_LIMIT_ERROR', error)).toBe(true);
		const retry = await retryOf('RATE_LIMIT_ERROR', error);
		expect(retry.maxRetries).toBe(3);
		// Shippo sends no Retry-After; a full minute clears any window.
		expect(retry.headersRetryAfterMs).toBe(60_000);
	});

	it('prefers a real Retry-After when one is present', async () => {
		const retry = await retryOf('RATE_LIMIT_ERROR', apiError(429, 'GET', 2000));

		expect(retry.headersRetryAfterMs).toBe(2000);
	});

	it('does not retry a 401, which is a bad token', async () => {
		expect(matches('AUTH_ERROR', apiError(401))).toBe(true);
		expect((await retryOf('AUTH_ERROR', apiError(401))).maxRetries).toBe(0);
	});

	it.each([400, 404, 409, 422])(
		'does not retry a %s, which repeats the same request',
		async (status) => {
			const error = apiError(status);

			expect(matches('VALIDATION_ERROR', error)).toBe(true);
			expect((await retryOf('VALIDATION_ERROR', error)).maxRetries).toBe(0);
		},
	);

	it('matches a ZodError as a validation failure', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(matches('VALIDATION_ERROR', zodError)).toBe(true);
	});

	it('replays a 500 on a read', async () => {
		const error = apiError(500, 'GET');

		expect(matches('SERVER_ERROR', error)).toBe(true);
		const retry = await retryOf('SERVER_ERROR', error);
		expect(retry.maxRetries).toBe(2);
		expect(retry.retryStrategy).toBe('exponential_backoff');
	});

	it.each(['POST', 'PUT', 'DELETE'] as const)(
		'never replays a %s on a 5xx, since a label buy may have been applied',
		(method) => {
			expect(matches('SERVER_ERROR', apiError(500, method))).toBe(false);
		},
	);

	it('defaults to no retry for anything unclassified', async () => {
		expect(
			(await retryOf('DEFAULT', new Error('socket hang up'))).maxRetries,
		).toBe(0);
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin set untouched when the caller passed none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts caller keys first, so a caller handler wins over a builtin', () => {
		const caller: CorsairErrorHandler = {
			CUSTOM: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);

		expect(Object.keys(merged)[0]).toBe('CUSTOM');
		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
	});

	it('keeps DEFAULT last after a caller adds handlers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 1 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it("keeps the caller's DEFAULT, since it is their stated policy", () => {
		const caller: CorsairErrorHandler = {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);

		expect(merged.DEFAULT).toBe(caller.DEFAULT);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});
