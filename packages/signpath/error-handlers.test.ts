import type { CorsairErrorHandler } from 'corsair/core';
import { SignpathAPIError } from './client';
import { errorHandlers as builtinHandlers } from './error-handlers';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

function build(options: {
	status?: number;
	method?: string;
	retryAfter?: number;
}) {
	return new SignpathAPIError(`SignPath ${options.status}`, {
		status: options.status,
		method: options.method,
		retryAfter: options.retryAfter,
	});
}

// The handler map is a Partial on the CorsairErrorHandler type.
async function run(name: keyof typeof errorHandlers, error: Error) {
	const entry = errorHandlers[name];
	if (!entry) throw new Error(`missing handler ${name}`);
	return entry.handler(error, {
		pluginId: 'signpath',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

describe('signpath error handlers', () => {
	it('retries a 429 three times with backoff and the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 2500 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('leaves the fallback delay unset when no Retry-After arrived', async () => {
		const result = await run('RATE_LIMIT_ERROR', build({ status: 429 }));

		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401', async () => {
		await expect(run('AUTH_ERROR', build({ status: 401 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 403', async () => {
		await expect(
			run('PERMISSION_ERROR', build({ status: 403 })),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it.each([400, 404, 410])('does not retry a %i', async (status) => {
		await expect(run('VALIDATION_ERROR', build({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches a ZodError without a status', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		await expect(run('VALIDATION_ERROR', zodError)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 500 on a read', async () => {
		await expect(
			run('SERVER_ERROR', build({ status: 500, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 500 on a write', async () => {
		const error = build({ status: 500, method: 'POST' });
		expect(
			errorHandlers.SERVER_ERROR?.match(error, {
				pluginId: 'signpath',
				operation: 'test',
				input: {},
				originalError: error,
			}),
		).toBe(false);
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({ status: 418, method: 'GET' });
		expect(
			errorHandlers.DEFAULT?.match(error, {
				pluginId: 'signpath',
				operation: 'test',
				input: {},
				originalError: error,
			}),
		).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('signpath error classification', () => {
	it('reads auth and permission errors from the status', () => {
		expect(build({ status: 401 }).isAuthError).toBe(true);
		expect(build({ status: 401 }).isPermissionError).toBe(false);
		expect(build({ status: 403 }).isPermissionError).toBe(true);
		expect(build({ status: 400 }).isAuthError).toBe(false);
	});
});
