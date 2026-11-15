import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
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

describe('supportbee error handling', () => {
	it('retries a 429 with the Retry-After the desk sent', async () => {
		const error = new SupportbeeAPIError('rate limited', {
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
		const error = new SupportbeeAPIError('rate limited', { status: 429 });
		const strategy = await entry('RATE_LIMIT_ERROR').handler(error, context);

		// Assert absence: `not.toHaveProperty(key, value)` still passes when the
		// key exists with another value.
		expect(
			(strategy as Record<string, unknown>).headersRetryAfterMs,
		).toBeUndefined();
	});

	it('does not retry an auth failure', async () => {
		for (const status of [401, 403]) {
			const error = new SupportbeeAPIError('nope', { status });
			expect(entry('AUTH_ERROR').match(error, context)).toBe(true);
			expect(await entry('AUTH_ERROR').handler(error, context)).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not retry a 404', async () => {
		const error = new SupportbeeAPIError('Not Found', { status: 404 });

		expect(entry('NOT_FOUND_ERROR').match(error, context)).toBe(true);
		expect(await entry('NOT_FOUND_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 400 or a schema rejection', async () => {
		const error = new SupportbeeAPIError('bad field', { status: 400 });
		const zod = Object.assign(new Error('bad input'), { name: 'ZodError' });

		expect(entry('VALIDATION_ERROR').match(error, context)).toBe(true);
		expect(entry('VALIDATION_ERROR').match(zod, context)).toBe(true);
		expect(await entry('VALIDATION_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 5xx only for a read', async () => {
		const read = new SupportbeeAPIError('boom', {
			status: 503,
			method: 'GET',
		});
		const write = new SupportbeeAPIError('boom', {
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

	it('classifies the status getters', () => {
		expect(new SupportbeeAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new SupportbeeAPIError('x', { status: 403 }).isAuthError).toBe(true);
		expect(new SupportbeeAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new SupportbeeAPIError('x', { status: 429 }).isRateLimit).toBe(true);
		expect(new SupportbeeAPIError('x', { status: 500 }).isRateLimit).toBe(
			false,
		);
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
