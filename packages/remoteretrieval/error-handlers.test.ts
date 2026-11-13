import type { ErrorContext } from 'corsair/core';
import { RemoteRetrievalAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	code?: number;
	customCode?: number;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
}) {
	return new RemoteRetrievalAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'remoteretrieval',
	operation: 'orders.create',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

// unknown: each handler returns its own retry options; the tests match on fields.
function run(name: keyof typeof errorHandlers, error: Error): Promise<unknown> {
	const handler = errorHandlers[name].handler;
	return (handler as (e: Error, c: ErrorContext) => Promise<unknown>)(
		error,
		context,
	);
}

// unknown: a match function only inspects the error it is handed.
async function matches(error: Error): Promise<string | undefined> {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (name === 'DEFAULT') continue;
		// unknown: the matcher's second argument is the host's context.
		if ((handler.match as (e: Error, c: unknown) => boolean)(error, context)) {
			return name;
		}
	}
	return (errorHandlers.DEFAULT.match as (e: Error) => boolean)(error)
		? 'DEFAULT'
		: undefined;
}

describe('Remote Retrieval error handlers', () => {
	it('matches a 401 as an auth error', async () => {
		const error = apiError({ status: 401, code: 401, customCode: 401 });

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches a body-level 401 even with no HTTP status', async () => {
		expect(await matches(apiError({ code: 401 }))).toBe('AUTH_ERROR');
	});

	it('matches a 404 as not found', async () => {
		expect(await matches(apiError({ status: 404 }))).toBe('NOT_FOUND_ERROR');
	});

	it('treats 400 and 422 as validation failures', async () => {
		for (const status of [400, 422]) {
			expect(await matches(apiError({ status }))).toBe('VALIDATION_ERROR');
		}
	});

	it('treats a body-level 422 from a 200 as a validation failure', async () => {
		expect(await matches(apiError({ code: 422 }))).toBe('VALIDATION_ERROR');
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		// any: only the missing `orders` key matters here, not the item shape.
		const error = z.object({ orders: z.array(z.any()) }).safeParse({})
			.error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('matches a 429 as a rate limit if one arrives', async () => {
		const error = apiError({ status: 429, retryAfter: 3000, replayable: true });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 2,
			headersRetryAfterMs: 3000,
		});
	});

	it('never retries a create that got a 429', async () => {
		// A resend would book and bill a second shipment.
		const create = apiError({
			status: 429,
			method: 'POST',
			retryAfter: 3000,
			replayable: false,
		});

		expect(await matches(create)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', create)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx only when the operation declared itself replayable', async () => {
		const read = apiError({ status: 503, method: 'GET', replayable: true });
		// Creating an order books a real shipment, so it is never resent.
		const create = apiError({ status: 503, method: 'POST', replayable: false });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', create)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('falls back to DEFAULT for anything else', async () => {
		expect(await matches(new Error('something odd'))).toBe('DEFAULT');
	});

	it('keeps DEFAULT last when the caller adds handlers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the built-in handlers when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
