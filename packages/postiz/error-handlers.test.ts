import type { CorsairErrorHandler } from 'corsair/core';
import { PostizAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { postiz } from './index';

const CONTEXT = {
	pluginId: 'postiz',
	operation: 'posts.list',
	input: {},
	originalError: new Error('placeholder'),
};

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

function apiError(
	status: number,
	options: {
		transport?: boolean;
		retryAfter?: number;
		method?: string;
		credentialsRejected?: boolean;
	} = {},
) {
	return new PostizAPIError(`Postiz ${status}`, {
		status,
		method: 'GET',
		...options,
	});
}

function route(error: Error): string {
	const match = Object.entries(HANDLERS).find(([, entry]) =>
		entry?.match(error, { ...CONTEXT, originalError: error }),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Postiz errorHandlers', () => {
	it('routes a rejected key to AUTH_ERROR without a retry', async () => {
		const error = apiError(401, { credentialsRejected: true });

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('stops a bare 401 at UNAUTHORIZED_ERROR rather than letting it fall through', () => {
		expect(route(apiError(401))).toBe('UNAUTHORIZED_ERROR');
	});

	it('routes a 403 to PERMISSION_ERROR, which is a key without access', async () => {
		const error = apiError(403);

		expect(route(error)).toBe('PERMISSION_ERROR');
		await expect(
			HANDLERS.PERMISSION_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a 429 to RATE_LIMIT_ERROR with a short bounded wait', async () => {
		const error = apiError(429, { retryAfter: 4000 });

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 4000,
			retryStrategy: 'linear_4s',
		});
	});

	it('recognises a rate limit expressed only in the message', () => {
		expect(route(new Error('Too Many Requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 400, 404 and 413 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [400, 404, 413]) {
			expect(route(apiError(status))).toBe('VALIDATION_ERROR');
		}
		await expect(
			HANDLERS.VALIDATION_ERROR?.handler(apiError(413), CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('replays a transport failure on a read but never on a publish', async () => {
		const read = new PostizAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const publish = new PostizAPIError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(route(read)).toBe('NETWORK_ERROR');
		expect(route(publish)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		// A publish that may have gone out must not be replayed.
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(publish, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a 5xx on a read and refuses to on a publish', async () => {
		const read = apiError(503);
		const publish = new PostizAPIError('Postiz 503', {
			status: 503,
			method: 'POST',
		});

		expect(route(read)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		// Postiz surfaces a missing post id as a 500, so a write is never replayed.
		expect(route(publish)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(publish, CONTEXT)).resolves.toEqual({
			maxRetries: 0,
		});
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
		const merged = postiz({ errorHandlers: { CUSTOM: caller } }).errorHandlers;
		if (!merged) throw new Error('errorHandlers missing');
		const keys = Object.keys(merged);

		expect(keys[0]).toBe('CUSTOM');
		expect(keys.at(-1)).toBe('DEFAULT');
		for (const name of Object.keys(HANDLERS)) {
			expect(keys).toContain(name);
		}
	});

	it('lets a caller handler claim an error a builtin would otherwise take', () => {
		const caller = {
			match: (error: Error) => error.message.includes('custom_503'),
			handler: async () => ({ maxRetries: 5 }),
		};
		const merged = postiz({ errorHandlers: { CUSTOM: caller } }).errorHandlers;
		if (!merged) throw new Error('errorHandlers missing');

		const error = new Error('custom_503 happened');
		const first = Object.entries(merged).find(([, entry]) =>
			entry?.match(error, { ...CONTEXT, originalError: error }),
		);
		expect(first?.[0]).toBe('CUSTOM');
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
