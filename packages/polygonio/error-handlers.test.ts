import type { CorsairErrorHandler } from 'corsair/core';
import { PolygonioAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { polygonio } from './index';

const CONTEXT = {
	pluginId: 'polygonio',
	operation: 'market.status',
	input: {},
	originalError: new Error('placeholder'),
};

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

function apiError(
	status: number,
	options: { transport?: boolean; retryAfter?: number } = {},
) {
	return new PolygonioAPIError(`Polygon.io ${status}`, {
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

describe('Polygon.io errorHandlers', () => {
	it('routes a rejected key to AUTH_ERROR without a retry', async () => {
		const error = new PolygonioAPIError('Polygon.io 401: Unknown API Key', {
			status: 401,
			credentialsRejected: true,
			method: 'GET',
		});

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('stops a bare 401 at UNAUTHORIZED_ERROR rather than letting it fall through', () => {
		// The client sets the credential flag only when the body names the key, so
		// a 401 without it still must not reach DEFAULT or VALIDATION_ERROR.
		const error = apiError(401);
		expect(route(error)).toBe('UNAUTHORIZED_ERROR');
		// A 401 that does name the key is the more specific AUTH_ERROR.
		expect(
			route(
				new PolygonioAPIError('Polygon.io 401: Unknown API Key', {
					status: 401,
					credentialsRejected: true,
					method: 'GET',
				}),
			),
		).toBe('AUTH_ERROR');
	});

	it('routes a 429 to RATE_LIMIT_ERROR with a per-minute delay', async () => {
		const error = apiError(429, { retryAfter: 30_000 });

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 30_000,
			retryStrategy: 'linear_2s',
		});
	});

	it('recognises a rate limit expressed only in the message', () => {
		expect(route(new Error('Maximum requests per minute reached'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(route(new Error('Too Many Requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes a 403 entitlement failure to PERMISSION_ERROR', async () => {
		const error = apiError(403);

		expect(route(error)).toBe('PERMISSION_ERROR');
		await expect(
			HANDLERS.PERMISSION_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes 400, 404 and 422 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [400, 404, 422]) {
			expect(route(apiError(status))).toBe('VALIDATION_ERROR');
		}
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('replays a transport failure, since every route is a read', async () => {
		const error = new PolygonioAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});

		expect(route(error)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(error, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
	});

	it('replays a 5xx, since every route is a read', async () => {
		const error = apiError(503);

		expect(route(error)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(error, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
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
		const merged = polygonio({
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
		const merged = polygonio({
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
