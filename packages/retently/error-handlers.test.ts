import type { ErrorContext } from 'corsair/core';
import { RetentlyAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
}) {
	return new RetentlyAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'retently',
	operation: 'survey.send',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

// unknown: each handler returns its own retry shape; the assertions narrow it.
function run(name: keyof typeof errorHandlers, error: Error): Promise<unknown> {
	const handler = errorHandlers[name].handler;
	// The handlers are declared with a narrower error type than the host's.
	// unknown: the result is the retry shape, checked by each assertion.
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

describe('Retently error handlers', () => {
	it('matches a 429 as a rate limit and retries with backoff', async () => {
		const error = apiError({ status: 429, retryAfter: 5000 });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('backs off on its own when no Retry-After arrives, as the docs promise none', async () => {
		const error = apiError({ status: 429 });

		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches a 401 as an auth error and never retries', async () => {
		const error = apiError({ status: 401 });

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches a 403 as a permission error, not an auth error', async () => {
		const error = apiError({ status: 403 });

		expect(await matches(error)).toBe('PERMISSION_ERROR');
		await expect(run('PERMISSION_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches a 404 as not found', async () => {
		const error = apiError({ status: 404 });

		expect(await matches(error)).toBe('NOT_FOUND_ERROR');
		await expect(run('NOT_FOUND_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats 400, 409, 413 and 422 as validation failures', async () => {
		for (const status of [400, 409, 413, 422]) {
			expect(await matches(apiError({ status }))).toBe('VALIDATION_ERROR');
		}
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		const error = z.object({ id: z.string() }).safeParse({}).error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx only when the operation declared itself replayable', async () => {
		const read = apiError({ status: 503, method: 'GET', replayable: true });
		const write = apiError({ status: 503, method: 'POST', replayable: false });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', write)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not treat a 429 on a write as replayable through the server handler', async () => {
		const error = apiError({ status: 429, replayable: false });

		// A 429 is refused before it runs, so the rate-limit handler retries it
		// even for a write, and the server handler never sees it.
		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('falls back to DEFAULT for anything else', async () => {
		expect(await matches(new Error('something odd'))).toBe('DEFAULT');
		await expect(
			// unknown: the result is compared whole by toEqual below.
			(errorHandlers.DEFAULT.handler as (e: Error) => Promise<unknown>)(
				new Error('x'),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last when the caller adds handlers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.CUSTOM).toBeDefined();
	});

	it('keeps DEFAULT last when the caller overrides it', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the built-in handlers when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
