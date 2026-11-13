import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { recordReplayMeta, ShopifyAPIError } from './client';
import { ShopifyUserError } from './endpoints/call';
import {
	DEFAULT_THROTTLE_DELAY_MS,
	errorHandlers,
	mergeErrorHandlers,
} from './error-handlers';

type HandlerEntry = {
	match?: (error: Error, context: never) => boolean;
	handler?: (error: Error, context: never) => Promise<{ maxRetries?: number }>;
};

/**
 * Resolves a handler the way core does: the first named match wins, and
 * DEFAULT is only the fallback, never a candidate in key order. Mirroring that
 * here is what lets a test catch a merged map whose caller handler is shadowed.
 */
function resolveName(error: Error): string {
	const entries = errorHandlers as Record<string, HandlerEntry | undefined>;
	return (
		Object.keys(entries).find(
			(name) =>
				name !== 'DEFAULT' && entries[name]?.match?.(error, {} as never),
		) ?? 'DEFAULT'
	);
}

async function resolve(error: Error) {
	const entries = errorHandlers as Record<string, HandlerEntry | undefined>;
	const name = resolveName(error);
	const entry = entries[name];
	if (!entry?.handler) throw new Error(`No handler for ${name}`);
	const result = await entry.handler(error, {} as never);
	return { name, result };
}

function matchedHandler(error: Error): string {
	return resolveName(error);
}

