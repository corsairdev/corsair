import type { CorsairErrorHandler } from 'corsair/core';
import { PlacidAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

/** Runs the first handler that matches, as core does. */
async function retryFor(
	error: Error,
	operation = 'images.get',
	handlers: CorsairErrorHandler = errorHandlers,
) {
	const context = {
		pluginId: 'placid',
		operation,
		input: {},
		originalError: error,
	};
	const name = Object.keys(handlers).find((key) =>
		handlers[key]?.match(error, context),
	);
	expect(name).toBeDefined();
	return await handlers[name as string]!.handler(error, context);
}

function apiError(status: number, retryAfter?: number, method = 'GET') {
	return new PlacidAPIError(`Placid ${status}`, { status, retryAfter, method });
}

describe('errorHandlers', () => {
	it('retries a 429 three times and honors Retry-After', async () => {
		const retry = await retryFor(apiError(429, 3000));

		expect(retry.maxRetries).toBe(3);
		expect(retry.headersRetryAfterMs).toBe(3000);
		expect(retry.retryStrategy).toBe('exponential_backoff');
	});

	it('does not retry a 401', async () => {
		expect((await retryFor(apiError(401))).maxRetries).toBe(0);
	});

	it('does not retry a 403', async () => {
		expect((await retryFor(apiError(403))).maxRetries).toBe(0);
	});

	it('does not retry a 400, 404 or 422', async () => {
		for (const status of [400, 404, 422]) {
			expect((await retryFor(apiError(status))).maxRetries).toBe(0);
		}
	});

	it('does not retry a ZodError', async () => {
		const error = new Error('invalid input');
		error.name = 'ZodError';

		expect((await retryFor(error)).maxRetries).toBe(0);
	});

	it('retries a 5xx on a read operation', async () => {
		const retry = await retryFor(apiError(503), 'templates.get');

		expect(retry.maxRetries).toBe(2);
		expect(retry.retryStrategy).toBe('exponential_backoff');
	});

	it('does not replay a 5xx on a create, which bills a second render', async () => {
		const retry = await retryFor(apiError(503), 'images.create');

		// The DEFAULT handler matches once SERVER_ERROR declines.
		expect(retry.maxRetries).toBe(0);
	});

	it('does not replay a 5xx on the POST-based reads it covers', async () => {
		// pdfs.merge reads existing files but creates a billed render.
		expect((await retryFor(apiError(500), 'pdfs.merge')).maxRetries).toBe(0);
	});

	it('keeps an unknown error at zero retries', async () => {
		expect((await retryFor(new Error('boom'))).maxRetries).toBe(0);
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin map when there are no user handlers', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last so it cannot shadow another handler', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a user handler under a new name win over a builtin match', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_401: {
				match: (error: Error) =>
					error instanceof PlacidAPIError && error.status === 401,
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		// The user key comes first, so it is found before AUTH_ERROR.
		expect(
			(await retryFor(apiError(401), 'images.get', merged)).maxRetries,
		).toBe(7);
	});

	it('lets a user override a builtin key by name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: (error: Error) =>
					error instanceof PlacidAPIError && error.status === 401,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			(await retryFor(apiError(401), 'images.get', merged)).maxRetries,
		).toBe(1);
	});

	it('uses the user DEFAULT when one is given', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});

		expect(
			(await retryFor(new Error('boom'), 'images.get', merged)).maxRetries,
		).toBe(5);
	});
});
