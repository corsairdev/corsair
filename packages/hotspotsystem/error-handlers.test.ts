import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { HotspotSystemTransportError } from './client';
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
	pluginId: 'hotspotsystem',
	operation: 'locations.list',
	input: {},
	originalError: new Error('placeholder'),
};

function failure(
	status: number | undefined,
	options: { retryAfter?: number } = {},
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/locations' },
		{
			url: 'https://api.hotspotsystem.com/v2.0/locations',
			ok: false,
			status: status ?? 0,
			statusText: '',
			body: undefined,
		},
		'boom',
		{ retryAfter: options.retryAfter },
	);
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
			[429, 'RATE_LIMIT_ERROR'],
			[500, 'SERVER_ERROR'],
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

	it('does not retry an auth, permission, not-found or validation failure', async () => {
		const names: HandlerName[] = [
			'AUTH_ERROR',
			'PERMISSION_ERROR',
			'NOT_FOUND_ERROR',
			'VALIDATION_ERROR',
		];
		const statuses = [401, 403, 404, 422];

		for (const [index, name] of names.entries()) {
			const decision = await decide(name, failure(statuses[index]));
			expect([name, decision.maxRetries]).toEqual([name, 0]);
		}
	});

	// Every operation is a GET, so a 5xx is always safe to repeat.
	it('retries a 5xx', async () => {
		expect((await decide('SERVER_ERROR', failure(500))).maxRetries).toBe(2);
		expect((await decide('SERVER_ERROR', failure(503))).maxRetries).toBe(2);
	});

	it('retries a 429 and waits the Retry-After it was given', async () => {
		expect(
			await decide('RATE_LIMIT_ERROR', failure(429, { retryAfter: 12_000 })),
		).toEqual({ maxRetries: 3, headersRetryAfterMs: 12_000 });
	});

	it('falls back to backoff when a 429 has no Retry-After', async () => {
		expect(await decide('RATE_LIMIT_ERROR', failure(429))).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	// A timeout and a reset both arrive with no status, so the flag the client
	// records is the only thing that tells them apart.
	it('routes a timeout to TIMEOUT_ERROR and a reset to NETWORK_ERROR', async () => {
		const timeout = new HotspotSystemTransportError('timed out', true);
		const reset = new HotspotSystemTransportError('reset', false);

		expect(entry('TIMEOUT_ERROR').match(timeout, context)).toBe(true);
		expect(entry('NETWORK_ERROR').match(timeout, context)).toBe(false);
		expect(entry('NETWORK_ERROR').match(reset, context)).toBe(true);
		expect((await decide('TIMEOUT_ERROR', timeout)).maxRetries).toBe(2);
		expect((await decide('NETWORK_ERROR', reset)).maxRetries).toBe(2);
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
	/** The first key whose match passes, which is how core picks a handler. */
	function resolve(
		merged: CorsairErrorHandler,
		error: Error,
	): string | undefined {
		return Object.keys(merged).find(
			(name) => name !== 'DEFAULT' && merged[name]?.match(error, context),
		);
	}

	it('returns the builtin map untouched when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_TEAPOT: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	// The trap: a caller key appended after the builtin DEFAULT never runs,
	// because core stops at the first match in key order.
	it('lets a caller handler run for a status no builtin covers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_TEAPOT: {
				match: (error) => error.message === 'teapot',
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		expect(resolve(merged, new Error('teapot'))).toBe('CUSTOM_TEAPOT');
	});

	it('keeps every builtin handler the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_TEAPOT: {
				match: (error) => error.message === 'teapot',
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		expect(resolve(merged, failure(401))).toBe('AUTH_ERROR');
		expect(resolve(merged, failure(500))).toBe('SERVER_ERROR');
	});
});
