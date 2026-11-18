import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { HoneybadgerAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = Exclude<keyof typeof errorHandlers, 'DEFAULT'>;

/**
 * The object literal's own functions take fewer arguments than the handler
 * contract, because most of them ignore the context. Core calls them through
 * `CorsairErrorHandler`, so the test does too.
 */
const handlers: CorsairErrorHandler = errorHandlers;

function entry(name: keyof CorsairErrorHandler) {
	const found = handlers[name];
	if (!found) throw new Error(`No handler registered as ${name}`);
	return found;
}

const context: ErrorContext = {
	pluginId: 'honeybadger',
	operation: 'faults.update',
	input: {},
	originalError: new Error('placeholder'),
};

function failure(
	status: number | undefined,
	options: {
		code?: string;
		retryAfter?: number;
		replayable?: boolean;
		timedOut?: boolean;
	} = {},
): HoneybadgerAPIError {
	return new HoneybadgerAPIError('boom', {
		status,
		code: options.code,
		retryAfter: options.retryAfter,
		method: 'GET',
		replayable: options.replayable ?? true,
		timedOut: options.timedOut,
	});
}

/** Runs one named handler and returns its retry decision. */
async function decide(
	name: HandlerName,
	error: Error,
): Promise<{ maxRetries?: number; headersRetryAfterMs?: number }> {
	const named = entry(name);
	if (!named.match(error, context)) {
		throw new Error(`${name} does not match ${error.message}`);
	}
	return named.handler(error, context);
}

describe('error handlers', () => {
	it('classifies each documented failure status to one handler', () => {
		const cases: Array<[number, HandlerName]> = [
			[401, 'AUTH_ERROR'],
			[403, 'PERMISSION_ERROR'],
			[404, 'NOT_FOUND_ERROR'],
			[400, 'BAD_REQUEST_ERROR'],
			[422, 'VALIDATION_ERROR'],
			[409, 'CONFLICT_ERROR'],
			[429, 'RATE_LIMIT_ERROR'],
			[503, 'SERVER_ERROR'],
		];

		for (const [status, expected] of cases) {
			const matching = (
				Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
			).filter((key) => entry(key).match(failure(status), context));
			// DEFAULT matches everything, so it is present on every row.
			expect(matching.filter((key) => key !== 'DEFAULT')).toEqual([expected]);
		}
	});

	it('treats a rejected input schema as a bad request, not a retry', async () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(entry('BAD_REQUEST_ERROR').match(zodError, context)).toBe(true);
		expect(await decide('BAD_REQUEST_ERROR', zodError)).toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 429 and waits the documented Retry-After', async () => {
		const error = failure(429, {
			code: 'rate_limit_exceeded',
			retryAfter: 12_000,
		});

		expect(await decide('RATE_LIMIT_ERROR', error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 12_000,
		});
	});

	it('falls back to exponential backoff when a 429 has no Retry-After', async () => {
		const error = failure(429, { code: 'concurrent_request' });

		expect(await decide('RATE_LIMIT_ERROR', error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	// A 429 is the provider refusing before it acted, so even a write repeats.
	it('retries a 429 on a write', async () => {
		const error = failure(429, {
			code: 'rate_limit_exceeded',
			replayable: false,
		});

		expect((await decide('RATE_LIMIT_ERROR', error)).maxRetries).toBe(3);
	});

	it('replays a 5xx only when the call is safe to repeat', async () => {
		expect(
			(await decide('SERVER_ERROR', failure(503, { replayable: true })))
				.maxRetries,
		).toBe(2);
		expect(
			(await decide('SERVER_ERROR', failure(503, { replayable: false })))
				.maxRetries,
		).toBe(0);
	});

	it('replays a transport failure for a read and not for a write', async () => {
		const droppedRead = failure(undefined, { replayable: true });
		const droppedWrite = failure(undefined, { replayable: false });

		expect(entry('NETWORK_ERROR').match(droppedRead, context)).toBe(true);
		expect((await decide('NETWORK_ERROR', droppedRead)).maxRetries).toBe(2);
		expect((await decide('NETWORK_ERROR', droppedWrite)).maxRetries).toBe(0);
	});

	// A timeout arrives with no status, exactly like a reset connection, so the
	// flag the client records is the only thing that tells them apart.
	it('routes a timeout to TIMEOUT_ERROR and a reset to NETWORK_ERROR', async () => {
		const timeout = failure(undefined, { timedOut: true });
		const reset = failure(undefined);

		expect(entry('TIMEOUT_ERROR').match(timeout, context)).toBe(true);
		// NETWORK_ERROR excludes a timeout, so only one of them matches.
		expect(entry('NETWORK_ERROR').match(timeout, context)).toBe(false);
		expect(entry('NETWORK_ERROR').match(reset, context)).toBe(true);
		expect((await decide('TIMEOUT_ERROR', timeout)).maxRetries).toBe(2);
	});

	it('does not retry a timeout on a write', async () => {
		const timeout = failure(undefined, { timedOut: true, replayable: false });

		expect((await decide('TIMEOUT_ERROR', timeout)).maxRetries).toBe(0);
	});

	it('does not retry an auth, permission, not-found or validation failure', async () => {
		const names: HandlerName[] = [
			'AUTH_ERROR',
			'PERMISSION_ERROR',
			'NOT_FOUND_ERROR',
			'VALIDATION_ERROR',
			'CONFLICT_ERROR',
		];
		const statuses = [401, 403, 404, 422, 409];

		for (const [index, name] of names.entries()) {
			const decision = await decide(name, failure(statuses[index]));
			expect([name, decision.maxRetries]).toEqual([name, 0]);
		}
	});

	it('has a DEFAULT that stops everything else', async () => {
		const result = await entry('DEFAULT').handler(
			new Error('anything'),
			context,
		);
		expect(result).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	function custom(): CorsairErrorHandler {
		return {
			CUSTOM_418: {
				match: (error) => error.message === 'teapot',
				handler: async () => ({ maxRetries: 7 }),
			},
		};
	}

	/** The first key whose match passes, which is how core picks a handler. */
	function resolve(
		handlers: CorsairErrorHandler,
		error: Error,
	): string | undefined {
		return Object.keys(handlers).find(
			(name) => name !== 'DEFAULT' && handlers[name]?.match(error, context),
		);
	}

	it('returns the builtin map untouched when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom());
		const keys = Object.keys(merged);
		expect(keys.at(-1)).toBe('DEFAULT');
	});

	// The trap: a caller key appended after the builtin DEFAULT never runs,
	// because core stops at the first match in key order.
	it('lets a caller handler run for a status no builtin covers', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom());
		const teapot = new Error('teapot');

		expect(resolve(merged, teapot)).toBe('CUSTOM_418');
	});

	it('keeps every builtin handler the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, custom());

		expect(resolve(merged, failure(401))).toBe('AUTH_ERROR');
		expect(resolve(merged, failure(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('lets a caller override a builtin of the same name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: (error) => error.message === 'boom',
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect(resolve(merged, failure(401))).toBe('AUTH_ERROR');
		// Read through the handler contract, since the caller's literal ignores
		// the context its type still declares.
		const overridden = merged.AUTH_ERROR as CorsairErrorHandler['AUTH_ERROR'];
		await expect(
			overridden?.handler(new Error('boom'), context),
		).resolves.toEqual({ maxRetries: 9 });
	});
});
