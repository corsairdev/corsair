import type { CorsairErrorHandler } from 'corsair/core';
import { PostmarkAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { postmark } from './index';

const CONTEXT = {
	pluginId: 'postmark',
	operation: 'server.get',
	input: {},
	originalError: new Error('placeholder'),
};

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

function apiError(
	status: number,
	options: {
		errorCode?: number;
		transport?: boolean;
		method?: string;
		credentialsRejected?: boolean;
	} = {},
) {
	return new PostmarkAPIError(`Postmark ${status}`, {
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

describe('Postmark errorHandlers', () => {
	it('routes a rejected token to AUTH_ERROR without a retry', async () => {
		const error = apiError(401, { errorCode: 10, credentialsRejected: true });

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

	it('retries maintenance, which the API says will end', async () => {
		const error = apiError(503, { errorCode: 100 });

		// Code 100 must win before the generic 5xx branch, which only reads GETs
		// anyway; the ordering is what makes this retry happen at all.
		expect(route(error)).toBe('MAINTENANCE_ERROR');
		await expect(
			HANDLERS.MAINTENANCE_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'linear_3s',
		});
	});

	it('routes a 429 to RATE_LIMIT_ERROR, which has no Retry-After to read', async () => {
		const error = apiError(429);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('routes 400, 404, 413, 415 and 422 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [400, 404, 413, 415, 422]) {
			expect(route(apiError(status))).toBe('VALIDATION_ERROR');
		}
	});

	it('routes a send validation code to VALIDATION_ERROR', () => {
		expect(route(apiError(422, { errorCode: 300 }))).toBe('VALIDATION_ERROR');
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('replays a transport failure on a read but never on a send', async () => {
		const read = new PostmarkAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const send = new PostmarkAPIError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(route(read)).toBe('NETWORK_ERROR');
		expect(route(send)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		// A send that may already be queued must not be replayed.
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(send, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a 5xx on a read and refuses to on a send', async () => {
		const read = apiError(500);
		const send = new PostmarkAPIError('Postmark 500', {
			status: 500,
			method: 'POST',
		});

		expect(route(read)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		expect(route(send)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(send, CONTEXT)).resolves.toEqual({
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
		const merged = postmark({
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
		const merged = postmark({
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
