import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isSimplesatAuthError } from './client';
import { errorHandlers as builtinHandlers } from './error-handlers';
import type { JsonObject } from './json';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

function build(options: {
	status?: number;
	method?: string;
	retryAfter?: number;
	body?: JsonObject;
}) {
	// The error core's request() throws, as the client passes it on.
	return new ApiError(
		{ method: (options.method ?? 'GET') as 'GET', url: '/api/v1/surveys' },
		{
			url: 'https://api.simplesat.io/api/v1/surveys',
			ok: false,
			status: options.status ?? 500,
			statusText: 'failed',
			body: options.body ?? {},
		},
		`Simplesat ${options.status}`,
		{ retryAfter: options.retryAfter },
	);
}

const context = (error: Error) => ({
	pluginId: 'simplesat',
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

describe('simplesat error handlers', () => {
	it('retries a 429 three times and keeps the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 8000 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 8000,
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

	it('treats a 403 as an auth error, because that is how Simplesat rejects a key', async () => {
		await expect(
			run(
				'AUTH_ERROR',
				build({ status: 403, body: { detail: 'Invalid Token.' } }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('also treats a 401 as an auth error, in case the API ever uses one', async () => {
		await expect(run('AUTH_ERROR', build({ status: 401 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches a 403 by its body even with no status', () => {
		const error = build({ body: { detail: 'No API Key Provided.' } });
		expect(matches('AUTH_ERROR', error)).toBe(true);
	});

	it('does not treat a 404 as an auth error', () => {
		const error = build({
			status: 404,
			body: { detail: 'No Customer matches.' },
		});
		expect(matches('AUTH_ERROR', error)).toBe(false);
		expect(matches('VALIDATION_ERROR', error)).toBe(true);
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
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

	it('does not replay a 5xx on a write, because the customer routes are upserts', () => {
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

describe('simplesat error classification', () => {
	it('reads not-found separately from auth', () => {
		expect(build({ status: 404 }).status).toBe(404);
		expect(isSimplesatAuthError(build({ status: 404 }))).toBe(false);
		expect(isSimplesatAuthError(build({ status: 403 }))).toBe(true);
	});
});
