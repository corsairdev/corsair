import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PostgridAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { postgrid } from './index';

const CONTEXT = {
	pluginId: 'postgrid',
	operation: 'contacts.list',
	input: {},
	originalError: new Error('placeholder'),
};

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

/**
 * A core ApiError carrying PostGrid's error body, which is the shape `request()`
 * raises and the client now passes through unchanged.
 */
function apiError(
	status: number,
	options: { type?: string; method?: 'GET' | 'POST'; retryAfter?: number } = {},
) {
	const body: Record<string, unknown> = { object: 'error' };
	if (options.type !== undefined) {
		body.error = { type: options.type, message: 'PostGrid said so' };
	}
	return new ApiError(
		{ method: options.method ?? 'GET', url: '/contacts' },
		{
			url: 'https://api.postgrid.com/print-mail/v1/contacts',
			ok: false,
			status,
			statusText: `PostGrid ${status}`,
			body,
		},
		`PostGrid ${status}`,
		options.retryAfter === undefined
			? undefined
			: { retryAfter: options.retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(HANDLERS).find(([, entry]) =>
		entry?.match(error, { ...CONTEXT, originalError: error }),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('PostGrid errorHandlers', () => {
	it('routes a rejected key to AUTH_ERROR without a retry', async () => {
		const error = apiError(401, { type: 'invalid_api_key_error' });

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('routes any other 401 or 403 to PERMISSION_ERROR, not to DEFAULT', async () => {
		// A bare 401 with no code is the missing-auth case, so AUTH_ERROR takes it.
		// These carry a code that is not a credential one, which is the refusal the
		// PERMISSION branch exists for.
		for (const status of [401, 403]) {
			const error = apiError(status, { type: 'forbidden_error' });
			expect(route(error)).toBe('PERMISSION_ERROR');
			await expect(
				HANDLERS.PERMISSION_ERROR?.handler(error, CONTEXT),
			).resolves.toEqual({ maxRetries: 0 });
		}
	});

	it('routes a 429 to RATE_LIMIT_ERROR with jittered backoff', async () => {
		const error = apiError(429, { retryAfter: 1500 });

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1500,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('falls back to the strategy when a 429 carries no Retry-After', async () => {
		const result = await HANDLERS.RATE_LIMIT_ERROR?.handler(
			apiError(429),
			CONTEXT,
		);
		expect(result?.maxRetries).toBe(3);
		expect(result?.headersRetryAfterMs).toBeUndefined();
	});

	it('routes 400, 404, 409 and 422 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [400, 404, 409, 422]) {
			expect(route(apiError(status))).toBe('VALIDATION_ERROR');
		}
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('replays a transport failure on a read but never on an order', async () => {
		const read = new PostgridAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const order = new PostgridAPIError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(route(read)).toBe('NETWORK_ERROR');
		expect(route(order)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		// An order that may have printed must not be replayed.
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(order, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a 5xx on a read and refuses to on an order', async () => {
		const read = apiError(503);
		const order = apiError(503, { method: 'POST' });

		expect(route(read)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		expect(route(order)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(order, CONTEXT)).resolves.toEqual({
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
		const merged = postgrid({
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

	it('lets a caller handler claim an error a builtin would otherwise take', () => {
		const caller = {
			match: (error: Error) => error.message.includes('custom_503'),
			handler: async () => ({ maxRetries: 5 }),
		};
		const merged = postgrid({
			errorHandlers: { CUSTOM: caller },
		}).errorHandlers;
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
