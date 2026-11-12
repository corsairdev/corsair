import type { ErrorContext } from 'corsair/core';
import { U301APIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	code?: string;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
}) {
	return new U301APIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'u301',
	operation: 'links.create',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

// unknown: the handler's real return type is `RetryDecision` from `corsair/core`,
// which is not exported; the tests only await it and assert on the retry count, so
// the widened type is what they need.
function run(name: keyof typeof errorHandlers, error: Error): Promise<unknown> {
	const handler = errorHandlers[name].handler;
	// unknown: same widened return as above, applied to the Partial handler type.
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
	// DEFAULT's matcher ignores the context, so it is called with the error alone.
	return (errorHandlers.DEFAULT.match as (e: Error) => boolean)(error)
		? 'DEFAULT'
		: undefined;
}

describe('U301 error handlers', () => {
	it('matches a 401 as an auth error', async () => {
		const error = apiError({ status: 401 });

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches a 403 and an UNAUTHORIZED code without a status', async () => {
		expect(await matches(apiError({ status: 403 }))).toBe('AUTH_ERROR');
		expect(await matches(apiError({ code: 'UNAUTHORIZED' }))).toBe(
			'AUTH_ERROR',
		);
	});

	it('matches a 404 as not found', async () => {
		expect(await matches(apiError({ status: 404 }))).toBe('NOT_FOUND_ERROR');
	});

	it('treats 400 and 422 as validation failures', async () => {
		for (const status of [400, 422]) {
			expect(await matches(apiError({ status }))).toBe('VALIDATION_ERROR');
		}
	});

	it('treats a VALIDATION_FAILED code as a validation failure', async () => {
		expect(await matches(apiError({ code: 'VALIDATION_FAILED' }))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		// require() gives an untyped zod; a failed safeParse always has a ZodError.
		const error = z.object({ url: z.string() }).safeParse({}).error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a RATE_LIMITED 429 on a replayable call, since it is not the quota', async () => {
		const error = apiError({
			status: 429,
			code: 'RATE_LIMITED',
			replayable: true,
			retryAfter: 60_000,
		});

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 60_000,
		});
	});

	it('treats the documented monthly-limit code as a quota, never retried', async () => {
		const error = apiError({ status: 429, code: 'MONTHLY_LINK_LIMIT_REACHED' });

		expect(await matches(error)).toBe('QUOTA_ERROR');
		await expect(run('QUOTA_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a bare 429 with Retry-After when the call is replayable', async () => {
		const error = apiError({ status: 429, replayable: true, retryAfter: 5000 });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
		});
	});

	it('does not retry a bare 429 on a write', async () => {
		const error = apiError({ status: 429, replayable: false });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx only when the operation declared itself replayable', async () => {
		const read = apiError({ status: 503, replayable: true, method: 'GET' });
		const create = apiError({ status: 503, replayable: false, method: 'POST' });

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
