import type { ErrorContext } from 'corsair/core';
import { RealPhoneValidationAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(options: {
	status?: number;
	serviceStatus?: string;
	detail?: string;
	retryAfter?: number;
}) {
	return new RealPhoneValidationAPIError('failure', options);
}

// The handlers read the error, not the context, but the signature takes both.
const context = {
	pluginId: 'realphonevalidation',
	operation: 'turboV3',
	input: {},
	originalError: new Error('failure'),
} satisfies ErrorContext;

// unknown: each handler returns its own retry options; the tests read fields
// with toMatchObject, which needs no shared type.
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

describe('RealPhoneValidation error handlers', () => {
	it('matches the documented 403 throttle as a rate limit', async () => {
		const error = apiError({ status: 403, retryAfter: 2000 });

		expect(await matches(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not treat the 403 as an auth error, since the services have no permission model', async () => {
		const error = apiError({ status: 403 });

		expect(await matches(error)).not.toBe('AUTH_ERROR');
	});

	it('matches an unauthorized body as an auth error', async () => {
		const error = apiError({
			status: 200,
			serviceStatus: 'unauthorized',
		});

		expect(await matches(error)).toBe('AUTH_ERROR');
		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches "missing token" as an auth error', async () => {
		const error = apiError({
			serviceStatus: 'ERROR',
			detail: 'missing token',
		});

		expect(await matches(error)).toBe('AUTH_ERROR');
	});

	it('matches code 102 as an exhausted balance, not an auth error', async () => {
		const error = apiError({
			serviceStatus: '102',
			detail: 'The user is invalid',
		});

		expect(await matches(error)).toBe('QUOTA_ERROR');
		await expect(run('QUOTA_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('treats invalid-phone and its spellings as validation failures', async () => {
		for (const serviceStatus of [
			'invalid phone',
			'invalid-format',
			'invalid-phone',
			'bad-zip-code',
			'-1',
		]) {
			expect(await matches(apiError({ serviceStatus }))).toBe(
				'VALIDATION_ERROR',
			);
		}
	});

	it('treats a ZodError as a validation failure without a status', async () => {
		const { z } = require('zod');
		const error = z.object({ phone: z.string() }).safeParse({}).error as Error;

		expect(await matches(error)).toBe('VALIDATION_ERROR');
	});

	it('matches server-unavailable, allowing one retry', async () => {
		const error = apiError({ serviceStatus: 'server-unavailable' });

		expect(await matches(error)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', error)).resolves.toMatchObject({
			maxRetries: 1,
		});
	});

	it('matches a 5xx as a server error', async () => {
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
