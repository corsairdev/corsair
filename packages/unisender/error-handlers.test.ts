import type { ErrorContext } from 'corsair/core';
import { UnisenderAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	code?: string;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
}) {
	return new UnisenderAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'unisender',
	operation: 'lists.list',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

// unknown: each handler returns its own retry options; the tests match on them.
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

describe('Unisender error handlers', () => {
	it('matches invalid_api_key as an auth error', async () => {
		const error = apiError({ status: 401, code: 'invalid_api_key' });

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches access_denied as an auth error too, since it is a missing key', async () => {
		// A missing key or one with API access switched off is 403, not 401.
		expect(
			await matches(apiError({ status: 403, code: 'access_denied' })),
		).toBe('AUTH_ERROR');
	});

	it('does not treat a bare 403 as a permission problem needing its own handler', async () => {
		expect(await matches(apiError({ status: 403 }))).toBe('DEFAULT');
	});

	it('matches invalid_arg as a validation failure', async () => {
		const error = apiError({ status: 400, code: 'invalid_arg' });

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('matches not_enough_money as an exhausted balance', async () => {
		const error = apiError({ code: 'not_enough_money' });

		expect(await matches(error)).toBe('QUOTA_ERROR');
		await expect(run('QUOTA_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches unknown_method before the rate-limit check', async () => {
		expect(await matches(apiError({ code: 'unknown_method' }))).toBe(
			'UNKNOWN_METHOD_ERROR',
		);
	});

	it('matches the per-key limit code as a rate limit', async () => {
		const error = apiError({
			code: 'api_call_limit_exceeded_for_api_key',
			retryAfter: 2000,
		});

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
		});
	});

	it('matches the per-IP limit code as a rate limit too', async () => {
		expect(
			await matches(apiError({ code: 'api_call_limit_exceeded_for_ip' })),
		).toBe('RATE_LIMIT_ERROR');
	});

	it('treats a ZodError as a validation failure without a code', async () => {
		const { z } = require('zod');
		const error = z.object({ title: z.string() }).safeParse({}).error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('retries retry_later only when the operation declared itself replayable', async () => {
		const read = apiError({ code: 'retry_later', replayable: true });
		// A send is never replayed, so its retry_later is not retried either.
		const send = apiError({ code: 'retry_later', replayable: false });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', send)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx only when replayable', async () => {
		const read = apiError({ status: 503, replayable: true });
		const write = apiError({ status: 503, replayable: false });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', write)).resolves.toEqual({
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
