import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PRERENDER_API_BASE, PrerenderAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { prerender } from './index';

const CONTEXT = {
	pluginId: 'prerender',
	operation: 'recache',
	input: {},
	originalError: new Error('placeholder'),
};

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

/** Core's ApiError as Prerender produces it: a plain-text body. */
function apiError(status: number, body = 'Bad Request', path = '/recache') {
	return new ApiError(
		{ method: 'POST', url: path },
		{
			url: `${PRERENDER_API_BASE}${path}`,
			ok: false,
			status,
			statusText: body,
			body,
		},
		body,
	);
}

function route(error: Error): string {
	const match = Object.entries(HANDLERS).find(([, entry]) =>
		entry?.match(error, { ...CONTEXT, originalError: error }),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Prerender errorHandlers', () => {
	it('routes a rejected token to AUTH_ERROR without a retry', async () => {
		const error = apiError(400, 'Invalid prerenderToken');

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('stops any other 400 or 401 at UNAUTHORIZED_ERROR', () => {
		for (const status of [400, 401]) {
			expect(route(apiError(status, 'Invalid url'))).toBe('UNAUTHORIZED_ERROR');
		}
	});

	it('routes a 403 to CONFLICT_ERROR, since it means a clear is already queued', async () => {
		const error = apiError(403, 'Cache clear in progress', '/cache-clear');

		expect(route(error)).toBe('CONFLICT_ERROR');
		await expect(
			HANDLERS.CONFLICT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a 429 to RATE_LIMIT_ERROR with a jittered backoff', async () => {
		const error = apiError(429, 'Too Many Requests', '/search');

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('replays a transport failure on a read', async () => {
		const error = new PrerenderAPIError('fetch failed', {
			method: 'POST',
			transport: true,
			replayable: true,
		});

		expect(route(error)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(error, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('does not replay a transport failure on a recache or a clear, which may have landed', async () => {
		const error = new PrerenderAPIError('fetch failed', {
			method: 'POST',
			transport: true,
			replayable: false,
		});

		expect(route(error)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('replays a 5xx on search', async () => {
		const error = apiError(503, 'Service Unavailable', '/search');

		expect(route(error)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(error, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('sends a 5xx on cache clear or recache to DEFAULT with no retry', async () => {
		for (const path of ['/cache-clear', '/recache', '/sitemap']) {
			const error = apiError(503, 'Service Unavailable', path);
			expect(route(error)).toBe('DEFAULT');
		}
	});

	it('routes an unrecognised error to DEFAULT with no retry', async () => {
		const error = new Error('something else');
		expect(route(error)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(error, CONTEXT)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	it('puts caller keys first, keeps every builtin, and leaves DEFAULT last', () => {
		const caller = {
			match: (error: Error) => error.message.startsWith('custom_'),
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = prerender({
			errorHandlers: { CUSTOM: caller },
		}).errorHandlers;
		if (!merged) throw new Error('errorHandlers missing');
		const keys = Object.keys(merged);

		expect(keys[0]).toBe('CUSTOM');
		expect(keys.at(-1)).toBe('DEFAULT');
		for (const name of Object.keys(HANDLERS)) {
			expect(keys).toContain(name);
		}
	});

	it('keeps a caller DEFAULT in the final position', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
