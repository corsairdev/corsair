import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SupportbeeAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

const context = {
	pluginId: 'supportbee',
	operation: 'tickets.list',
	input: {},
	originalError: new Error('test'),
} as ErrorContext;

/**
 * The builtin map widened to the interface it satisfies. The literal narrows each
 * function to the arguments that literal passes, and a handler is documented to
 * take a context, so the tests call through the interface type.
 */
const handlers: CorsairErrorHandler = errorHandlers;

/** One entry, with the optional handled so a test does not need a guard. */
function entry(name: keyof CorsairErrorHandler) {
	const found = handlers[name];
	if (!found) throw new Error(`no handler named ${name}`);
	return found;
}

// HTTP failures reach the handlers as core's ApiError, as the client throws them.
function apiError(options: {
	status: number;
	method?: 'GET' | 'POST';
	retryAfter?: number;
}) {
	return new ApiError(
		{ method: options.method ?? 'GET', url: '/tickets' },
		{
			url: 'https://acme.supportbee.com/tickets',
			ok: false,
			status: options.status,
			statusText: '',
			body: undefined,
		},
		`SupportBee ${options.status}`,
		{ retryAfter: options.retryAfter },
	);
}

describe('supportbee error handling', () => {
	it('retries a 429 with the Retry-After the desk sent', async () => {
		const error = apiError({
			status: 429,
			retryAfter: 2000,
		});

		expect(entry('RATE_LIMIT_ERROR').match(error, context)).toBe(true);
		expect(await entry('RATE_LIMIT_ERROR').handler(error, context)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('sends no Retry-After when the desk did not', async () => {
		const error = apiError({ status: 429 });
		const strategy = await entry('RATE_LIMIT_ERROR').handler(error, context);

		// Assert absence: `not.toHaveProperty(key, value)` still passes when the
		// key exists with another value.
		expect(
			// unknown: the strategy type has no index signature, and this test
			// only checks that one key is absent.
			(strategy as Record<string, unknown>).headersRetryAfterMs,
		).toBeUndefined();
	});

	it('does not retry an auth failure', async () => {
		for (const status of [401, 403]) {
			const error = apiError({ status });
			expect(entry('AUTH_ERROR').match(error, context)).toBe(true);
			expect(await entry('AUTH_ERROR').handler(error, context)).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not retry a 404', async () => {
		const error = apiError({ status: 404 });

		expect(entry('NOT_FOUND_ERROR').match(error, context)).toBe(true);
		expect(await entry('NOT_FOUND_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 400 or a schema rejection', async () => {
		const error = apiError({ status: 400 });
		const zod = Object.assign(new Error('bad input'), { name: 'ZodError' });

		expect(entry('VALIDATION_ERROR').match(error, context)).toBe(true);
		expect(entry('VALIDATION_ERROR').match(zod, context)).toBe(true);
		expect(await entry('VALIDATION_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 5xx only for a read', async () => {
		const read = apiError({
			status: 503,
			method: 'GET',
		});
		const write = apiError({
			status: 503,
			method: 'POST',
		});

		expect(entry('SERVER_ERROR').match(read, context)).toBe(true);
		// A create that timed out may have committed, so it is not replayed.
		expect(entry('SERVER_ERROR').match(write, context)).toBe(false);
		expect(await entry('SERVER_ERROR').handler(read, context)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches a plain error only through DEFAULT', () => {
		const error = new Error('socket hang up');

		for (const name of [
			'RATE_LIMIT_ERROR',
			'AUTH_ERROR',
			'NOT_FOUND_ERROR',
			'VALIDATION_ERROR',
			'SERVER_ERROR',
		] as const) {
			expect(entry(name).match(error, context)).toBe(false);
		}
		expect(entry('DEFAULT').match(error, context)).toBe(true);
	});

	it('sends a transport failure with no status to DEFAULT', () => {
		const error = new SupportbeeAPIError('fetch failed', { method: 'GET' });
		expect(entry('SERVER_ERROR').match(error, context)).toBe(false);
		expect(entry('DEFAULT').match(error, context)).toBe(true);
	});
});

describe('supportbee error handler merging', () => {
	it('returns the builtin map when the caller passes none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts caller handlers first and keeps DEFAULT last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(Object.keys(merged)[0]).toBe('QUOTA_ERROR');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		const fallback = merged['DEFAULT'];
		expect(fallback).toBeDefined();
		// The caller's DEFAULT wins.
		expect(await fallback!.handler(new Error('x'), context)).toEqual({
			maxRetries: 1,
		});
	});

	it('lets a caller replace one builtin handler', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 5 }),
			},
		});

		const replaced = merged['AUTH_ERROR'];
		expect(replaced).toBeDefined();
		expect(await replaced!.handler(new Error('x'), context)).toEqual({
			maxRetries: 5,
		});
	});
});
