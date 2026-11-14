import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PolygonAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { polygon } from './index';

const CONTEXT = {
	pluginId: 'polygon',
	operation: 'networks.list',
	input: {},
	originalError: new Error('placeholder'),
};

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

function polygonError(
	status: number,
	options: { code?: string; method?: string; retryAfter?: number } = {},
) {
	return new PolygonAPIError(`Polygon ${status}`, { status, ...options });
}

function route(error: Error): string {
	const match = Object.entries(HANDLERS).find(([, entry]) =>
		entry?.match(error, { ...CONTEXT, originalError: error }),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Polygon errorHandlers', () => {
	it('routes a 401 to AUTH_ERROR without retrying the rejected token', async () => {
		const error = polygonError(401, { code: 'Unauthorized' });

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{ maxRetries: 0 },
		);
	});

	it('routes InvalidCredentials, which the token route returns as 401', async () => {
		expect(route(polygonError(401, { code: 'InvalidCredentials' }))).toBe(
			'AUTH_ERROR',
		);
	});

	it('routes a spent balance to QUOTA_ERROR before the rate-limit branch', async () => {
		const error = polygonError(422, { code: 'InsufficientFunds' });

		expect(route(error)).toBe('QUOTA_ERROR');
		await expect(
			HANDLERS.QUOTA_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a 429 to RATE_LIMIT_ERROR and honours Retry-After', async () => {
		const error = polygonError(429, { code: 'RateLimited', retryAfter: 2500 });

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('routes a body-only rate limit code, which arrives without a 429', async () => {
		expect(route(polygonError(400, { code: 'RateLimited' }))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('replays an upstream provider failure on a read but not on a write', async () => {
		const read = polygonError(502, {
			code: 'ProviderRequestFailed',
			method: 'GET',
		});
		const write = polygonError(502, {
			code: 'ProviderRequestFailed',
			method: 'POST',
		});

		expect(route(read)).toBe('UPSTREAM_ERROR');
		await expect(
			HANDLERS.UPSTREAM_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		await expect(
			HANDLERS.UPSTREAM_ERROR?.handler(write, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('routes 400, 409 and 422 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [400, 409, 422]) {
			expect(route(polygonError(status))).toBe('VALIDATION_ERROR');
		}
		await expect(
			HANDLERS.VALIDATION_ERROR?.handler(polygonError(422), CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('routes 404 to NOT_FOUND_ERROR and 403 to PERMISSION_ERROR', async () => {
		expect(route(polygonError(404))).toBe('NOT_FOUND_ERROR');
		expect(route(polygonError(403))).toBe('PERMISSION_ERROR');
		await expect(
			HANDLERS.NOT_FOUND_ERROR?.handler(polygonError(404), CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			HANDLERS.PERMISSION_ERROR?.handler(polygonError(403), CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('replays a transport failure on a read but never on a write', async () => {
		const read = new PolygonAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const write = new PolygonAPIError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(route(read)).toBe('NETWORK_ERROR');
		expect(route(write)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(write, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a 5xx on a read and refuses to replay it on a write', async () => {
		const read = polygonError(503, { method: 'GET' });
		const write = polygonError(503, { method: 'POST' });

		expect(route(read)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		// A write that may have moved money must not be replayed.
		expect(route(write)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(write, CONTEXT)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes an unrecognised error to DEFAULT with no retry', async () => {
		expect(route(new Error('something else'))).toBe('DEFAULT');
		await expect(
			HANDLERS.DEFAULT?.handler(
				new ApiError(
					{ method: 'GET', url: '/x' },
					{
						url: 'https://x/y',
						ok: false,
						status: 418,
						statusText: 'teapot',
						body: {},
					},
					'teapot',
				),
				CONTEXT,
			),
		).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('puts caller keys first, keeps every builtin, and leaves DEFAULT last', () => {
		const caller = {
			match: (error: Error) => error.message.startsWith('custom_'),
			handler: async () => ({ maxRetries: 7 }),
		};
		const plugin = polygon({ errorHandlers: { CUSTOM: caller } });
		const merged = plugin.errorHandlers;
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
		const plugin = polygon({ errorHandlers: { CUSTOM: caller } });
		const merged = plugin.errorHandlers;
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
