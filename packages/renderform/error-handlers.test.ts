import type { ErrorContext, RetryStrategy } from 'corsair/core';
import { RenderformAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	message?: string;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
}) {
	return new RenderformAPIError(options.message ?? 'failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'renderform',
	operation: 'render',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

function run(
	name: keyof typeof errorHandlers,
	error: Error,
): Promise<RetryStrategy> {
	const handler = errorHandlers[name].handler;
	return (handler as (e: Error, c: ErrorContext) => Promise<RetryStrategy>)(
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

describe('Renderform error handlers', () => {
	it('matches a bad key at 400 as an auth error, before validation', async () => {
		const error = apiError({
			status: 400,
			message: 'Renderform 400: Incorrect API Key',
		});

		// The auth handler must win: a 400 alone would read as a bad body.
		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches a genuine 400 as a validation failure', async () => {
		const error = apiError({
			status: 400,
			message: 'Renderform 400: Validation failed',
		});

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('matches a 402 as an exhausted credit balance', async () => {
		const error = apiError({
			status: 402,
			message: 'Renderform 402: No credits',
		});

		expect(await matches(error)).toBe('QUOTA_ERROR');
		await expect(run('QUOTA_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches a 404 as not found', async () => {
		expect(
			await matches(apiError({ status: 404, message: 'Resource not found' })),
		).toBe('NOT_FOUND_ERROR');
	});

	it('treats 422 as a validation failure', async () => {
		expect(await matches(apiError({ status: 422, message: 'bad' }))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		const error = z.object({ template: z.string() }).safeParse({})
			.error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('matches a 429 as a rate limit if one arrives', async () => {
		const error = apiError({ status: 429, retryAfter: 1000 });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 1000,
		});
	});

	it('retries a 5xx only when the operation declared itself replayable', async () => {
		const read = apiError({ status: 503, replayable: true, method: 'GET' });
		// A render spends a credit and produces a new file, so it is never replayed.
		const render = apiError({ status: 503, replayable: false, method: 'POST' });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', render)).resolves.toEqual({
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
