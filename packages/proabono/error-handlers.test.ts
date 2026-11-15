import type { CorsairErrorHandler } from 'corsair/core';
import { ProabonoAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { proabono } from './index';

const CONTEXT = {
	pluginId: 'proabono',
	operation: 'customers.get',
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
		method?: string;
		credentialsRejected?: boolean;
		validationErrors?: { Code?: string; Message?: string }[];
	} = {},
) {
	return new ProabonoAPIError(`ProAbono ${status}`, {
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

describe('ProAbono errorHandlers', () => {
	it('routes a rejected pair to AUTH_ERROR without a retry', async () => {
		const error = apiError(401, { credentialsRejected: true });

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('stops a bare 401 at UNAUTHORIZED_ERROR', () => {
		expect(route(apiError(401))).toBe('UNAUTHORIZED_ERROR');
	});

	it('routes a 403 to PERMISSION_ERROR, since it means a customer cannot pay', async () => {
		const error = apiError(403);

		expect(route(error)).toBe('PERMISSION_ERROR');
		await expect(
			HANDLERS.PERMISSION_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes a 429 to RATE_LIMIT_ERROR with a jittered backoff', async () => {
		const error = apiError(429);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('routes a 422 and its validation list to VALIDATION_ERROR', async () => {
		const error = apiError(422, {
			validationErrors: [
				{ Code: 'Error.Required', Message: 'ReferenceCustomer' },
			],
		});

		expect(route(error)).toBe('VALIDATION_ERROR');
		await expect(
			HANDLERS.VALIDATION_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes 400 and 404 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [400, 404]) {
			expect(route(apiError(status))).toBe('VALIDATION_ERROR');
		}
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('replays a transport failure on a read but never on a write', async () => {
		const read = new ProabonoAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const write = new ProabonoAPIError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(route(read)).toBe('NETWORK_ERROR');
		expect(route(write)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		// A subscription or usage may already exist, so a write is not replayed.
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(write, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a 5xx on a read and refuses to on a write', async () => {
		const read = apiError(503);
		const write = new ProabonoAPIError('ProAbono 503', {
			status: 503,
			method: 'POST',
		});

		expect(route(read)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		expect(route(write)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(write, CONTEXT)).resolves.toEqual({
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
		const merged = proabono({
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
