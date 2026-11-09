import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { OnedeskAPIError, OnedeskTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// Core calls match and handler with the operation's context. The operation
// name is what decides replay safety here, because OneDesk's reads are POSTs
// and its timer actions are GETs.
const context: ErrorContext = {
	pluginId: 'onedesk',
	operation: 'items.filter',
	input: {},
	originalError: new Error('placeholder'),
};

function ctxFor(operation: string): ErrorContext {
	return { ...context, operation };
}

// The plugin's own map is narrowed by `satisfies`; core calls it through the
// wider type, so the test does too.
const handlers: CorsairErrorHandler = errorHandlers;

type HandlerResult = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
};

async function run(
	name: keyof typeof errorHandlers,
	error: Error,
	ctx: ErrorContext = context,
): Promise<HandlerResult> {
	const entry = handlers[name];
	if (!entry?.match(error, ctx)) throw new Error(`${name} did not match`);
	const result = await entry.handler?.(error, ctx);
	return {
		maxRetries: result?.maxRetries ?? 0,
		headersRetryAfterMs: result?.headersRetryAfterMs,
	};
}

function firstMatch(error: Error, ctx: ErrorContext = context) {
	return Object.entries(handlers).find(([, entry]) =>
		entry?.match(error, ctx),
	)?.[0];
}

function apiError(
	status: number | undefined,
	code: string | undefined,
	method: 'GET' | 'POST' = 'POST',
	path?: string,
	retryAfter?: number,
) {
	return new OnedeskAPIError('boom', {
		status,
		code,
		method,
		path,
		retryAfter,
	});
}

describe('onedesk error handlers', () => {
	it('retries a 429 with the Retry-After delay', async () => {
		const error = apiError(429, undefined, 'POST', undefined, 4000);

		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
		});
	});

	it('retries a 429 that carried no Retry-After', async () => {
		const result = await run('RATE_LIMIT_ERROR', apiError(429, undefined));
		expect(result.maxRetries).toBe(3);
		expect(result.headersRetryAfterMs).toBeUndefined();
	});

	it('never retries a rejected key', async () => {
		const error = apiError(401, undefined, 'GET');

		expect(firstMatch(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('treats a 200 envelope code ERROR_SECURITY_ACCESS as a permission error', async () => {
		// HTTP 200, so a status check would miss it entirely.
		const error = apiError(200, 'ERROR_SECURITY_ACCESS');

		expect(firstMatch(error)).toBe('PERMISSION_ERROR');
		await expect(run('PERMISSION_ERROR', error)).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('never retries a 403', async () => {
		expect(firstMatch(apiError(403, undefined, 'GET'))).toBe(
			'PERMISSION_ERROR',
		);
	});

	it('retries ERROR_SERVICE_UNAVAILABLE on a filter read, which is a POST', async () => {
		const error = apiError(200, 'ERROR_SERVICE_UNAVAILABLE', 'POST');

		expect(firstMatch(error, ctxFor('items.filter'))).toBe(
			'SERVICE_UNAVAILABLE_ERROR',
		);
		await expect(
			run('SERVICE_UNAVAILABLE_ERROR', error, ctxFor('items.filter')),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('does not repeat a write that reported ERROR_SERVICE_UNAVAILABLE', async () => {
		// The record may already have been created before the service failed.
		const error = apiError(200, 'ERROR_SERVICE_UNAVAILABLE', 'POST');

		expect(firstMatch(error, ctxFor('items.create'))).toBe(
			'TRANSIENT_WRITE_ERROR',
		);
		await expect(
			run('TRANSIENT_WRITE_ERROR', error, ctxFor('items.create')),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a read that lost its connection', async () => {
		const error = new OnedeskTransportError('socket hang up', {
			method: 'POST',
			path: '/items/filter',
		});

		expect(firstMatch(error, ctxFor('items.filter'))).toBe('TRANSPORT_ERROR');
		await expect(
			run('TRANSPORT_ERROR', error, ctxFor('items.filter')),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('does not replay a write that lost its connection', async () => {
		const error = new OnedeskTransportError('socket hang up', {
			method: 'POST',
		});

		expect(firstMatch(error, ctxFor('items.create'))).toBe('DEFAULT');
	});

	it('does not retry a 404', async () => {
		expect(firstMatch(apiError(404, undefined, 'GET'))).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry a 200 envelope code such as ERROR_INVALID_ID', async () => {
		const error = apiError(200, 'ERROR_INVALID_ID');

		expect(firstMatch(error)).toBe('REQUEST_ERROR');
	});

	it('does not retry a Zod rejection', async () => {
		const error = new Error('invalid');
		error.name = 'ZodError';

		expect(firstMatch(error)).toBe('REQUEST_ERROR');
	});

	it('replays a read that failed with a 5xx', async () => {
		const error = apiError(503, undefined, 'POST', '/items/filter');

		expect(firstMatch(error, ctxFor('items.filter'))).toBe('SERVER_ERROR');
		await expect(
			run('SERVER_ERROR', error, ctxFor('items.filter')),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('never replays a write that failed with a 5xx', async () => {
		const error = apiError(503, undefined, 'POST');

		expect(firstMatch(error, ctxFor('items.create'))).toBe('DEFAULT');
		await expect(
			run('DEFAULT', error, ctxFor('items.create')),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('never replays a timer action, which is a GET that writes', async () => {
		for (const operation of [
			'timers.start',
			'timers.pause',
			'timers.resume',
			'timers.cancel',
		]) {
			const error = apiError(503, undefined, 'GET', '/timers/pause/tm-1');
			expect([operation, firstMatch(error, ctxFor(operation))]).toEqual([
				operation,
				'DEFAULT',
			]);
		}
	});

	it('falls back to no retries for an unrecognised error', async () => {
		expect(firstMatch(new Error('socket hang up'))).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	const builtin: CorsairErrorHandler = {
		RATE_LIMIT_ERROR: errorHandlers.RATE_LIMIT_ERROR,
		DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
	};

	it('returns the builtin map unchanged with no user handlers', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('runs a caller handler ahead of DEFAULT', () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 1 }) },
		});

		const matched = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(new Error('x'), context),
		);
		expect(matched?.[0]).toBe('CUSTOM');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('keeps the caller DEFAULT ahead of the builtin one', async () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		const result = await merged.DEFAULT?.handler?.(new Error('x'), context);
		expect(result?.maxRetries).toBe(9);
	});

	it('keeps a builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(merged.RATE_LIMIT_ERROR).toBe(builtin.RATE_LIMIT_ERROR);
	});
});