describe('error handlers', () => {
	it('retries a THROTTLED body using the wait Shopify reported', async () => {
		const error = new ShopifyAPIError('Throttled', {
			status: 429,
			code: 'THROTTLED',
			retryAfter: 1500,
		});

		const { result } = await resolve(error);

		expect(result).toEqual({ maxRetries: 3, headersRetryAfterMs: 1500 });
	});

	it('falls back to a fixed wait when no bucket detail is available', async () => {
		const error = new ShopifyAPIError('Throttled', {
			status: 429,
			code: 'THROTTLED',
		});

		const { result } = await resolve(error);

		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: DEFAULT_THROTTLE_DELAY_MS,
		});
	});

	it('also matches a plain 429 gateway response', async () => {
		const error = new ShopifyAPIError('Too Many Requests', { status: 429 });

		expect(matchedHandler(error)).toBe('RATE_LIMIT_ERROR');
	});

	// Core raises an HTTP 429 as its own ApiError, which passes through
	// unchanged and so has no Shopify `code`. Matching only the plugin's error
	// let it fall through to DEFAULT, with no wait at all.
	it('matches an HTTP 429 raised as a core ApiError and keeps its wait', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/admin/api/2026-10/graphql.json' },
			{
				url: 'https://s.myshopify.com',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 3000 },
		);

		expect(matchedHandler(error)).toBe('RATE_LIMIT_ERROR');
		expect((await resolve(error)).result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
		});
	});

	it('never retries a rejected write', async () => {
		const error = new ShopifyUserError('products.create was rejected', [
			{ field: ['title'], message: 'Title is invalid' },
		]);

		const { result } = await resolve(error);

		expect(result).toEqual({ maxRetries: 0 });
	});

	it('does not retry a query that exceeds the single-call cost limit', async () => {
		const error = new ShopifyAPIError('Query cost is 2003', {
			status: 200,
			code: 'MAX_COST_EXCEEDED',
		});

		expect(matchedHandler(error)).toBe('MAX_COST_EXCEEDED');
		expect((await resolve(error)).result).toEqual({ maxRetries: 0 });
	});

	it('does not retry an auth failure', async () => {
		const error = new ShopifyAPIError('Invalid API key', { status: 401 });

		expect(matchedHandler(error)).toBe('AUTH_ERROR');
		expect((await resolve(error)).result).toEqual({ maxRetries: 0 });
	});

	// A frozen shop answers 403 with its own code. Reading it as auth would
	// send the caller to re-enter a working token.
	it('reports a frozen shop as SHOP_INACTIVE, not as an auth failure', async () => {
		const error = new ShopifyAPIError('Shop is inactive', {
			status: 403,
			code: 'SHOP_INACTIVE',
		});

		expect(matchedHandler(error)).toBe('SHOP_INACTIVE');
	});

	it('retries a 5xx on a read', async () => {
		const error = new ShopifyAPIError('Internal Server Error', {
			status: 500,
			replaySafe: true,
		});
		recordReplayMeta(error, { replaySafe: true, transportFailure: false });

		expect((await resolve(error)).result).toEqual({ maxRetries: 2 });
	});

	// Core's ApiError passes through unchanged, so the plugin records replay
	// safety beside it. A 5xx on a write must not be replayed.
	it('recognises a pass-through ApiError and retries it only when replayable', async () => {
		const read = new ApiError(
			{ method: 'POST', url: '/admin/api/2026-10/graphql.json' },
			{
				url: 'https://s.myshopify.com',
				ok: false,
				status: 500,
				statusText: 'x',
				body: {},
			},
			'Internal Server Error',
		);
		recordReplayMeta(read, { replaySafe: true, transportFailure: false });
		expect(matchedHandler(read)).toBe('SERVER_ERROR');
		expect((await resolve(read)).result).toEqual({ maxRetries: 2 });

		const write = new ApiError(
			{ method: 'POST', url: '/admin/api/2026-10/graphql.json' },
			{
				url: 'https://s.myshopify.com',
				ok: false,
				status: 500,
				statusText: 'x',
				body: {},
			},
			'Internal Server Error',
		);
		recordReplayMeta(write, { replaySafe: false, transportFailure: false });
		expect((await resolve(write)).result).toEqual({ maxRetries: 0 });
	});

	// An error with no recorded metadata is treated as unsafe on purpose:
	// replaying a write that may already have landed is worse than failing.
	it('does not retry an error whose replay safety is unknown', async () => {
		const untracked = new ShopifyAPIError('Internal Server Error', {
			status: 500,
		});

		expect(matchedHandler(untracked)).toBe('SERVER_ERROR');
		expect((await resolve(untracked)).result).toEqual({ maxRetries: 0 });
	});

	it('does not replay a 5xx on a write', async () => {
		const error = new ShopifyAPIError('Internal Server Error', {
			status: 500,
			replaySafe: false,
		});

		expect((await resolve(error)).result).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure even on a write, because nothing was sent', async () => {
		const error = new ShopifyAPIError('socket hang up', {
			transportFailure: true,
			replaySafe: true,
		});

		expect(matchedHandler(error)).toBe('TRANSPORT_ERROR');
		expect((await resolve(error)).result).toEqual({ maxRetries: 2 });
	});

	it('uses DEFAULT last, so an unknown error is not retried', async () => {
		const error = new Error('something else');

		expect(matchedHandler(error)).toBe('DEFAULT');
		expect((await resolve(error)).result).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtins when the caller supplies none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	// The trap: a plain spread keeps the caller's value but the builtin's
	// position, and core takes the first match in key order, so the caller's
	// handler would never run.
	it('lets a caller handler run for a status no builtin covers', async () => {
		const caller: CorsairErrorHandler = {
			CUSTOM_418: {
				match: (error: Error) => error.message === 'teapot',
				handler: async () => ({ maxRetries: 9 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);
		const names = Object.keys(merged);
		expect(names[0]).toBe('CUSTOM_418');
		expect(names.at(-1)).toBe('DEFAULT');

		const entry = merged.CUSTOM_418;
		expect(
			(await entry?.handler?.(new Error('teapot'), {} as never))?.maxRetries,
		).toBe(9);
	});

	it('keeps the caller DEFAULT last', async () => {
		const caller: CorsairErrorHandler = {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, caller);
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(
			(await merged.DEFAULT?.handler?.(new Error('x'), {} as never))
				?.maxRetries,
		).toBe(7);
	});

	it('keeps every builtin the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});

		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
	});
});
