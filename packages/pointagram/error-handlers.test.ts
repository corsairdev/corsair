import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PointagramAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { pointagram } from './index';

const CONTEXT = {
	pluginId: 'pointagram',
	operation: 'players.list',
	input: {},
	originalError: new Error('placeholder'),
};

function apiError(
	status: number,
	message: string,
	body?: unknown, // unknown: each test passes one of Pointagram's response shapes.
	retryAfter?: number,
	method: 'GET' | 'POST' = 'GET',
) {
	return new ApiError(
		{ method, url: '/players' },
		{
			url: 'https://app.pointagram.com/api/20/players',
			ok: false,
			status,
			statusText: message,
			body: body ?? {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

/** The name of the first handler whose matcher accepts the error. */
function route(error: Error): string {
	const match = Object.entries(HANDLERS).find(([, entry]) =>
		entry?.match(error, { ...CONTEXT, originalError: error }),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Pointagram errorHandlers', () => {
	it('routes the documented credential rejection to AUTH_ERROR with no retry', async () => {
		const error = apiError(404, 'Not Found', {
			status: 'Error',
			message: 'Invalid Credentials',
			data: {},
		});

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{ maxRetries: 0 },
		);
	});

	it('routes an ordinary 404 to NOT_FOUND_ERROR, not AUTH_ERROR', async () => {
		const error = apiError(404, 'Not Found', {
			status: 'Error',
			message: 'Player not found',
		});

		expect(route(error)).toBe('NOT_FOUND_ERROR');
		await expect(
			HANDLERS.NOT_FOUND_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats a bare 401 or 403 as an auth failure, since no endpoint documents one', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
	});

	it('routes a 409 conflict, such as an existing player, to VALIDATION_ERROR', async () => {
		expect(route(apiError(409, 'Conflict'))).toBe('VALIDATION_ERROR');
	});

	it('routes a 422 to VALIDATION_ERROR', async () => {
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('routes a ZodError to VALIDATION_ERROR with no retry', async () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('routes a 429 to RATE_LIMIT_ERROR and honours Retry-After', async () => {
		const error = apiError(429, 'Too Many Requests', { status: 'Error' }, 2500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls back to the backoff strategy when a 429 carries no Retry-After', async () => {
		const error = apiError(429, 'Too Many Requests', { status: 'Error' });

		const result = await HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT);
		expect(result?.maxRetries).toBe(3);
		expect(result?.headersRetryAfterMs).toBeUndefined();
	});

	it('replays a transport failure on a read but never on a write', async () => {
		const read = new PointagramAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const write = new PointagramAPIError('fetch failed', {
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
		const read = apiError(503, 'Service Unavailable', { status: 'Error' });
		const write = apiError(
			503,
			'Service Unavailable',
			{ status: 'Error' },
			undefined,
			'POST',
		);

		expect(route(read)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		// A write may have landed; DEFAULT stops it after one attempt.
		expect(route(write)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(write, CONTEXT)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes any unrecognised error to DEFAULT with no retry', async () => {
		expect(route(new Error('something else'))).toBe('DEFAULT');
		await expect(
			HANDLERS.DEFAULT?.handler(apiError(418, 'teapot'), CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last and every builtin present when the caller adds a handler', () => {
		const callerHandler = {
			match: (error: Error) => error.message.startsWith('custom_'),
			handler: async () => ({ maxRetries: 7 }),
		};
		const plugin = pointagram({ errorHandlers: { CUSTOM: callerHandler } });
		const merged = plugin.errorHandlers;
		if (!merged) throw new Error('errorHandlers missing');
		const keys = Object.keys(merged);

		expect(keys[0]).toBe('CUSTOM');
		expect(keys.at(-1)).toBe('DEFAULT');
		for (const name of Object.keys(errorHandlers)) {
			expect(keys).toContain(name);
		}
	});

	it('lets a caller handler claim an error a builtin would otherwise take', () => {
		const callerHandler = {
			match: (error: Error) => error.message.includes('custom_500'),
			handler: async () => ({ maxRetries: 5 }),
		};
		const plugin = pointagram({ errorHandlers: { CUSTOM: callerHandler } });
		const merged = plugin.errorHandlers;
		if (!merged) throw new Error('errorHandlers missing');

		const error = new Error('custom_500 happened');
		const first = Object.entries(merged).find(([, entry]) =>
			entry?.match(error, { ...CONTEXT, originalError: error }),
		);
		expect(first?.[0]).toBe('CUSTOM');
	});

	it('replaces a builtin in place rather than duplicating it', () => {
		const custom = {
			match: (error: Error) => error.message.includes('custom_rate'),
			handler: async () => ({ maxRetries: 1 }),
		};
		const plugin = pointagram({ errorHandlers: { RATE_LIMIT_ERROR: custom } });
		const keys = Object.keys(plugin.errorHandlers ?? {});

		expect(plugin.errorHandlers?.RATE_LIMIT_ERROR).toBe(custom);
		expect(keys.filter((key) => key === 'RATE_LIMIT_ERROR')).toHaveLength(1);
		expect(keys.at(-1)).toBe('DEFAULT');
	});

	it('keeps a caller DEFAULT in the final position', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
			DEFAULT: callerDefault,
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
