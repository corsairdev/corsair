import type { CorsairErrorHandler } from 'corsair/core';
import { MailerLiteAPIError, RATE_LIMIT_FALLBACK_MS } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// The handler result, resolved the way core does: the first key whose match
// passes, in the merged map's insertion order.
async function decide(merged: CorsairErrorHandler, error: Error) {
	for (const entry of Object.values(merged)) {
		if (entry?.match(error, {} as never)) {
			return await entry.handler(error, {} as never);
		}
	}
	throw new Error('no handler matched');
}

function apiError(
	status: number,
	body: unknown, // unknown: each case states its own error body shape.
	method = 'GET',
	options: { retryAfter?: number; replayable?: boolean } = {},
) {
	return new MailerLiteAPIError(`MailerLite ${status} failure`, {
		status,
		body,
		method,
		retryAfter: options.retryAfter,
		replayable: options.replayable ?? false,
	});
}

describe('rate limit handling', () => {
	it('matches a 429 and keeps its Retry-After verbatim', async () => {
		const error = apiError(429, { message: 'Too Many Attempts.' }, 'GET', {
			retryAfter: 119_000,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result).toEqual({ maxRetries: 3, headersRetryAfterMs: 119_000 });
	});

	it('falls back to one minute when the header is absent', async () => {
		const error = apiError(429, { message: 'Too Many Attempts.' });

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.headersRetryAfterMs).toBe(RATE_LIMIT_FALLBACK_MS);
		expect(RATE_LIMIT_FALLBACK_MS).toBe(60_000);
	});

	it('never retries a non-429 as a rate limit', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(500, { message: 'x' })),
		).toBe(false);
	});
});

describe('non-retryable statuses', () => {
	it('treats 401 as an auth failure', async () => {
		const error = apiError(401, { message: 'Unauthenticated.' });
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(decide(errorHandlers, error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats 403 as a permission failure', () => {
		expect(errorHandlers.PERMISSION_ERROR.match(apiError(403, {}))).toBe(true);
	});

	it('treats 404 and 422 as validation failures', () => {
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(404, { message: 'Resource does not exist.' }))).toBe(true);
		expect(
			errorHandlers.VALIDATION_ERROR.match(
				apiError(422, { message: 'The given data was invalid.' }),
			),
		).toBe(true);
	});
});

describe('replay safety', () => {
	it('never replays a 5xx on a non-idempotent write', async () => {
		const error = apiError(500, { message: 'Server error' }, 'POST', {
			replayable: false,
		});

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(false);
		await expect(decide(errorHandlers, error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('replays a 5xx on the email upsert, which upserts by design', async () => {
		const error = apiError(502, { message: 'Bad gateway' }, 'POST', {
			replayable: true,
		});

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result).toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('replays a transport failure on a read', async () => {
		const error = new MailerLiteAPIError('fetch failed', {
			method: 'GET',
			replayable: true,
			transport: true,
		});

		expect(errorHandlers.TRANSPORT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.TRANSPORT_ERROR.handler(error);
		expect(result).toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
	});

	it('never replays a transport failure on a schedule send', async () => {
		const error = new MailerLiteAPIError('fetch failed', {
			method: 'POST',
			replayable: false,
			transport: true,
		});

		await expect(decide(errorHandlers, error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin handlers when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: {
				match: () => false,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(Object.keys(merged)).toContain('CUSTOM');
	});

	// Under builtin-first ordering ({ ...builtinRest, ...userRest }) the builtin
	// RATE_LIMIT_ERROR sits ahead of the caller's key, claims the shared error
	// first, and this assertion fails with maxRetries 3.
	it('lets a caller handler win over an overlapping builtin match', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			NO_RETRIES_ON_LIMIT: {
				match: (error: Error) =>
					error instanceof MailerLiteAPIError && error.status === 429,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		const error = apiError(429, { message: 'Too Many Attempts.' });
		await expect(decide(merged, error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('uses the caller DEFAULT when one is supplied', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		// A 429 still reaches the builtin rate-limit handler first.
		await expect(decide(merged, apiError(429, {}))).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: RATE_LIMIT_FALLBACK_MS,
		});
		// An error no builtin matches reaches the caller's DEFAULT, which
		// replaced the builtin one.
		await expect(decide(merged, apiError(500, {}, 'POST'))).resolves.toEqual({
			maxRetries: 1,
		});
	});
});
