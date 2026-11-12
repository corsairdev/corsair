import type { ErrorContext } from 'corsair/core';
import { RoboflowAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	type?: string;
	replayable?: boolean;
	method?: string;
	retryAfter?: number;
}) {
	return new RoboflowAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'roboflow',
	operation: 'infer',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

// unknown: handlers return different retry configurations, asserted by each test.
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

describe('Roboflow error handlers', () => {
	it('matches a 401 as an auth error', async () => {
		const error = apiError({ status: 401 });

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches an OAuthException by its type even with no status', async () => {
		expect(await matches(apiError({ type: 'OAuthException' }))).toBe(
			'AUTH_ERROR',
		);
	});

	it('matches a 403 as a permission error', async () => {
		expect(await matches(apiError({ status: 403 }))).toBe('PERMISSION_ERROR');
	});

	it('matches a 404 as not found', async () => {
		expect(await matches(apiError({ status: 404 }))).toBe('NOT_FOUND_ERROR');
	});

	it('matches a 409 conflict without retrying', async () => {
		const error = apiError({ status: 409 });

		expect(await matches(error)).toBe('CONFLICT_ERROR');
		await expect(run('CONFLICT_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats 400 and 422 as validation failures', async () => {
		for (const status of [400, 422]) {
			expect(await matches(apiError({ status }))).toBe('VALIDATION_ERROR');
		}
	});

	it('treats a rejected model ID as a validation failure, not a crash', async () => {
		const error = new RoboflowAPIError(
			'Roboflow modelId must look like project/version, received "x".',
			{},
		);

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		const error = z.object({ modelId: z.string() }).safeParse({})
			.error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('matches a 429 as a rate limit if one arrives', async () => {
		const error = apiError({ status: 429, retryAfter: 2000, replayable: true });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
		});
	});

	it('does not retry a rate-limited write', async () => {
		const error = apiError({ status: 429, replayable: false, method: 'POST' });
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx only when the operation declared itself replayable', async () => {
		const read = apiError({ status: 503, replayable: true, method: 'GET' });
		// Inference is billed per image, so it is never resent.
		const infer = apiError({ status: 503, replayable: false, method: 'POST' });

		expect(await matches(read)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', read)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(run('SERVER_ERROR', infer)).resolves.toEqual({
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
