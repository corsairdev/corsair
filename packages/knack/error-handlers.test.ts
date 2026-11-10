import type { CorsairErrorHandler } from 'corsair/core';
import { KnackAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { invalidApiKey, malformedRecordId, rateLimited } from './test-fixtures';

/** Builds the error the client would raise for a documented response. */
function apiError(
	status: number,
	messages: string[],
	method = 'GET',
	retryAfter?: number,
): KnackAPIError {
	return new KnackAPIError(`Knack ${status}`, {
		status,
		method,
		messages,
		retryAfter,
	});
}

/** Finds the first handler that matches, the way core resolves them. */
type RetryStrategy = Awaited<
	ReturnType<NonNullable<CorsairErrorHandler['DEFAULT']>['handler']>
>;

async function resolve(
	error: Error,
): Promise<{ name: string; result: RetryStrategy }> {
	for (const [name, entry] of Object.entries(errorHandlers)) {
		if (!entry.match(error)) continue;
		return { name, result: await entry.handler(error) };
	}
	throw new Error('No handler matched, which DEFAULT should prevent');
}

describe('error handler classification', () => {
	// Knack documents a one-second window, so a short retry is the documented
	// behaviour.
	it('retries the per-second rate limit', async () => {
		const { name, result } = await resolve(apiError(429, [rateLimited]));

		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	it('waits a second when Knack sends no reset information', async () => {
		const { result } = await resolve(apiError(429, [rateLimited]));

		expect(result.headersRetryAfterMs).toBe(1_000);
	});

	it('honours a supplied reset delay', async () => {
		const { result } = await resolve(apiError(429, [rateLimited], 'GET', 800));

		expect(result.headersRetryAfterMs).toBe(800);
	});

	// A daily plan limit answers the same 429, and a reset far in the future is
	// that allowance rather than the one-second window, so retrying is wasted.
	it('does not retry when the reset is far away', async () => {
		const { name, result } = await resolve(
			apiError(429, [rateLimited], 'GET', 3_600_000),
		);

		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry an invalid key', async () => {
		const { name, result } = await resolve(apiError(401, [invalidApiKey]));

		expect(name).toBe('AUTH_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a 403 for an app without API access', async () => {
		const { name } = await resolve(apiError(403, ['Forbidden']));

		expect(name).toBe('AUTH_ERROR');
	});

	it('does not retry a rejected field or a malformed id', async () => {
		const { name, result } = await resolve(
			apiError(
				400,
				[malformedRecordId.errors[0] ?? 'Malformed Record ID.'],
				'POST',
			),
		);

		expect(name).toBe('VALIDATION_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a schema failure before any request', async () => {
		const zodLike = Object.assign(new Error('Invalid input'), {
			name: 'ZodError',
		});

		const { name } = await resolve(zodLike);

		expect(name).toBe('VALIDATION_ERROR');
	});
});

describe('server failures', () => {
	it('retries a 500 on a read', async () => {
		const { name, result } = await resolve(
			apiError(500, ['Server error'], 'GET'),
		);

		expect(name).toBe('SERVER_ERROR');
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	// A write that failed this way may already have been applied, and Knack
	// documents no idempotency key.
	it('never replays a write', async () => {
		const { name, result } = await resolve(
			apiError(500, ['Server error'], 'POST'),
		);

		expect(name).toBe('DEFAULT');
		expect(result.maxRetries).toBe(0);
	});

	it('never replays a delete', async () => {
		const { name } = await resolve(apiError(502, ['Bad gateway'], 'DELETE'));

		expect(name).toBe('DEFAULT');
	});
});

describe('unrecognised failures', () => {
	it('falls back to no retry', async () => {
		const { name, result } = await resolve(new Error('something odd'));

		expect(name).toBe('DEFAULT');
		expect(result.maxRetries).toBe(0);
	});

	it('keeps DEFAULT last so a specific handler is reached first', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtins unchanged when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	// A caller's handler for a status no builtin covers has to run, and a plain
	// spread would keep the builtin position where DEFAULT claims it first.
	it('puts a caller handler before DEFAULT so it can match', () => {
		const custom = {
			CUSTOM: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		} as CorsairErrorHandler;

		const names = Object.keys(mergeErrorHandlers(errorHandlers, custom));

		expect(names[0]).toBe('CUSTOM');
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('keeps the caller value for a handler both declare', async () => {
		const custom = {
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		} as CorsairErrorHandler;

		const merged = mergeErrorHandlers(errorHandlers, custom);
		const result = await merged.RATE_LIMIT_ERROR?.handler(
			new Error('x'),
			// never: the handler under test ignores its context argument.
			{} as never,
		);

		expect(result).toEqual({ maxRetries: 9 });
	});

	it('keeps every builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {} as CorsairErrorHandler);

		for (const name of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(name);
		}
	});
});
