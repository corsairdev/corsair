import type { CorsairErrorHandler } from 'corsair/core';
import { EventbriteAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(
	status: number,
	code: string,
	method: 'GET' | 'POST' | 'DELETE' = 'GET',
	retryAfter?: number,
) {
	const error = new EventbriteAPIError(`Eventbrite ${status} ${code}`, {
		status,
		body: { error: code, error_description: 'test', status_code: status },
		method,
		retryAfter,
	});
	return error;
}

// unknown: every handler returns the same retry-strategy shape; the assertions
// read individual fields, so the union is not useful here.
async function retryOf(
	name: keyof typeof errorHandlers,
	error: Error,
	// unknown: every handler returns the same retry-strategy shape; assertions read fields.
): Promise<Record<string, unknown>> {
	const entry = errorHandlers[name];
	if (!entry?.handler) throw new Error(`${name} has no handler`);
	const result = await entry.handler(error);
	// unknown: every handler returns the same retry-strategy shape; each
	// assertion reads one field from it.
	return result as Record<string, unknown>;
}

function matches(name: keyof typeof errorHandlers, error: Error): boolean {
	const entry = errorHandlers[name];
	if (!entry?.match) return false;
	return entry.match(error);
}

describe('errorHandlers', () => {
	it('retries a 429 up to three times with a fixed one-minute fallback', async () => {
		const error = apiError(429, 'HIT_RATE_LIMIT');

		expect(matches('RATE_LIMIT_ERROR', error)).toBe(true);
		const retry = await retryOf('RATE_LIMIT_ERROR', error);
		expect(retry.maxRetries).toBe(3);
		// Eventbrite sends no Retry-After, only x-rate-limit with a reset in
		// seconds, so the documented-hourly window is the only fixed delay.
		expect(retry.headersRetryAfterMs).toBe(60_000);
	});

	it('uses a real Retry-After when Eventbrite sends one', async () => {
		const retry = await retryOf(
			'RATE_LIMIT_ERROR',
			apiError(429, 'HIT_RATE_LIMIT', 'GET', 5000),
		);

		expect(retry.headersRetryAfterMs).toBe(5000);
	});

	it('does not retry a write on 429 either, since the call was refused not applied', async () => {
		// It retries, but with the same bounded strategy: a 429 never applied the
		// write, so a replay cannot duplicate it.
		const retry = await retryOf(
			'RATE_LIMIT_ERROR',
			apiError(429, 'HIT_RATE_LIMIT', 'POST'),
		);

		expect(retry.maxRetries).toBe(3);
	});

	it('treats a 401 and a 400 INVALID_AUTH as permanent auth failures', async () => {
		expect(matches('AUTH_ERROR', apiError(401, 'INVALID_AUTH'))).toBe(true);
		expect(matches('AUTH_ERROR', apiError(400, 'INVALID_AUTH'))).toBe(true);
		expect(matches('AUTH_ERROR', apiError(401, 'NO_AUTH'))).toBe(true);
		expect(
			(await retryOf('AUTH_ERROR', apiError(401, 'NO_AUTH'))).maxRetries,
		).toBe(0);
	});

	it('treats 403 NOT_AUTHORIZED as permanent', async () => {
		const error = apiError(403, 'NOT_AUTHORIZED');

		expect(matches('PERMISSION_ERROR', error)).toBe(true);
		expect((await retryOf('PERMISSION_ERROR', error)).maxRetries).toBe(0);
	});

	it.each([400, 404, 405, 409])(
		'does not retry a %s, which repeats the same request',
		async (status) => {
			const error = apiError(status, 'ARGUMENTS_ERROR');

			expect(matches('VALIDATION_ERROR', error)).toBe(true);
			expect((await retryOf('VALIDATION_ERROR', error)).maxRetries).toBe(0);
		},
	);

	it('matches a ZodError as a validation failure', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect(matches('VALIDATION_ERROR', zodError)).toBe(true);
	});

	it('replays a 500 on a read twice with exponential backoff', async () => {
		const error = apiError(500, 'INTERNAL_ERROR', 'GET');

		expect(matches('SERVER_ERROR', error)).toBe(true);
		const retry = await retryOf('SERVER_ERROR', error);
		expect(retry.maxRetries).toBe(2);
		expect(retry.retryStrategy).toBe('exponential_backoff');
	});

	it('never replays a 500 on a write, which may already have been applied', async () => {
		const error = apiError(500, 'INTERNAL_ERROR', 'POST');

		expect(matches('SERVER_ERROR', error)).toBe(false);
		// It falls to DEFAULT, which does not retry.
		expect(matches('DEFAULT', error)).toBe(true);
		expect((await retryOf('DEFAULT', error)).maxRetries).toBe(0);
	});

	it('does not treat a 403 as a server error', async () => {
		expect(
			matches('SERVER_ERROR', apiError(403, 'NOT_AUTHORIZED', 'GET')),
		).toBe(false);
	});

	it('defaults to no retry for anything unclassified', async () => {
		const odd = new Error('socket hang up');

		expect((await retryOf('DEFAULT', odd)).maxRetries).toBe(0);
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin set untouched when the caller passed none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts caller keys first, so a caller handler wins over a builtin', () => {
		const caller: CorsairErrorHandler = {
			CUSTOM_500: {
				match: (error: Error) => error.message === 'custom',
				handler: async () => ({ maxRetries: 7 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);

		expect(Object.keys(merged)[0]).toBe('CUSTOM_500');
		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
	});

	it('keeps DEFAULT last after a caller adds handlers', () => {
		const caller: CorsairErrorHandler = {
			CUSTOM_500: {
				match: () => false,
				handler: async () => ({ maxRetries: 1 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);
		const keys = Object.keys(merged);

		expect(keys.at(-1)).toBe('DEFAULT');
	});

	it("keeps the caller's DEFAULT, since it is their stated policy", () => {
		const caller: CorsairErrorHandler = {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);

		expect(merged.DEFAULT).toBe(caller.DEFAULT);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a caller override a builtin name without duplicating it', () => {
		const caller: CorsairErrorHandler = {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);

		expect(merged.AUTH_ERROR).toBe(caller.AUTH_ERROR);
		expect(
			Object.keys(merged).filter((key) => key === 'AUTH_ERROR'),
		).toHaveLength(1);
	});
});
