import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SwaggerhubAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

const context = {
	pluginId: 'swaggerhub',
	operation: 'apis.save',
	input: {},
	originalError: new Error('test'),
} as ErrorContext;

/**
 * The builtin map widened to the interface it satisfies. The literal narrows each
 * function to the arguments that literal passes, and a handler is documented to
 * take a context, so the tests call through the interface type.
 */
const handlers: CorsairErrorHandler = errorHandlers;

function entry(name: keyof CorsairErrorHandler) {
	const found = handlers[name];
	if (!found) throw new Error(`no handler named ${name}`);
	return found;
}

/** Core's HTTP error, the shape an HTTP failure reaches the handlers in. */
function apiError(status: number, method: 'GET' | 'POST' = 'GET'): ApiError {
	return new ApiError(
		{ method, url: '/apis/acme/petstore' },
		{
			url: 'https://api.swaggerhub.com/apis/acme/petstore',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		`HTTP ${status}`,
		{ retryAfter: status === 429 ? 1500 : undefined },
	);
}

describe('swaggerhub error handling', () => {
	it('leaves 429 retries to core, which already retried three times', async () => {
		const error = apiError(429);

		expect(entry('RATE_LIMIT_ERROR').match(error, context)).toBe(true);
		expect(await entry('RATE_LIMIT_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 1500,
		});
	});

	it("classifies core's ApiError by status", () => {
		expect(entry('AUTH_ERROR').match(apiError(401), context)).toBe(true);
		expect(entry('NOT_FOUND_ERROR').match(apiError(404), context)).toBe(true);
		expect(entry('VALIDATION_ERROR').match(apiError(415), context)).toBe(true);
		expect(entry('CONFLICT_ERROR').match(apiError(409), context)).toBe(true);
		expect(entry('SERVER_ERROR').match(apiError(503, 'GET'), context)).toBe(
			true,
		);
		expect(entry('SERVER_ERROR').match(apiError(503, 'POST'), context)).toBe(
			false,
		);
	});

	it('does not retry an auth failure', async () => {
		for (const status of [401, 403]) {
			const error = new SwaggerhubAPIError('nope', { status });
			expect(entry('AUTH_ERROR').match(error, context)).toBe(true);
			expect(await entry('AUTH_ERROR').handler(error, context)).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not retry a 404', async () => {
		const error = new SwaggerhubAPIError('Not Found', { status: 404 });

		expect(entry('NOT_FOUND_ERROR').match(error, context)).toBe(true);
		expect(await entry('NOT_FOUND_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 400, a 415 or a schema rejection', async () => {
		const zod = Object.assign(new Error('bad input'), { name: 'ZodError' });

		expect(
			entry('VALIDATION_ERROR').match(
				new SwaggerhubAPIError('bad', { status: 400 }),
				context,
			),
		).toBe(true);
		// 415 is a definition sent with a media type the route does not take, so
		// the same body fails again.
		expect(
			entry('VALIDATION_ERROR').match(
				new SwaggerhubAPIError('bad', { status: 415 }),
				context,
			),
		).toBe(true);
		expect(entry('VALIDATION_ERROR').match(zod, context)).toBe(true);
		expect(
			await entry('VALIDATION_ERROR').handler(
				new SwaggerhubAPIError('bad', { status: 400 }),
				context,
			),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 409', async () => {
		const error = new SwaggerhubAPIError('taken', { status: 409 });

		expect(entry('CONFLICT_ERROR').match(error, context)).toBe(true);
		expect(await entry('CONFLICT_ERROR').handler(error, context)).toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 5xx only for a read', async () => {
		const read = new SwaggerhubAPIError('boom', {
			status: 503,
			method: 'GET',
		});
		const write = new SwaggerhubAPIError('boom', {
			status: 503,
			method: 'POST',
		});

		expect(entry('SERVER_ERROR').match(read, context)).toBe(true);
		// A save that timed out may have committed, so it is not replayed.
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
			'CONFLICT_ERROR',
			'SERVER_ERROR',
		] as const) {
			expect(entry(name).match(error, context)).toBe(false);
		}
		expect(entry('DEFAULT').match(error, context)).toBe(true);
	});
});

describe('swaggerhub error handler merging', () => {
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
		expect(await fallback!.handler(new Error('x'), context)).toEqual({
			maxRetries: 1,
		});
	});

	it('lets a caller replace one builtin handler', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CONFLICT_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 4 }),
			},
		});

		const replaced = merged['CONFLICT_ERROR'];
		expect(replaced).toBeDefined();
		expect(await replaced!.handler(new Error('x'), context)).toEqual({
			maxRetries: 4,
		});
	});
});
