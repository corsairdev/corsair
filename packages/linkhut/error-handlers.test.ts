import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ZodError } from 'zod';
import { LinkhutAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { unauthenticated } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match?.(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error): Promise<RetryStrategy> {
	const handler = errorHandlers[classify(error)].handler;
	if (!handler) throw new Error('the chosen handler has no handler');
	return handler(error);
}

function linkhutError(
	status: number | undefined,
	options: {
		code?: string;
		replayable?: boolean;
		retryAfter?: number;
		method?: 'GET';
		transport?: Error;
	} = {},
) {
	return new LinkhutAPIError(
		options.transport?.message ?? `Linkhut HTTP ${status ?? '?'} failed`,
		{
			status,
			code: options.code,
			replayable: options.replayable,
			retryAfter: options.retryAfter,
			method: options.method ?? 'GET',
			cause: options.transport,
		},
	);
}

describe('Linkhut error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = linkhutError(429, { replayable: true });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: undefined,
		});
	});

	it('retries a 429 even on a destructive GET, which was refused before it ran', async () => {
		const error = linkhutError(429, { replayable: false });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toMatchObject({ maxRetries: 2 });
	});

	it('passes a Retry-After value through as the fixed delay', async () => {
		const error = linkhutError(429, { replayable: true, retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 2000,
		});
	});

	it('retries a 500 on a read, which linkhut documents as a throttle signal', async () => {
		const error = linkhutError(500, { replayable: true });
		expect(error.isThrottled).toBe(true);
		expect(classify(error)).toBe('THROTTLED_ERROR');
		expect(await strategy(error)).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 500 on a destructive GET', async () => {
		const error = linkhutError(500, { replayable: false });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('separates the converging add from a delete on a 502', async () => {
		// posts.add is an upsert keyed by the url, so a 502 that already applied
		// converges when it is sent again. A delete does not, so it never replays.
		const add = linkhutError(502, { replayable: true });
		expect(classify(add)).toBe('THROTTLED_ERROR');
		expect(await strategy(add)).toMatchObject({ maxRetries: 2 });
		const deleteRequest = linkhutError(502, { replayable: false });
		expect(classify(deleteRequest)).toBe('DEFAULT');
		expect(await strategy(deleteRequest)).toEqual({ maxRetries: 0 });
	});

	it('retries a dropped connection on a read', async () => {
		const error = linkhutError(undefined, {
			replayable: true,
			transport: new TypeError('fetch failed'),
		});
		expect(error.isTransportError).toBe(true);
		expect(classify(error)).toBe('NETWORK_ERROR');
		expect(await strategy(error)).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a dropped connection on a destructive GET', async () => {
		const error = linkhutError(undefined, {
			replayable: false,
			transport: new TypeError('fetch failed'),
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a dropped connection on posts.add, which converges as an upsert', async () => {
		const error = linkhutError(undefined, {
			replayable: true,
			transport: new TypeError('fetch failed'),
		});
		expect(classify(error)).toBe('NETWORK_ERROR');
	});

	it('does not retry a 401 Unauthenticated', async () => {
		const error = linkhutError(401, { code: 'Unauthenticated' });
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		const error = linkhutError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404, 406, 422])('does not retry a %i', async (status) => {
		const error = linkhutError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input the schema refused', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a result_code failure that arrived at HTTP 200', async () => {
		// requireDone raises this: linkhut acted on the request and reported a
		// failure in the body, so no handler may send it again.
		const error = linkhutError(200, {
			code: 'something went wrong',
			replayable: false,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a plain Error from elsewhere', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('matches the 401 body shape Linkhut actually sends', () => {
		const body = unauthenticated;
		expect(body.errors[0]?.message).toBe('Unauthenticated');
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers as CorsairErrorHandler;

	it('leaves the builtins untouched when no caller handlers are given', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('runs a caller handler before the builtins and keeps DEFAULT last', () => {
		const caller: CorsairErrorHandler = {
			SERVER_ERROR: {
				match: () => true,
				handler: () => Promise.resolve({ maxRetries: 7 }),
			},
		};
		const merged = mergeErrorHandlers(builtin, caller);
		const names = Object.keys(merged);
		expect(names[0]).toBe('SERVER_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('prefers the caller DEFAULT over the builtin one', async () => {
		const callerDefault = {
			match: () => true,
			handler: () => Promise.resolve({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(builtin, { DEFAULT: callerDefault });
		expect(merged.DEFAULT).toBe(callerDefault);
		expect(
			await merged.DEFAULT?.handler(new Error('x'), {
				pluginId: 'linkhut',
				operation: 'test',
				input: {},
				originalError: new Error('x'),
			}),
		).toEqual({
			maxRetries: 9,
		});
	});

	it('lets a caller handler shadow a builtin it names', async () => {
		const callerAuth = {
			match: () => true,
			handler: () => Promise.resolve({ maxRetries: 3 }),
		};
		const merged = mergeErrorHandlers(builtin, { AUTH_ERROR: callerAuth });
		expect(merged.AUTH_ERROR).toBe(callerAuth);
	});
});
