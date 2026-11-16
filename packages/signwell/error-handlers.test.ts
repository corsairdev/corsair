import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
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
	return new ApiError(
		{
			method: (options.method ?? 'GET') as 'GET' | 'POST',
			url: '/v1/documents',
		},
		{
			url: 'https://www.signwell.com/api/v1/documents',
			ok: false,
			status: options.status ?? 0,
			statusText: '',
			body: options.body,
		},
		`SignWell ${options.status}`,
		{ retryAfter: options.retryAfter },
	);
}

const context = (error: Error) => ({
	pluginId: 'signwell',
	operation: 'test',
	input: {},
	originalError: error,
});

// Picks the handler the way core does (first match in key order), so a test
// fails when its handler's matcher stops matching.
async function run(name: keyof typeof errorHandlers, error: Error) {
	const selected = Object.entries(errorHandlers).find(([, entry]) =>
		entry?.match(error, context(error)),
	);
	expect(selected?.[0]).toBe(name);
	const entry = errorHandlers[name];
	if (!entry) throw new Error(`missing handler ${name}`);
	return entry.handler(error, context(error));
}

function matches(name: keyof typeof errorHandlers, error: Error) {
	return errorHandlers[name]?.match(error, context(error));
}

describe('signwell error handlers', () => {
	it('retries a 429 three times and keeps the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 5000 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
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

	it('treats a 400 with an auth body code as an auth error', () => {
		const error = build({
			status: 400,
			body: { meta: { error: 'api_key_unauthorized_error' } },
		});

		expect(matches('AUTH_ERROR', error)).toBe(true);
	});

	it('does not retry a 422', async () => {
		await expect(
			run(
				'VALIDATION_ERROR',
				build({ status: 422, body: { errors: { name: ['required'] } } }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400', async () => {
		await expect(
			run('VALIDATION_ERROR', build({ status: 400 })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('matches a ZodError without a status', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		await expect(run('VALIDATION_ERROR', zodError)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 404 or a 409', async () => {
		await expect(
			run('NOT_FOUND_ERROR', build({ status: 404 })),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			run('NOT_FOUND_ERROR', build({ status: 409 })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('replays a 500 on a read', async () => {
		await expect(
			run('SERVER_ERROR', build({ status: 500, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 500 on a write', () => {
		expect(
			matches('SERVER_ERROR', build({ status: 500, method: 'POST' })),
		).toBe(false);
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({ status: 418, method: 'GET' });
		expect(matches('DEFAULT', error)).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('signwell error classification', () => {
	it('treats a meta.error auth code as an auth error', async () => {
		const error = build({
			status: 403,
			body: { meta: { error: 'api_key_unauthorized_error' } },
		});

		await expect(run('AUTH_ERROR', error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('is not an auth error for a plain 422', () => {
		const error = build({
			status: 422,
			body: { errors: { name: ['required'] } },
		});

		expect(matches('AUTH_ERROR', error)).toBe(false);
	});
});
