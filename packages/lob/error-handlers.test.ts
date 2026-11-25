import { LobAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// unknown: CorsairErrorHandler allows caller-defined keys, so the builtin map
// is indexed here as a plain record of match/handler entries.
type HandlerEntry = {
	match: (error: Error) => boolean;
	handler: (error: Error) => Promise<unknown>;
};
const handlers = errorHandlers as Record<string, HandlerEntry>;

function run(name: string, error: Error) {
	return handlers[name]?.match(error);
}

function outcome(name: string, error: Error) {
	const entry = handlers[name];
	if (!entry?.match(error)) return undefined;
	return entry.handler(error);
}

describe('error handler matching', () => {
	it('matches a plain 429 and a body-coded 429 as rate limits', () => {
		expect(
			run(
				'RATE_LIMIT_ERROR',
				new LobAPIError('Lob 429: too many', { status: 429 }),
			),
		).toBe(true);
		expect(
			run(
				'RATE_LIMIT_ERROR',
				new LobAPIError('coded', { code: 'rate_limit_exceeded' }),
			),
		).toBe(true);
		expect(run('RATE_LIMIT_ERROR', new LobAPIError('nope'))).toBe(false);
	});

	it('backs rate-limit retries off 5 seconds, from the documented window', async () => {
		const plan = await outcome(
			'RATE_LIMIT_ERROR',
			new LobAPIError('Lob 429', { status: 429 }),
		);
		expect(plan).toMatchObject({ maxRetries: 2, headersRetryAfterMs: 5_000 });
	});

	it('gives a real Retry-After from the error priority', async () => {
		// Core applies headersRetryAfterMs verbatim; when Lob itself (or a
		// gateway) sends Retry-After, the client copies it onto the error and
		// core's own header path wins over the fallback.
		const error = new LobAPIError('Lob 429', {
			status: 429,
			retryAfter: 1_500,
		});
		expect(error.retryAfter).toBe(1_500);
	});

	it('matches auth failures on 401 and the three auth codes', async () => {
		for (const error of [
			new LobAPIError('a', { status: 401 }),
			new LobAPIError('a', { code: 'unauthorized' }),
			new LobAPIError('a', { code: 'invalid_api_key' }),
			new LobAPIError('a', { code: 'publishable_key_not_allowed' }),
		]) {
			expect(run('AUTH_ERROR', error)).toBe(true);
			expect(await outcome('AUTH_ERROR', error)).toMatchObject({
				maxRetries: 0,
			});
		}
	});

	it('never retries validation failures', async () => {
		for (const status of [400, 404, 413, 422]) {
			const error = new LobAPIError('bad', { status });
			expect(run('VALIDATION_ERROR', error)).toBe(true);
			expect(await outcome('VALIDATION_ERROR', error)).toMatchObject({
				maxRetries: 0,
			});
		}
		const zod = new (class extends Error {
			name = 'ZodError';
		})();
		expect(run('VALIDATION_ERROR', zod)).toBe(true);
	});

	it('matches conflicts on 409', () => {
		expect(run('CONFLICT_ERROR', new LobAPIError('c', { status: 409 }))).toBe(
			true,
		);
	});

	it('retries a timeout only for a replay-safe request', async () => {
		const read = await outcome(
			'TIMEOUT_ERROR',
			new LobAPIError('t', { status: 408, method: 'GET' }),
		);
		expect(read).toMatchObject({ maxRetries: 1 });

		const write = await outcome(
			'TIMEOUT_ERROR',
			new LobAPIError('t', { status: 408, method: 'POST' }),
		);
		expect(write).toMatchObject({ maxRetries: 0 });

		const keyed = await outcome(
			'TIMEOUT_ERROR',
			new LobAPIError('t', {
				status: 408,
				method: 'POST',
				hasIdempotency: true,
			}),
		);
		expect(keyed).toMatchObject({ maxRetries: 1 });
	});

	it('retries a 5xx only for a replay-safe request', async () => {
		for (const status of [500, 503]) {
			const read = await outcome(
				'SERVER_ERROR',
				new LobAPIError('s', { status, method: 'GET' }),
			);
			expect(read).toMatchObject({ maxRetries: 1 });
		}

		const write = await outcome(
			'SERVER_ERROR',
			new LobAPIError('s', { status: 500, method: 'POST' }),
		);
		expect(write).toMatchObject({ maxRetries: 0 });

		const keyedSend = await outcome(
			'SERVER_ERROR',
			new LobAPIError('s', {
				status: 500,
				method: 'POST',
				hasIdempotency: true,
			}),
		);
		expect(keyedSend).toMatchObject({ maxRetries: 1 });
	});

	it('retries a transport failure for a read, never for a keyless send', async () => {
		const dropped = new LobAPIError('fetch failed', {
			method: 'GET',
			transportFailure: true,
		});
		expect(run('TRANSPORT_ERROR', dropped)).toBe(true);
		expect(await outcome('TRANSPORT_ERROR', dropped)).toMatchObject({
			maxRetries: 1,
		});

		const keyedSend = await outcome(
			'TRANSPORT_ERROR',
			new LobAPIError('fetch failed', {
				method: 'POST',
				hasIdempotency: true,
				transportFailure: true,
			}),
		);
		expect(keyedSend).toMatchObject({ maxRetries: 1 });

		const keylessSend = await outcome(
			'TRANSPORT_ERROR',
			new LobAPIError('fetch failed', { method: 'POST', transportFailure: true }),
		);
		expect(keylessSend).toMatchObject({ maxRetries: 0 });

		// An HTTP error is not a transport failure even without a retryable shape.
		expect(
			run(
				'TRANSPORT_ERROR',
				new LobAPIError('Lob 400', { status: 400, method: 'GET' }),
			),
		).toBe(false);
		// No builtin above TRANSPORT_ERROR claims a statusless error, but the
		// flag is what routes it, not the absence of a status.
		expect(run('SERVER_ERROR', dropped)).toBe(false);
	});

	it('keeps DEFAULT matching everything and last in the map', () => {
		expect(run('DEFAULT', new Error('anything'))).toBe(true);
		const keys = Object.keys(errorHandlers);
		expect(keys.at(-1)).toBe('DEFAULT');
	});

	it('leaves a caller handler for an uncovered status ahead of DEFAULT', () => {
		const builtin = mergeErrorHandlers(errorHandlers, {
			PERMISSION_ERROR: {
				match: (error) => error instanceof LobAPIError && error.status === 403,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(builtin);
		expect(names.indexOf('PERMISSION_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('lets a caller handler for a builtin-covered status claim the error first', () => {
		// The caller names UPSTREAM_ERROR for 503; the builtin SERVER_ERROR also
		// matches 503 on a read. Core takes the first match in key order, so the
		// caller's key must sit ahead of the builtin's, or its handler would
		// never run even though its value is present.
		const merged = mergeErrorHandlers(errorHandlers, {
			UPSTREAM_ERROR: {
				match: (error) => error instanceof LobAPIError && error.status === 503,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		const entries = merged as Record<string, HandlerEntry>;
		const error = new LobAPIError('Lob 503', { status: 503, method: 'GET' });
		const firstMatch = Object.entries(entries).find(
			([, entry]) => entry.match(error),
		)?.[0];
		expect(firstMatch).toBe('UPSTREAM_ERROR');
		expect(Object.keys(entries).at(-1)).toBe('DEFAULT');
	});

	it('lets a caller override a builtin handler and keeps the fallback', async () => {
		const builtin = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: (error) => error instanceof LobAPIError && error.isRateLimit,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		// A merged entry is a Partial, so the handler takes both arguments.
		const plan = await builtin.RATE_LIMIT_ERROR?.handler(
			new LobAPIError('x', { status: 429 }),
			{} as never,
		);
		expect(plan).toMatchObject({ maxRetries: 9 });
	});
});
