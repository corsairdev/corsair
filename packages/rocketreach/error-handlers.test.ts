import type { ErrorContext } from 'corsair/core';
import { RocketReachAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
	creditType?: string;
}) {
	return new RocketReachAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'rocketreach',
	operation: 'person.lookup',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

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

describe('RocketReach error handlers', () => {
	it('matches a 429 as a rate limit and retries with the Retry-After it sends', async () => {
		const error = apiError({ status: 429, retryAfter: 7000 });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 7000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches a 401 as an auth error', async () => {
		const error = apiError({ status: 401 });

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches a 402 as an empty credit pool, not a rate limit', async () => {
		const error = apiError({ status: 402, creditType: 'email_verification' });

		expect(await matches(error)).toBe('OUT_OF_CREDITS_ERROR');
		await expect(run('OUT_OF_CREDITS_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats a 403 without a credit_type as spent lookup credits', async () => {
		const error = apiError({ status: 403 });

		expect(await matches(error)).toBe('OUT_OF_LOOKUP_CREDITS_ERROR');
		await expect(run('OUT_OF_LOOKUP_CREDITS_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not treat a 403 as an auth failure', async () => {
		expect(await matches(apiError({ status: 403 }))).not.toBe('AUTH_ERROR');
	});

	it('treats 400, 413 and 422 as validation failures', async () => {
		for (const status of [400, 413, 422]) {
			expect(await matches(apiError({ status }))).toBe('VALIDATION_ERROR');
		}
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		const error = z.object({ email: z.string() }).safeParse({}).error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('matches a 404 as not found', async () => {
		expect(await matches(apiError({ status: 404 }))).toBe('NOT_FOUND_ERROR');
	});

	it('retries a 5xx only when the operation declared itself replayable', async () => {
		const read = apiError({ status: 503, method: 'GET', replayable: true });
		// A lookup spends a credit, so its 5xx is never replayed.
		const lookup = apiError({ status: 503, method: 'GET', replayable: false });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', lookup)).resolves.toEqual({
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
