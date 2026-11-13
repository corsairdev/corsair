import type { ErrorContext } from 'corsair/core';
import { RudderStackTransformationAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
}) {
	return new RudderStackTransformationAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'rudderstacktransform',
	operation: 'transformations.list',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

function run(name: keyof typeof errorHandlers, error: Error) {
	const handler = errorHandlers[name].handler;
	return handler(error);
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

describe('RudderStack error handlers', () => {
	it('matches a 429 as a rate limit and retries with backoff', async () => {
		const error = apiError({ status: 429, retryAfter: 4000 });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('backs off on its own, as the threshold is undocumented', async () => {
		await expect(
			run('RATE_LIMIT_ERROR', apiError({ status: 429 })),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches a 401 as an auth error', async () => {
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
		expect(await matches(apiError({ status: 404 }))).toBe('NOT_FOUND_ERROR');
	});

	it('treats 400 and 422 as validation failures', async () => {
		for (const status of [400, 422]) {
			expect(await matches(apiError({ status }))).toBe('VALIDATION_ERROR');
		}
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		const error = z.object({ name: z.string() }).safeParse({}).error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx only when the operation declared itself replayable', async () => {
		const read = apiError({ status: 503, method: 'GET', replayable: true });
		// An update always writes a revision, so its 5xx is never replayed.
		const update = apiError({ status: 503, method: 'POST', replayable: false });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', update)).resolves.toEqual({
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
