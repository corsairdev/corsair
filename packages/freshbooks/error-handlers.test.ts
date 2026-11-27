import type { ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { FreshBooksAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

function handlerContext(): ErrorContext {
	return {
		pluginId: 'freshbooks',
		operation: 'clients.list',
		input: {},
		originalError: new Error('original'),
	};
}

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	// The builtin map is concrete here, so the declared parameter list rules;
	// core passes the context to matchers and handlers alike.
	return errorHandlers[classify(error)].handler(error);
}

function apiError(
	status: number | undefined,
	options: { retryAfter?: number; errno?: number; method?: string } = {},
) {
	const parts = [];
	if (status !== undefined) parts.push(String(status));
	if (options.errno !== undefined) parts.push(`errno ${options.errno}`);
	return new FreshBooksAPIError(
		`FreshBooks ${parts.join(' ')}: failed`,
		{ status, ...options },
	);
}

describe('FreshBooks error handlers', () => {
	it('retries a 429 with backoff and a real Retry-After wins', async () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(apiError(429, { retryAfter: 2000 }))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
		expect(await strategy(apiError(429))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 409, the documented invoice-number collision', async () => {
		const error = apiError(409, { method: 'POST' });
		expect(classify(error)).toBe('CONFLICT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401, which needs a fresh access token', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
	});

	it('does not retry a 404, including the account-not-found wall', async () => {
		const error = apiError(404, { errno: 404 });
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400', async () => {
		expect(classify(apiError(400))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 5xx on a read', async () => {
		const error = apiError(500, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('replays a transport failure on a read, which never reached the API', async () => {
		const error = apiError(undefined, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
	});

	it.each(['POST', 'PUT', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have gone through',
		(method) => {
			expect(classify(apiError(500, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});

	it('handles an error from another plugin without crashing', async () => {
		const error = new Error('not ours');
		const name = (
			Object.keys(errorHandlers) as HandlerName[]
		).find((key) => errorHandlers[key].match(error));
		expect(name).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin handlers untouched when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts the caller DEFAULT last and keeps builtin handlers ahead', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
		const fallback = await merged.DEFAULT?.handler(
			new Error('x'),
			handlerContext(),
		);
		expect(fallback).toEqual({ maxRetries: 5 });
	});

	it('lets a caller handler for a new status run before DEFAULT', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			UPSTREAM_ERROR: {
				match: (error: Error) => error.message.includes('upstream'),
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.indexOf('UPSTREAM_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
		const upstream = await merged.UPSTREAM_ERROR?.handler(
			new Error('upstream hiccup'),
			handlerContext(),
		);
		expect(upstream).toEqual({ maxRetries: 1 });
	});
});
