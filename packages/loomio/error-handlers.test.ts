import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { LoomioAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	BAD_KEY_BODY,
	NOT_FOUND_BODY,
	UNKNOWN_ROUTE_BODY,
	VALIDATION_BODY,
} from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

const context = (error: Error) =>
	({
		pluginId: 'loomio',
		operation: 'groups.list',
		input: {},
		originalError: error,
	}) satisfies ErrorContext;

// Mirrors corsair core: the first handler whose match() passes, in key order.
// Core invokes the map through the CorsairErrorHandler type, so the calls
// carry both arguments.
const handlers = errorHandlers as CorsairErrorHandler;

function classify(error: Error): HandlerName {
	const name = (Object.keys(handlers) as HandlerName[]).find((key) =>
		handlers[key]?.match(error, context(error)),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	const handler = handlers[classify(error)]?.handler;
	if (!handler) throw new Error('DEFAULT should always match');
	return handler(error, context(error));
}

function apiError(
	status: number | undefined,
	// unknown: each case passes one of Loomio's error bodies.
	body: unknown = {},
	options: {
		method?: string;
		resourceScoped?: boolean;
		retryAfter?: number;
	} = {},
) {
	const detail = body === NOT_FOUND_BODY ? 'HTTP 404' : undefined;
	return new LoomioAPIError(`Loomio ${status ?? 'transport'} failed`, {
		status,
		method: options.method ?? 'GET',
		resourceScoped: options.resourceScoped,
		retryAfter: options.retryAfter,
		detail,
	});
}

describe('Loomio error handlers', () => {
	it('retries a 429 with backoff and no Retry-After', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('passes a Retry-After the client read, even though Loomio sends none', async () => {
		const error = apiError(429, {}, { retryAfter: 2000 });
		expect(await strategy(error)).toMatchObject({ headersRetryAfterMs: 2000 });
	});

	it('reads a plain 403 as a bad key, not a permission denial', async () => {
		const error = new LoomioAPIError(BAD_KEY_BODY.error, {
			status: 403,
			method: 'GET',
			detail: BAD_KEY_BODY.error,
		});
		expect(error.isAuthError).toBe(true);
		expect(error.resourceNotFound).toBe(false);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('reads a 403 on a resource-scoped call as permission or missing record', async () => {
		const error = new LoomioAPIError(BAD_KEY_BODY.error, {
			status: 403,
			method: 'GET',
			resourceScoped: true,
			detail: BAD_KEY_BODY.error,
		});
		expect(error.isAuthError).toBe(false);
		expect(error.resourceNotFound).toBe(true);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry the bare-number 404 a missing record gets', async () => {
		const error = apiError(404, NOT_FOUND_BODY, { resourceScoped: true });
		expect(error.detail).toBe('HTTP 404');
		expect(error.resourceNotFound).toBe(true);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('routes the unrouted-path body to NOT_FOUND by its 404 status', async () => {
		const error = new LoomioAPIError(UNKNOWN_ROUTE_BODY.error, {
			status: UNKNOWN_ROUTE_BODY.status,
			method: 'GET',
			detail: UNKNOWN_ROUTE_BODY.error,
		});
		expect(error.status).toBe(404);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
	});

	it.each([
		['400 missing parameter', apiError(400, { error: 400 })],
		['422 field errors', apiError(422, VALIDATION_BODY)],
	])('does not retry %s', async (_name, error) => {
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure on a read but never on a write', async () => {
		const read = apiError(undefined);
		expect(read.status).toBeUndefined();
		expect(read.replaySafe).toBe(true);
		expect(classify(read)).toBe('TRANSPORT_ERROR');
		expect(await strategy(read)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		const write = apiError(undefined, {}, { method: 'POST' });
		expect(write.replaySafe).toBe(false);
		expect(classify(write)).toBe('DEFAULT');
		expect(await strategy(write)).toEqual({ maxRetries: 0 });
	});

	it('replays a 5xx on reads and falls through to DEFAULT for writes', async () => {
		const read = apiError(502);
		expect(classify(read)).toBe('SERVER_ERROR');
		expect(await strategy(read)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		const write = apiError(502, {}, { method: 'POST' });
		expect(classify(write)).toBe('DEFAULT');
		expect(await strategy(write)).toEqual({ maxRetries: 0 });
	});

	it('treats a ZodError as a validation error', () => {
		const error = new LoomioAPIError('bad body');
		// Output parse failures carry the ZodError name through the wrapper.
		Object.defineProperty(error, 'name', { value: 'ZodError' });
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('classifies an unparseable body on a POST as DEFAULT, with no replay', async () => {
		const error = new LoomioAPIError('Unknown Loomio error', {
			method: 'POST',
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers as CorsairErrorHandler;

	it('keeps DEFAULT last for builtins alone', () => {
		expect(Object.keys(builtin).at(-1)).toBe('DEFAULT');
	});

	it('resolves a caller handler for a status no builtin covers', () => {
		const merged = mergeErrorHandlers(builtin, {
			CONFLICT_ERROR: {
				match: (error: Error) => error.message.includes('conflict'),
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('CONFLICT_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
		const conflict = new LoomioAPIError('a conflict');
		expect(merged.CONFLICT_ERROR?.match(conflict, context(conflict))).toBe(
			true,
		);
		expect(classify(conflict)).toBe('DEFAULT');
		// The merged map, classified in its own key order, resolves CONFLICT first.
		const mergedName = names.find((key) =>
			merged[key]?.match(conflict, context(conflict)),
		);
		expect(mergedName).toBe('CONFLICT_ERROR');
	});

	it('lets a caller override a builtin slot and DEFAULT', async () => {
		const merged = mergeErrorHandlers(builtin, {
			AUTH_ERROR: {
				match: (error: Error) => error.message.includes('auth'),
				handler: async () => ({ maxRetries: 1 }),
			},
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		const authError = new LoomioAPIError('an auth problem', { status: 403 });
		// The caller's narrower match replaced the builtin 403 reading.
		expect(merged.AUTH_ERROR?.match(authError, context(authError))).toBe(true);
		await expect(
			merged.DEFAULT?.handler(authError, context(authError)),
		).resolves.toEqual({ maxRetries: 9 });
		expect(merged.PERMISSION_ERROR?.match(authError, context(authError))).toBe(
			true,
		);
	});
});
