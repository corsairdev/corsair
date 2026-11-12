import type { ErrorContext } from 'corsair/core';
import { RagicAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	code?: number;
	status?: number;
	replayable?: boolean;
	method?: string;
}) {
	return new RagicAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'ragic',
	operation: 'records.list',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

// unknown: each handler returns its own retry shape; the tests read fields off it.
function run(name: keyof typeof errorHandlers, error: Error): Promise<unknown> {
	const handler = errorHandlers[name].handler;
	// Handlers are typed for any plugin's context; this one only reads the error.
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

describe('Ragic error handlers', () => {
	it('matches code 105 as an auth error', async () => {
		const error = apiError({ code: 105 });

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches code 106 as an auth error, since a bad key and a permission gap share it', async () => {
		expect(await matches(apiError({ code: 106 }))).toBe('AUTH_ERROR');
	});

	it('matches code 304, an invalid secret key, as an auth error', async () => {
		expect(await matches(apiError({ code: 304 }))).toBe('AUTH_ERROR');
	});

	it('matches code 404, a missing record, as not found', async () => {
		expect(await matches(apiError({ code: 404 }))).toBe('NOT_FOUND_ERROR');
	});

	it('matches code 109 as an exhausted record allowance', async () => {
		const error = apiError({ code: 109 });

		expect(await matches(error)).toBe('QUOTA_ERROR');
		await expect(run('QUOTA_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches code 303 as an expired account, not an auth error', async () => {
		expect(await matches(apiError({ code: 303 }))).toBe('QUOTA_ERROR');
	});

	it('matches the four address codes as not found', async () => {
		for (const code of [101, 102, 103, 108]) {
			expect(await matches(apiError({ code }))).toBe('NOT_FOUND_ERROR');
		}
	});

	it('treats 104, 201, 202 and a locked record (402) as validation failures', async () => {
		for (const code of [104, 201, 202, 402]) {
			expect(await matches(apiError({ code }))).toBe('VALIDATION_ERROR');
		}
	});

	it('treats a ZodError as a validation failure without a code', async () => {
		const { z } = require('zod');
		// require() gives an untyped zod; a failed safeParse always has a ZodError.
		const error = z.object({ account: z.string() }).safeParse({})
			.error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx code only when the operation declared itself replayable', async () => {
		const read = apiError({ code: 500, method: 'GET', replayable: true });
		const create = apiError({ code: 500, method: 'POST', replayable: false });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', create)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a rate-limited read: HTTP 429 or body code 204', async () => {
		const status429 = apiError({
			status: 429,
			method: 'GET',
			replayable: true,
		});
		const code204 = apiError({ code: 204, method: 'GET', replayable: true });

		expect(await matches(status429)).toBe('RATE_LIMIT_ERROR');
		expect(await matches(code204)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', code204)).resolves.toMatchObject({
			maxRetries: 3,
		});
	});

	it('waits for Retry-After on a rate-limited read when Ragic sends one', async () => {
		const error = new RagicAPIError('slow down', {
			status: 429,
			retryAfter: 5000,
			method: 'GET',
			replayable: true,
		});

		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
		});
	});

	it('does not resend a rate-limited create', async () => {
		const error = apiError({ status: 429, method: 'POST', replayable: false });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches an HTTP 500 as a server error too', async () => {
		expect(await matches(apiError({ status: 503 }))).toBe('SERVER_ERROR');
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
