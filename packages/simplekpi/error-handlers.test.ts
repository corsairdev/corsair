import type { CorsairErrorHandler } from 'corsair/core';
import { SimplekpiAPIError } from './client';
import { errorHandlers as builtinHandlers } from './error-handlers';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

function build(options: {
	status?: number;
	method?: string;
	retryAfter?: number;
}) {
	return new SimplekpiAPIError(`SimpleKPI ${options.status}`, {
		status: options.status,
		method: options.method,
		retryAfter: options.retryAfter,
	});
}

const context = (error: Error) => ({
	pluginId: 'simplekpi',
	operation: 'test',
	input: {},
	originalError: error,
});

async function run(name: keyof typeof errorHandlers, error: Error) {
	const entry = errorHandlers[name];
	if (!entry) throw new Error(`missing handler ${name}`);
	return entry.handler(error, context(error));
}

function matches(name: keyof typeof errorHandlers, error: Error) {
	return errorHandlers[name]?.match(error, context(error));
}

describe('simplekpi error handlers', () => {
	it('retries a 429 three times and keeps the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 1200 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 1200,
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

	it('does not retry a 403, because the key lacks a scope', async () => {
		await expect(
			run('PERMISSION_ERROR', build({ status: 403 })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it.each([400, 404, 409])('does not retry a %i', async (status) => {
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

	it('replays a 5xx on a read', async () => {
		await expect(
			run('SERVER_ERROR', build({ status: 500, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a write, because entries are upserts', () => {
		expect(
			matches('SERVER_ERROR', build({ status: 500, method: 'POST' })),
		).toBe(false);
		expect(matches('SERVER_ERROR', build({ status: 500, method: 'PUT' }))).toBe(
			false,
		);
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({ status: 418, method: 'GET' });
		expect(matches('DEFAULT', error)).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('simplekpi error classification', () => {
	it('separates auth from scope', () => {
		expect(build({ status: 401 }).isAuthError).toBe(true);
		expect(build({ status: 401 }).isScopeError).toBe(false);
		expect(build({ status: 403 }).isScopeError).toBe(true);
		expect(build({ status: 403 }).isAuthError).toBe(false);
	});
});
